using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class GetHotlineCategories
{
    public class Query : IRequest<PagedResult<HotlineCategoryDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<HotlineCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<PagedResult<HotlineCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _zaloContext.HotlineCategories.AsQueryable();

            // Lọc theo tên lĩnh vực
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(c => c.Name.Contains(request.Name));
            }

            // Lọc theo mô tả
            if (!string.IsNullOrWhiteSpace(request.Description))
            {
                query = query.Where(c => c.Description != null && c.Description.Contains(request.Description));
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(c => c.IsActive == request.IsActive.Value);
            }

            // Đếm tổng số bản ghi
            var total = await query.CountAsync(cancellationToken);

            // Phân trang và lấy dữ liệu
            var categories = await query
                .OrderBy(c => c.ThuTu)
                .ThenBy(c => c.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
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
                .ToListAsync(cancellationToken);

            return new PagedResult<HotlineCategoryDto>
            {
                Success = true,
                Data = categories,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
