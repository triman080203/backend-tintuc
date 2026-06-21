using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class DeleteIconGroup
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            try
            {
                var iconGroup = await _dbContext.IconGroups
                    .FirstOrDefaultAsync(g => g.PublicId == request.PublicId, cancellationToken);

                if (iconGroup == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không tìm thấy nhóm icon"
                    };
                }

                // Check if group has active icons
                var hasActiveIcons = await _dbContext.Icons
                    .AnyAsync(i => i.IconGroupId == iconGroup.Id && i.IsActive, cancellationToken);

                if (hasActiveIcons)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không thể xóa nhóm vì vẫn còn icon đang hoạt động"
                    };
                }

                // Soft delete
                iconGroup.IsActive = false;
                iconGroup.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync(cancellationToken);

                return new ApiResult
                {
                    Success = true,
                    Message = "Xóa nhóm icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = $"Lỗi xóa nhóm icon: {ex.Message}"
                };
            }
        }
    }
}