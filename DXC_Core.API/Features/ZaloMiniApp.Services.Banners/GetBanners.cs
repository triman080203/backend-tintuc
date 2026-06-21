using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

public static class GetBanners
{
    public class Query : IRequest<PagedResult<BannerDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Title { get; set; }
        public string? Position { get; set; }
        public string? BannerType { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, PagedResult<BannerDto>>
    {
        public async Task<PagedResult<BannerDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Banners.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(request.Title))
                query = query.Where(b => b.Title.Contains(request.Title));

            if (!string.IsNullOrEmpty(request.Position))
                query = query.Where(b => b.Position == request.Position);

            if (!string.IsNullOrEmpty(request.BannerType))
                query = query.Where(b => b.BannerType == request.BannerType);

            if (request.IsActive.HasValue)
                query = query.Where(b => b.IsActive == request.IsActive.Value);

            var total = await query.CountAsync(cancellationToken);

            var banners = await query
                .OrderByDescending(b => b.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(b => new BannerDto
                {
                    Id = b.Id,
                    PublicId = b.PublicId,
                    Title = b.Title,
                    ImagePublicId = b.ImagePublicId,
                    Position = b.Position,
                    BannerType = b.BannerType,
                    NativeParams = b.NativeParams,
                    WebLink = b.WebLink,
                    ThuTu = b.ThuTu,
                    IsActive = b.IsActive,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<BannerDto>
            {
                Success = true,
                Data = banners,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
