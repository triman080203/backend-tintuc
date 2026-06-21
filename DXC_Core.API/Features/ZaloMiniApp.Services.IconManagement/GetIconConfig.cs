using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIconConfig
{
    public class Query : IRequest<ApiResult<IconConfigDto>>
    {
    }

    public class Handler : IRequestHandler<Query, ApiResult<IconConfigDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<IconConfigDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                // Get active categories with their groups and icons
                var categories = await _dbContext.IconCategories
                    .Where(c => c.IsActive)
                    .OrderBy(c => c.DisplayOrder)
                    .ThenBy(c => c.Name)
                    .Select(c => new IconCategoryMobileDto
                    {
                        PublicId = c.PublicId,
                        Name = c.Name,
                        DisplayOrder = c.DisplayOrder,
                        IsActive = c.IsActive,
                        Groups = c.IconGroups
                            .Where(g => g.IsActive)
                            .OrderBy(g => g.DisplayOrder)
                            .ThenBy(g => g.Name)
                            .Select(g => new IconGroupMobileDto
                            {
                                PublicId = g.PublicId,
                                Name = g.Name,
                                DisplayOrder = g.DisplayOrder,
                                IsActive = g.IsActive,
                                ImageUrl = g.ImageUrl,
                                ImagePublicId = g.ImagePublicId,
                                Icons = g.Icons
                                    .Where(i => i.IsActive)
                                    .OrderBy(i => i.DisplayOrder)
                                    .ThenBy(i => i.Name)
                                    .Select(i => new IconMobileDto
                                    {
                                        PublicId = i.PublicId,
                                        Name = i.Name,
                                        IconImageUrl = i.IconImageUrl,
                                        IconType = i.IconType,
                                        ScreenParams = i.ScreenParams,
                                        WebLink = i.WebLink,
                                        LinkAndroid = i.LinkAndroid,
                                        LinkIOS = string.IsNullOrWhiteSpace(i.LinkIOS)
                                            ? null
                                            : $"/api/zalo-mini-app/mobile/services/icons/ios-redirect?url={Uri.EscapeDataString(i.LinkIOS)}",
                                        DisplayOrder = i.DisplayOrder,
                                        CategoryName = c.Name,
                                        GroupName = g.Name
                                    })
                                    .ToList()
                            })
                            .ToList(),
                        Icons = c.Icons
                            .Where(i => i.IsActive && i.IconGroupId == null)
                            .OrderBy(i => i.DisplayOrder)
                            .ThenBy(i => i.Name)
                            .Select(i => new IconMobileDto
                            {
                                PublicId = i.PublicId,
                                Name = i.Name,
                                IconImageUrl = i.IconImageUrl,
                                IconType = i.IconType,
                                ScreenParams = i.ScreenParams,
                                WebLink = i.WebLink,
                                LinkAndroid = i.LinkAndroid,
                                LinkIOS = string.IsNullOrWhiteSpace(i.LinkIOS)
                                    ? null
                                    : $"/api/zalo-mini-app/mobile/services/icons/ios-redirect?url={Uri.EscapeDataString(i.LinkIOS)}",
                                DisplayOrder = i.DisplayOrder,
                                CategoryName = c.Name,
                                GroupName = null
                            })
                            .ToList()
                    })
                    .ToListAsync(cancellationToken);

                var result = new IconConfigDto
                {
                    Categories = categories
                };

                return new ApiResult<IconConfigDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Lấy cấu hình icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<IconConfigDto>
                {
                    Success = false,
                    Data = new IconConfigDto(),
                    Message = $"Lỗi lấy cấu hình icon: {ex.Message}"
                };
            }
        }
    }
}
