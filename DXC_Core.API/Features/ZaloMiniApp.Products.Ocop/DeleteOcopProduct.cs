using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class DeleteOcopProduct
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
            var product = await _context.OcopProducts
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.PublicId == request.PublicId, cancellationToken);

            if (product == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy sản phẩm OCOP"
                };
            }

            // Remove associated images first
            _context.OcopProductImages.RemoveRange(product.Images);

            // Remove the product
            _context.OcopProducts.Remove(product);

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa sản phẩm OCOP thành công"
            };
        }
    }
}