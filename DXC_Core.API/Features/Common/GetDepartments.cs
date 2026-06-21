using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetDepartments
{
    public class Query : IRequest<PagedResult<DepartmentDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? Code { get; set; }
        public Guid? OrganizationPublicId { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current)
                .GreaterThan(0)
                .WithMessage("Current page must be greater than 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .LessThanOrEqualTo(100)
                .WithMessage("Page size must be between 1 and 100");
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Query, PagedResult<DepartmentDto>>
    {
        public async Task<PagedResult<DepartmentDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = dbContext.Departments
                .Include(d => d.Organization)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.Name))
            {
                query = query.Where(d => d.Name.Contains(request.Name));
            }

            if (!string.IsNullOrEmpty(request.Code))
            {
                query = query.Where(d => d.Code.Contains(request.Code));
            }

            if (request.OrganizationPublicId.HasValue)
            {
                query = query.Where(d => d.Organization.PublicId == request.OrganizationPublicId.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(d => d.IsActive == request.IsActive.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var departments = await query
                .OrderBy(d => d.Organization.Name)
                .ThenBy(d => d.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(d => new DepartmentDto
                {
                    PublicId = d.PublicId,
                    Code = d.Code,
                    Name = d.Name,
                    Description = d.Description,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt,
                    OrganizationPublicId = d.Organization.PublicId,
                    OrganizationName = d.Organization.Name
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<DepartmentDto>
            {
                Success = true,
                Data = departments,
                Total = totalCount,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
