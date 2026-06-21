using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class DeleteIconCategory
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
                var iconCategory = await _dbContext.IconCategories
                    .FirstOrDefaultAsync(c => c.PublicId == request.PublicId, cancellationToken);

                if (iconCategory == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không tìm thấy danh mục icon"
                    };
                }

                // Check if category has active icon groups or icons
                var hasActiveIconGroups = await _dbContext.IconGroups
                    .AnyAsync(g => g.IconCategoryId == iconCategory.Id && g.IsActive, cancellationToken);

                var hasActiveIcons = await _dbContext.Icons
                    .AnyAsync(i => i.IconCategoryId == iconCategory.Id && i.IsActive, cancellationToken);

                if (hasActiveIconGroups || hasActiveIcons)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không thể xóa danh mục vì vẫn còn nhóm icon hoặc icon đang hoạt động"
                    };
                }

                // Soft delete
                iconCategory.IsActive = false;
                iconCategory.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync(cancellationToken);

                return new ApiResult
                {
                    Success = true,
                    Message = "Xóa danh mục icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = $"Lỗi xóa danh mục icon: {ex.Message}"
                };
            }
        }
    }
}