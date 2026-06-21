using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIconById
{
    public class Query : IRequest<ApiResult<IconDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<IconDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<IconDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                var icon = await _dbContext.Icons
                    .Where(i => i.PublicId == request.PublicId)
                    .Select(i => new IconDto
                    {
                        PublicId = i.PublicId,
                        IconCategoryPublicId = i.IconCategory != null ? i.IconCategory.PublicId : null,
                        IconGroupPublicId = i.IconGroup != null ? i.IconGroup.PublicId : null,
                        Name = i.Name,
                        Description = i.Description,
                        IconImageUrl = i.ImagePublicId.HasValue ? $"/api/files/{i.ImagePublicId}" : i.IconImageUrl,
                        ImagePublicId = i.ImagePublicId,
                        IconType = i.IconType,
                        ScreenParams = i.ScreenParams,
                        WebLink = i.WebLink,
                        LinkAndroid = i.LinkAndroid,
                        LinkIOS = i.LinkIOS,
                        DisplayOrder = i.DisplayOrder,
                        IsActive = i.IsActive,
                        CreatedAt = i.CreatedAt,
                        UpdatedAt = i.UpdatedAt,
                        IconCategoryName = i.IconCategory != null ? i.IconCategory.Name : null,
                        IconGroupName = i.IconGroup != null ? i.IconGroup.Name : null
                    })
                    .FirstOrDefaultAsync(cancellationToken);

                if (icon == null)
                {
                    return new ApiResult<IconDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy icon"
                    };
                }

                return new ApiResult<IconDto>
                {
                    Success = true,
                    Data = icon,
                    Message = "Lấy thông tin icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<IconDto>
                {
                    Success = false,
                    Message = $"Lỗi lấy thông tin icon: {ex.Message}"
                };
            }
        }
    }
}
