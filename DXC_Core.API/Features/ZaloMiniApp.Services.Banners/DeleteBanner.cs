using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

public static class DeleteBanner
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult>
    {
        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var banner = await context.Banners
                .FirstOrDefaultAsync(b => b.PublicId == request.PublicId, cancellationToken);

            if (banner == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Banner không tồn tại"
                };
            }

            // Soft delete
            banner.IsActive = false;
            banner.UpdatedAt = DateTime.UtcNow;

            await context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Banner đã được xóa thành công"
            };
        }
    }
}