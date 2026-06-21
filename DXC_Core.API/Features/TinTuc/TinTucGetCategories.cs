using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class TinTucGetCategories
{
    public class Query : IRequest<PagedResult<TinTucCategoryDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<TinTucCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<TinTucCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.TinTucCategories.AsQueryable();

            if (request.IsActive.HasValue)
            {
                query = query.Where(c => c.IsActive == request.IsActive.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(c => c.Name.Contains(request.Keyword));
            }

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderBy(c => c.DisplayOrder)
                .ThenByDescending(c => c.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new TinTucCategoryDto
                {
                    Id = c.Id,
                    PublicId = c.PublicId,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    DisplayOrder = c.DisplayOrder,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<TinTucCategoryDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = $"Tìm thấy {total} danh mục"
            };
        }
    }
}
