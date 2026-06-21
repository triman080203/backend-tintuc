using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetMobileOrganizations
{
    public class Query : IRequest<PagedResult<OrganizationMobileDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? Code { get; set; }
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

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Query, PagedResult<OrganizationMobileDto>>
    {
        public async Task<PagedResult<OrganizationMobileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = dbContext.Organizations
                .Where(o => o.IsActive)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.Name))
            {
                query = query.Where(o => o.Name.Contains(request.Name));
            }

            if (!string.IsNullOrEmpty(request.Code))
            {
                query = query.Where(o => o.Code.Contains(request.Code));
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var organizations = await query
                .OrderBy(o => o.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(o => new OrganizationMobileDto
                {
                    PublicId = o.PublicId,
                    Code = o.Code,
                    Name = o.Name,
                    Description = o.Description
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<OrganizationMobileDto>
            {
                Success = true,
                Data = organizations,
                Total = totalCount,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
