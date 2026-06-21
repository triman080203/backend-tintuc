using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopProductCategories
{
    public class Query : IRequest<PagedResult<OcopProductCategoryDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<OcopProductCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<OcopProductCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.OcopProductCategories.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(c => c.Name.Contains(request.Name));
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(c => c.IsActive == request.IsActive.Value);
            }

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var categories = await query
                .OrderBy(c => c.DisplayOrder)
                .ThenBy(c => c.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new OcopProductCategoryDto
                {
                    PublicId = c.PublicId,
                    Name = c.Name,
                    Description = c.Description,
                    ImageUrl = c.ImagePublicId.HasValue ? $"/api/files/{c.ImagePublicId}" : c.ImageUrl,
                    ImagePublicId = c.ImagePublicId,
                    DisplayOrder = c.DisplayOrder,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<OcopProductCategoryDto>
            {
                Success = true,
                Data = categories,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách danh mục sản phẩm OCOP thành công"
            };
        }
    }
}
