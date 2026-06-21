using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class GetHotlinesByCategory
{
    public class Query : IRequest<ApiResult<List<HotlineDto>>>
    {
        public required Guid CategoryPublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<List<HotlineDto>>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<List<HotlineDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var category = await _zaloContext.HotlineCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.CategoryPublicId && c.IsActive, cancellationToken);

            if (category == null)
            {
                return new ApiResult<List<HotlineDto>>
                {
                    Success = false,
                    Message = "Không tìm thấy lĩnh vực đường dây nóng"
                };
            }

            var hotlines = await _zaloContext.Hotlines
                .Include(h => h.Category)
                .Where(h => h.CategoryId == category.Id && h.IsActive)
                .OrderBy(h => h.ThuTu)
                .ThenBy(h => h.ContactName)
                .Select(h => new HotlineDto
                {
                    PublicId = h.PublicId,
                    CategoryPublicId = h.Category.PublicId,
                    CategoryName = h.Category.Name,
                    PhoneNumber = h.PhoneNumber,
                    ContactName = h.ContactName,
                    Description = h.Description,
                    ThuTu = h.ThuTu,
                    IsActive = h.IsActive,
                    CreatedAt = h.CreatedAt,
                    UpdatedAt = h.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new ApiResult<List<HotlineDto>>
            {
                Success = true,
                Data = hotlines
            };
        }
    }
}
