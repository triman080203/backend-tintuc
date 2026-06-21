using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

public static class GetBannersMobile
{
    public class Query : IRequest<ApiResult<List<BannerMobileDto>>>
    {
        // Không cần tham số, lấy tất cả banner active
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, ApiResult<List<BannerMobileDto>>>
    {
        public async Task<ApiResult<List<BannerMobileDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var banners = await context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.Position == "top" ? 1 :
                             b.Position == "middle" ? 2 : 3)
                .ThenByDescending(b => b.CreatedAt)
                .Select(b => new BannerMobileDto
                {
                    PublicId = b.PublicId,
                    Title = b.Title,
                    ImageUrl = $"/api/files/{b.ImagePublicId}", // Build URL for file download
                    Position = b.Position,
                    BannerType = b.BannerType,
                    NativeParams = b.NativeParams,
                    WebLink = b.WebLink,
                    ThuTu = b.ThuTu
                })
                .ToListAsync(cancellationToken);

            return new ApiResult<List<BannerMobileDto>>
            {
                Success = true,
                Data = banners
            };
        }
    }
}
