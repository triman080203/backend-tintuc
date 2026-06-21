using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Restaurants;

public static class GetRestaurants
{
    public class Query : IRequest<PagedResult<RestaurantDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public bool? IsActive { get; set; }
        public string? Category { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? PriceRange { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current)
                .GreaterThan(0)
                .WithMessage("Current phải lớn hơn 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .LessThanOrEqualTo(100)
                .WithMessage("PageSize phải từ 1 đến 100");

            RuleFor(x => x.PhoneNumber)
                .MaximumLength(20)
                .WithMessage("Số điện thoại không được vượt quá 20 ký tự");

            RuleFor(x => x.PriceRange)
                .MaximumLength(50)
                .WithMessage("Khoảng giá không được vượt quá 50 ký tự");
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<RestaurantDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<RestaurantDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Restaurants.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(r => r.Name.Contains(request.Name));
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(r => r.IsActive == request.IsActive.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Category))
            {
                query = query.Where(r => r.Category != null && r.Category.Contains(request.Category));
            }

            if (!string.IsNullOrWhiteSpace(request.Address))
            {
                query = query.Where(r => r.Address != null && r.Address.Contains(request.Address));
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                query = query.Where(r => r.PhoneNumber != null && r.PhoneNumber.Contains(request.PhoneNumber));
            }

            if (!string.IsNullOrWhiteSpace(request.PriceRange))
            {
                query = query.Where(r => r.AveragePriceRange != null && r.AveragePriceRange.Contains(request.PriceRange));
            }

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var restaurants = await query
                .Include(r => r.Images)
                .OrderBy(r => r.ThuTu)
                .ThenByDescending(r => r.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(r => new RestaurantDto
                {
                    PublicId = r.PublicId,
                    Name = r.Name,
                    Description = r.Description,
                    Address = r.Address,
                    PhoneNumber = r.PhoneNumber,
                    OperatingHours = r.OperatingHours,
                    Schedule = r.Schedule,
                    Latitude = r.Latitude,
                    Longitude = r.Longitude,
                    VR360Link = r.VR360Link,
                    Category = r.Category,
                    AveragePriceRange = r.AveragePriceRange,
                    ThuTu = r.ThuTu,
                    IsActive = r.IsActive,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    Images = r.Images.Select(img => new RestaurantImageDto
                    {
                        PublicId = img.PublicId,
                        ImageUrl = $"/api/files/{img.ImagePublicId}",
                        ImagePublicId = img.ImagePublicId,
                        DisplayOrder = img.DisplayOrder,
                        IsPrimary = img.IsPrimary,
                        Caption = img.Caption
                    }).OrderBy(i => i.DisplayOrder).ToList()
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<RestaurantDto>
            {
                Success = true,
                Data = restaurants,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách nhà hàng thành công"
            };
        }
    }
}
