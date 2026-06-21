using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class DeleteOcopEnterprise
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
            var enterprise = await _context.OcopEnterprises
                .FirstOrDefaultAsync(e => e.PublicId == request.PublicId, cancellationToken);

            if (enterprise == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy doanh nghiệp OCOP"
                };
            }

            // Check if enterprise has products
            var hasProducts = await _context.OcopProducts
                .AnyAsync(p => p.EnterpriseId == enterprise.Id, cancellationToken);

            if (hasProducts)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không thể xóa doanh nghiệp vì vẫn còn sản phẩm thuộc doanh nghiệp này"
                };
            }

            _context.OcopEnterprises.Remove(enterprise);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa doanh nghiệp OCOP thành công"
            };
        }
    }
}