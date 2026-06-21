using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Restaurants;

public static class GetRestaurantById
{
    public class Query : IRequest<ApiResult<RestaurantDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<RestaurantDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<RestaurantDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.Images)
                .FirstOrDefaultAsync(r => r.PublicId == request.PublicId, cancellationToken);

            if (restaurant == null)
            {
                return new ApiResult<RestaurantDto>
                {
                    Success = false,
                    Message = "Không tìm thấy nhà hàng với ID được cung cấp"
                };
            }

            var restaurantDto = new RestaurantDto
            {
                PublicId = restaurant.PublicId,
                Name = restaurant.Name,
                Description = restaurant.Description,
                Address = restaurant.Address,
                PhoneNumber = restaurant.PhoneNumber,
                OperatingHours = restaurant.OperatingHours,
                Schedule = restaurant.Schedule,
                Latitude = restaurant.Latitude,
                Longitude = restaurant.Longitude,
                VR360Link = restaurant.VR360Link,
                Category = restaurant.Category,
                AveragePriceRange = restaurant.AveragePriceRange,
                ThuTu = restaurant.ThuTu,
                IsActive = restaurant.IsActive,
                CreatedAt = restaurant.CreatedAt,
                UpdatedAt = restaurant.UpdatedAt,
                Images = restaurant.Images.Select(img => new RestaurantImageDto
                {
                    PublicId = img.PublicId,
                    ImageUrl = $"/api/files/{img.ImagePublicId}",
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption
                }).OrderBy(i => i.DisplayOrder).ToList()
            };

            return new ApiResult<RestaurantDto>
            {
                Success = true,
                Data = restaurantDto,
                Message = "Lấy thông tin nhà hàng thành công"
            };
        }
    }
}
