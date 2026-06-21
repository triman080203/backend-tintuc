using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class GetAllHotlines
{
    public class Query : IRequest<ApiResult<List<HotlineCategoryMobileDto>>>
    {
    }

    public class Handler : IRequestHandler<Query, ApiResult<List<HotlineCategoryMobileDto>>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<List<HotlineCategoryMobileDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var categories = await _zaloContext.HotlineCategories
                .AsNoTracking()
                .Where(c => c.IsActive)
                .OrderBy(c => c.ThuTu)
                .ThenBy(c => c.Name)
                .Select(c => new HotlineCategoryMobileDto
                {
                    PublicId = c.PublicId,
                    Name = c.Name,
                    Description = c.Description,
                    ThuTu = c.ThuTu,
                    Hotlines = c.Hotlines
                        .Where(h => h.IsActive)
                        .OrderBy(h => h.ThuTu)
                        .ThenBy(h => h.ContactName)
                        .Select(h => new HotlineMobileDto
                        {
                            PublicId = h.PublicId,
                            PhoneNumber = h.PhoneNumber,
                            ContactName = h.ContactName,
                            Description = h.Description,
                            ThuTu = h.ThuTu
                        })
                        .ToList()
                })
                .ToListAsync(cancellationToken);

            return new ApiResult<List<HotlineCategoryMobileDto>>
            {
                Success = true,
                Data = categories
            };
        }
    }
}
