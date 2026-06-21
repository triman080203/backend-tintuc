using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class GetHotlines
{
    public class Query : IRequest<PagedResult<HotlineDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? PhoneNumber { get; set; }
        public string? ContactName { get; set; }
        public Guid? CategoryPublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<HotlineDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<PagedResult<HotlineDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _zaloContext.Hotlines
                .Include(h => h.Category)
                .AsQueryable();

            // Lọc theo số điện thoại
            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                query = query.Where(h => h.PhoneNumber.Contains(request.PhoneNumber));
            }

            // Lọc theo tên người/bộ phận
            if (!string.IsNullOrWhiteSpace(request.ContactName))
            {
                query = query.Where(h => h.ContactName.Contains(request.ContactName));
            }

            // Lọc theo lĩnh vực
            if (request.CategoryPublicId.HasValue)
            {
                query = query.Where(h => h.Category.PublicId == request.CategoryPublicId.Value && h.Category.IsActive);
            }

            // Đếm tổng số bản ghi
            var total = await query.CountAsync(cancellationToken);

            // Phân trang và lấy dữ liệu
            var hotlines = await query
                .OrderBy(h => h.ThuTu)
                .ThenBy(h => h.ContactName)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
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

            return new PagedResult<HotlineDto>
            {
                Success = true,
                Data = hotlines,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
