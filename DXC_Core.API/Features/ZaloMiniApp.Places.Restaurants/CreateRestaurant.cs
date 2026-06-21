using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Restaurants;

public static class CreateRestaurant
{
    public class Command : IRequest<ApiResult<RestaurantDto>>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? OperatingHours { get; set; }
        public string? Schedule { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? VR360Link { get; set; }
        public string? Category { get; set; }
        public string? AveragePriceRange { get; set; }
        public int? ThuTu { get; set; }
        public List<Guid>? ImagePublicIds { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;
        private readonly FileDbContext _fileContext;

        public Validator(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            _zaloContext = zaloContext;
            _fileContext = fileContext;

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Tên nhà hàng không được để trống")
                .MaximumLength(200)
                .WithMessage("Tên nhà hàng không được vượt quá 200 ký tự");


            RuleFor(x => x.PhoneNumber)
                .MaximumLength(20)
                .WithMessage("Số điện thoại không được vượt quá 20 ký tự");

            RuleFor(x => x.OperatingHours)
                .MaximumLength(100)
                .WithMessage("Giờ mở cửa không được vượt quá 100 ký tự");

            RuleFor(x => x.Category)
                .MaximumLength(100)
                .WithMessage("Loại hình nhà hàng không được vượt quá 100 ký tự");

            RuleFor(x => x.AveragePriceRange)
                .MaximumLength(50)
                .WithMessage("Khoảng giá không được vượt quá 50 ký tự");

            RuleFor(x => x.ImagePublicIds)
                .MustAsync(async (ids, cancellation) =>
                {
                    if (ids == null || !ids.Any()) return true;
                    var existingFilesCount = await _fileContext.Files.CountAsync(f => ids.Contains(f.PublicId), cancellation);
                    return existingFilesCount == ids.Count;
                })
                .WithMessage("Một hoặc nhiều PublicId của ảnh không hợp lệ hoặc không tồn tại.")
                .When(x => x.ImagePublicIds != null && x.ImagePublicIds.Any());
        }

        private async Task<bool> BeUniqueName(Command command, string name, CancellationToken cancellationToken)
        {
            return !await _zaloContext.Restaurants
                .AnyAsync(r => r.Name == name, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<RestaurantDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;
        private readonly FileDbContext _fileContext;

        public Handler(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            _zaloContext = zaloContext;
            _fileContext = fileContext;
        }

        public async Task<ApiResult<RestaurantDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var maxOrder = await _zaloContext.Restaurants.MaxAsync(r => (int?)r.ThuTu, cancellationToken) ?? -1;
            var nextOrder = (request.ThuTu.HasValue && request.ThuTu.Value >= 0) ? request.ThuTu.Value : maxOrder + 1;

            var restaurant = new Restaurant
            {
                PublicId = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                Address = request.Address,
                PhoneNumber = request.PhoneNumber,
                OperatingHours = request.OperatingHours,
                Schedule = request.Schedule,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                VR360Link = request.VR360Link,
                Category = request.Category,
                AveragePriceRange = request.AveragePriceRange,
                ThuTu = nextOrder
            };

            _zaloContext.Restaurants.Add(restaurant);

            // Xử lý liên kết hình ảnh
            if (request.ImagePublicIds != null && request.ImagePublicIds.Any())
            {
                var imageFiles = await _fileContext.Files
                    .Where(f => request.ImagePublicIds.Contains(f.PublicId))
                    .ToListAsync(cancellationToken);

                int displayOrder = 0;
                foreach (var file in imageFiles)
                {
                    var restaurantImage = new RestaurantImage
                    {
                        PublicId = Guid.NewGuid(),
                        ImageUrl = $"/api/files/{file.PublicId}",
                        ImagePublicId = file.PublicId,
                        DisplayOrder = displayOrder,
                        IsPrimary = (displayOrder == 0) // Ảnh đầu tiên là ảnh chính
                    };
                    // Thêm ảnh vào danh sách của nhà hàng
                    restaurant.Images.Add(restaurantImage);
                    displayOrder++;
                }
            }

            await _zaloContext.SaveChangesAsync(cancellationToken);

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
                UpdatedAt = restaurant.UpdatedAt
            };

            return new ApiResult<RestaurantDto>
            {
                Success = true,
                Data = restaurantDto,
                Message = "Tạo nhà hàng thành công"
            };
        }
    }
}
