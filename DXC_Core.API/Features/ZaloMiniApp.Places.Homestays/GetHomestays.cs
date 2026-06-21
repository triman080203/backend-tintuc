using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;

public static class GetHomestays
{
    public class Query : IRequest<PagedResult<HomestayDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<HomestayDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<HomestayDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Homestays
                .Include(h => h.Images)
                .AsQueryable();

            // Áp dụng filters
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(h => h.Name.Contains(request.Name));
            }

            if (!string.IsNullOrWhiteSpace(request.Address))
            {
                query = query.Where(h => h.Address != null && h.Address.Contains(request.Address));
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                query = query.Where(h => h.PhoneNumber != null && h.PhoneNumber.Contains(request.PhoneNumber));
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(h => h.AveragePrice >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(h => h.AveragePrice <= request.MaxPrice.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(h => h.IsActive == request.IsActive.Value);
            }

            // Đếm tổng số record
            var total = await query.CountAsync(cancellationToken);

            // Áp dụng phân trang và sắp xếp
            var homestays = await query
                .OrderBy(h => h.ThuTu)
                .ThenByDescending(h => h.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Chuyển đổi sang DTO
            var homestayDtos = homestays.Select(h => new HomestayDto
            {
                PublicId = h.PublicId,
                Name = h.Name,
                Address = h.Address,
                Description = h.Description,
                PhoneNumber = h.PhoneNumber,
                AveragePrice = h.AveragePrice,
                Latitude = h.Latitude,
                Longitude = h.Longitude,
                Website = h.Website,
                LinkVitri = h.LinkVitri,
                ThuTu = h.ThuTu,
                IsActive = h.IsActive,
                CreatedAt = h.CreatedAt,
                UpdatedAt = h.UpdatedAt,
                Images = h.Images.Select(img => new HomestayImageDto
                {
                    PublicId = img.PublicId,
                    ImageUrl = $"/api/files/{img.ImagePublicId}",
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption
                }).OrderBy(img => img.DisplayOrder).ToList()
            }).ToList();

            return new PagedResult<HomestayDto>
            {
                Success = true,
                Data = homestayDtos,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = $"Tìm thấy {total} homestay"
            };
        }
    }
}
