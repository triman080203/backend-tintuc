using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class GetHotlineCategoryById
{
    public class Query : IRequest<ApiResult<HotlineCategoryDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<HotlineCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<HotlineCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var category = await _zaloContext.HotlineCategories
                .Where(c => c.PublicId == request.PublicId)
                .Select(c => new HotlineCategoryDto
                {
                    PublicId = c.PublicId,
                    Name = c.Name,
                    Description = c.Description,
                    ThuTu = c.ThuTu,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    HotlinesCount = c.Hotlines.Count(h => h.IsActive)
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (category == null)
            {
                return new ApiResult<HotlineCategoryDto>
                {
                    Success = false,
                    Message = "Không tìm thấy lĩnh vực đường dây nóng"
                };
            }

            return new ApiResult<HotlineCategoryDto>
            {
                Success = true,
                Data = category
            };
        }
    }
}
