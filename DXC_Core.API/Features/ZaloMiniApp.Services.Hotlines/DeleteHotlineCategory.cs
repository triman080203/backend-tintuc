using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class DeleteHotlineCategory
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
            var category = await _zaloContext.HotlineCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.PublicId, cancellationToken);

            if (category == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy lĩnh vực đường dây nóng"
                };
            }

            // Kiểm tra xem có hotline nào đang active trong category không
            var hasActiveHotlines = await _zaloContext.Hotlines
                .AnyAsync(h => h.CategoryId == category.Id && h.IsActive, cancellationToken);

            if (hasActiveHotlines)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không thể xóa lĩnh vực vì vẫn còn đường dây nóng đang hoạt động"
                };
            }

            // Xóa mềm category
            category.IsActive = false;
            category.UpdatedAt = DateTime.UtcNow;

            await _zaloContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa lĩnh vực đường dây nóng thành công"
            };
        }
    }
}