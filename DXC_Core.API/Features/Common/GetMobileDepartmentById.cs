using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetMobileDepartmentById
{
    public class Query : IRequest<ApiResult<DepartmentMobileDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(q => q.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không hợp lệ.");
        }
    }

    public class Handler : IRequestHandler<Query, ApiResult<DepartmentMobileDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<DepartmentMobileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments
                .AsNoTracking()
                .Include(d => d.Organization)
                .Where(d => d.PublicId == request.PublicId && d.IsActive && d.Organization.IsActive)
                .Select(d => new DepartmentMobileDto
                {
                    PublicId = d.PublicId,
                    Code = d.Code,
                    Name = d.Name,
                    Description = d.Description,
                    OrganizationPublicId = d.Organization.PublicId,
                    OrganizationName = d.Organization.Name
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (department == null)
            {
                return new ApiResult<DepartmentMobileDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phòng ban"
                };
            }

            return new ApiResult<DepartmentMobileDto>
            {
                Success = true,
                Data = department
            };
        }
    }
}
