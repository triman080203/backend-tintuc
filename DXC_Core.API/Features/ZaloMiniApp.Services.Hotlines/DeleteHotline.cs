using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class DeleteHotline
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var hotline = await _zaloContext.Hotlines
                .FirstOrDefaultAsync(h => h.PublicId == request.PublicId && h.IsActive, cancellationToken);

            if (hotline == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy đường dây nóng"
                };
            }

            // Xóa mềm hotline
            hotline.IsActive = false;
            hotline.UpdatedAt = DateTime.UtcNow;

            await _zaloContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa đường dây nóng thành công"
            };
        }
    }
}