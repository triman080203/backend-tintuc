using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetDepartmentUsers
{
    public class Query : IRequest<PagedResult<DepartmentUserDto>>
    {
        public required Guid DepartmentPublicId { get; set; }
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? UserName { get; set; }
        public string? FullName { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(q => q.DepartmentPublicId)
                .NotEmpty()
                .WithMessage("DepartmentPublicId không hợp lệ.");

            RuleFor(q => q.Current)
                .GreaterThan(0)
                .WithMessage("Current phải lớn hơn 0.");

            RuleFor(q => q.PageSize)
                .GreaterThan(0)
                .LessThanOrEqualTo(100)
                .WithMessage("PageSize phải lớn hơn 0 và không quá 100.");

            RuleFor(q => q.DepartmentPublicId)
                .MustAsync(DepartmentMustExist)
                .WithMessage("Không tìm thấy phòng ban.");
        }

        private async Task<bool> DepartmentMustExist(Guid departmentPublicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Departments
                .AnyAsync(d => d.PublicId == departmentPublicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<DepartmentUserDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<DepartmentUserDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments
                .FirstOrDefaultAsync(d => d.PublicId == request.DepartmentPublicId, cancellationToken);

            if (department == null)
            {
                return new PagedResult<DepartmentUserDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phòng ban"
                };
            }

            var query = _dbContext.UserDepartments
                .Where(ud => ud.DepartmentId == department.Id)
                .Include(ud => ud.User)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.UserName))
            {
                query = query.Where(ud => ud.User.UserName.Contains(request.UserName));
            }

            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                query = query.Where(ud => ud.User.FullName.Contains(request.FullName));
            }

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination
            var skip = (request.Current - 1) * request.PageSize;
            var data = await query
                .OrderBy(ud => ud.User.FullName)
                .Skip(skip)
                .Take(request.PageSize)
                .Select(ud => new DepartmentUserDto
                {
                    UserPublicId = ud.User.PublicId,
                    UserName = ud.User.UserName,
                    FullName = ud.User.FullName,
                    Email = ud.User.Email,
                    IsActive = ud.User.IsActive,
                    CreatedAt = ud.User.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<DepartmentUserDto>
            {
                Success = true,
                Data = data,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
