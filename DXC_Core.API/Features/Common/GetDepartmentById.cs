using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetDepartmentById
{
    public class Query : IRequest<ApiResult<DepartmentWithOrganizationDto>>
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

    public class Handler : IRequestHandler<Query, ApiResult<DepartmentWithOrganizationDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<DepartmentWithOrganizationDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments
                .AsNoTracking()
                .Include(d => d.Organization)
                .Where(d => d.PublicId == request.PublicId && d.IsActive && d.Organization.IsActive)
                .Select(d => new DepartmentWithOrganizationDto
                {
                    PublicId = d.PublicId,
                    Code = d.Code,
                    Name = d.Name,
                    Description = d.Description,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt,
                    OrganizationPublicId = d.Organization.PublicId,
                    OrganizationName = d.Organization.Name,
                    Organization = new OrganizationDto
                    {
                        PublicId = d.Organization.PublicId,
                        Code = d.Organization.Code,
                        Name = d.Organization.Name,
                        Description = d.Organization.Description,
                        IsActive = d.Organization.IsActive,
                        CreatedAt = d.Organization.CreatedAt,
                        UpdatedAt = d.Organization.UpdatedAt,
                        DepartmentCount = 0 // Avoid circular reference
                    }
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (department == null)
            {
                return new ApiResult<DepartmentWithOrganizationDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phòng ban hoặc phòng ban đã bị xóa"
                };
            }

            return new ApiResult<DepartmentWithOrganizationDto>
            {
                Success = true,
                Data = department
            };
        }
    }
}
