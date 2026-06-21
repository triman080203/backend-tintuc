using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopProductCategoriesMobile
{
    public class Query : IRequest<ApiResult<List<OcopProductCategoryDto>>>
    {
    }

    public class Handler : IRequestHandler<Query, ApiResult<List<OcopProductCategoryDto>>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<List<OcopProductCategoryDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var categories = await _context.OcopProductCategories
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .ThenBy(c => c.Name)
                .Select(c => new OcopProductCategoryDto
                {
                    PublicId = c.PublicId,
                    Name = c.Name,
                    Description = c.Description,
                    ImageUrl = c.ImageUrl,
                    DisplayOrder = c.DisplayOrder,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new ApiResult<List<OcopProductCategoryDto>>
            {
                Success = true,
                Data = categories,
                Message = "Lấy danh sách danh mục sản phẩm OCOP thành công"
            };
        }
    }
}