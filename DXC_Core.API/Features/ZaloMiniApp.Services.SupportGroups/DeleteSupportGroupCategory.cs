using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public static class DeleteSupportGroupCategory
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
            var category = await _zaloContext.SupportGroupCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.PublicId && c.IsActive, cancellationToken);

            if (category == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục nhóm hỗ trợ"
                };
            }

            // Check if category has any support groups
            var hasSupportGroups = await _zaloContext.SupportGroups
                .AnyAsync(sg => sg.CategoryId == category.Id && sg.IsActive, cancellationToken);

            if (hasSupportGroups)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không thể xóa danh mục vì vẫn còn nhóm hỗ trợ đang hoạt động"
                };
            }

            category.IsActive = false;
            category.UpdatedAt = DateTime.UtcNow;

            await _zaloContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa danh mục nhóm hỗ trợ thành công"
            };
        }
    }
}