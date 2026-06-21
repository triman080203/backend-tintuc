using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetActiveIcons
{
    public class Query : IRequest<ApiResult<List<IconMobileDto>>>
    {
    }

    public class Handler : IRequestHandler<Query, ApiResult<List<IconMobileDto>>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<List<IconMobileDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                var categoryIcons = await _dbContext.IconCategories
                    .Where(c => c.IsActive)
                    .OrderBy(c => c.DisplayOrder).ThenBy(c => c.Name)
                    .SelectMany(c => c.Icons
                        .Where(i => i.IsActive && i.IconGroupId == null)
                        .OrderBy(i => i.DisplayOrder).ThenBy(i => i.Name)
                        .Select(i => new IconMobileDto
                        {
                            PublicId = i.PublicId,
                            Name = i.Name ?? "",
                            IconImageUrl = i.IconImageUrl ?? "",
                            IconType = i.IconType ?? "",
                            ScreenParams = i.ScreenParams,
                            WebLink = i.WebLink,
                            LinkAndroid = i.LinkAndroid,
                            LinkIOS = string.IsNullOrWhiteSpace(i.LinkIOS)
                                ? null
                                : $"/api/zalo-mini-app/mobile/services/icons/ios-redirect?url={Uri.EscapeDataString(i.LinkIOS)}",
                            DisplayOrder = i.DisplayOrder,
                            CategoryName = c.Name,
                            GroupName = null
                        }))
                    .ToListAsync(cancellationToken);

                var groupIcons = await _dbContext.IconGroups
                    .Where(g => g.IsActive)
                    .OrderBy(g => g.DisplayOrder).ThenBy(g => g.Name)
                    .SelectMany(g => g.Icons
                        .Where(i => i.IsActive)
                        .OrderBy(i => i.DisplayOrder).ThenBy(i => i.Name)
                        .Select(i => new IconMobileDto
                        {
                            PublicId = i.PublicId,
                            Name = i.Name ?? "",
                            IconImageUrl = i.IconImageUrl ?? "",
                            IconType = i.IconType ?? "",
                            ScreenParams = i.ScreenParams,
                            WebLink = i.WebLink,
                            LinkAndroid = i.LinkAndroid,
                            LinkIOS = string.IsNullOrWhiteSpace(i.LinkIOS)
                                ? null
                                : $"/api/zalo-mini-app/mobile/services/icons/ios-redirect?url={Uri.EscapeDataString(i.LinkIOS)}",
                            DisplayOrder = i.DisplayOrder,
                            CategoryName = g.IconCategory.Name,
                            GroupName = g.Name
                        }))
                    .ToListAsync(cancellationToken);

                var allIcons = categoryIcons.Concat(groupIcons)
                    .OrderBy(i => i.DisplayOrder)
                    .ThenBy(i => i.Name)
                    .ToList();

                return new ApiResult<List<IconMobileDto>>
                {
                    Success = true,
                    Data = allIcons,
                    Message = "Lấy danh sách icon hoạt động thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<List<IconMobileDto>>
                {
                    Success = false,
                    Data = new List<IconMobileDto>(),
                    Message = $"Lỗi lấy danh sách icon hoạt động: {ex.Message}"
                };
            }
        }
    }
}
