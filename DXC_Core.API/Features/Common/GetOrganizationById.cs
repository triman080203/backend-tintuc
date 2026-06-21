using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetOrganizationById
{
    public class Query : IRequest<ApiResult<OrganizationWithDepartmentsDto>>
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

    public class Handler : IRequestHandler<Query, ApiResult<OrganizationWithDepartmentsDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<OrganizationWithDepartmentsDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var organization = await _dbContext.Organizations
                .AsNoTracking()
                .Include(o => o.Departments)
                .Where(o => o.PublicId == request.PublicId && o.IsActive)
                .Select(o => new OrganizationWithDepartmentsDto
                {
                    PublicId = o.PublicId,
                    Code = o.Code,
                    Name = o.Name,
                    Description = o.Description,
                    IsActive = o.IsActive,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt,
                    DepartmentCount = o.Departments.Count(d => d.IsActive),
                    Departments = o.Departments
                        .Where(d => d.IsActive)
                        .OrderBy(d => d.Name)
                        .Select(d => new DepartmentDto
                        {
                            PublicId = d.PublicId,
                            Code = d.Code,
                            Name = d.Name,
                            Description = d.Description,
                            IsActive = d.IsActive,
                            CreatedAt = d.CreatedAt,
                            UpdatedAt = d.UpdatedAt,
                            OrganizationPublicId = o.PublicId,
                            OrganizationName = o.Name
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (organization == null)
            {
                return new ApiResult<OrganizationWithDepartmentsDto>
                {
                    Success = false,
                    Message = "Không tìm thấy tổ chức hoặc tổ chức đã bị xóa"
                };
            }

            return new ApiResult<OrganizationWithDepartmentsDto>
            {
                Success = true,
                Data = organization
            };
        }
    }
}
