using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class DeleteOcopProductCategory
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await _context.OcopProductCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.PublicId, cancellationToken);

            if (category == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục sản phẩm OCOP"
                };
            }

            // Check if category has active products
            var hasActiveProducts = await _context.OcopProducts
                .AnyAsync(p => p.CategoryId == category.Id && p.IsActive, cancellationToken);

            if (hasActiveProducts)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không thể xóa danh mục vì vẫn còn sản phẩm đang hoạt động thuộc danh mục này"
                };
            }

            // Soft delete
            category.IsActive = false;
            category.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa danh mục sản phẩm OCOP thành công"
            };
        }
    }
}