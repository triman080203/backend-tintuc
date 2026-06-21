using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopProductCategoryById
{
    public class Query : IRequest<ApiResult<OcopProductCategoryDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<OcopProductCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<OcopProductCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var category = await _context.OcopProductCategories
                .Where(c => c.PublicId == request.PublicId)
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
                .FirstOrDefaultAsync(cancellationToken);

            if (category == null)
            {
                return new ApiResult<OcopProductCategoryDto>
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục sản phẩm OCOP"
                };
            }

            return new ApiResult<OcopProductCategoryDto>
            {
                Success = true,
                Data = category,
                Message = "Lấy thông tin danh mục sản phẩm OCOP thành công"
            };
        }
    }
}
