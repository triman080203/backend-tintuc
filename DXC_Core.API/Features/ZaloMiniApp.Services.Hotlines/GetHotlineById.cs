using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class GetHotlineById
{
    public class Query : IRequest<ApiResult<HotlineDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<HotlineDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<HotlineDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var hotline = await _zaloContext.Hotlines
                .Include(h => h.Category)
                .Where(h => h.PublicId == request.PublicId && h.IsActive)
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
                .FirstOrDefaultAsync(cancellationToken);

            if (hotline == null)
            {
                return new ApiResult<HotlineDto>
                {
                    Success = false,
                    Message = "Không tìm thấy đường dây nóng"
                };
            }

            return new ApiResult<HotlineDto>
            {
                Success = true,
                Data = hotline
            };
        }
    }
}
