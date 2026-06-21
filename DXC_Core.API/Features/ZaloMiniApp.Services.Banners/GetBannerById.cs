using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

public static class GetBannerById
{
    public class Query : IRequest<ApiResult<BannerDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, ApiResult<BannerDto>>
    {
        public async Task<ApiResult<BannerDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var banner = await context.Banners
                .FirstOrDefaultAsync(b => b.PublicId == request.PublicId, cancellationToken);

            if (banner == null)
            {
                return new ApiResult<BannerDto>
                {
                    Success = false,
                    Message = "Banner không tồn tại"
                };
            }

            var bannerDto = new BannerDto
            {
                Id = banner.Id,
                PublicId = banner.PublicId,
                Title = banner.Title,
                ImagePublicId = banner.ImagePublicId,
                Position = banner.Position,
                BannerType = banner.BannerType,
                NativeParams = banner.NativeParams,
                WebLink = banner.WebLink,
                ThuTu = banner.ThuTu,
                IsActive = banner.IsActive,
                CreatedAt = banner.CreatedAt,
                UpdatedAt = banner.UpdatedAt
            };

            return new ApiResult<BannerDto> { Success = true, Data = bannerDto };
        }
    }
}
