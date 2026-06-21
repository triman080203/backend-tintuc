using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Restaurants;

public static class UpdateRestaurant
{
    public class Command : IRequest<ApiResult<RestaurantDto>>
    {
        public Guid PublicId { get; set; }
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
        public bool? IsActive { get; set; }
        public int? ThuTu { get; set; }
        // Nếu ImagePublicIds là null: không thay đổi ảnh.
        // Nếu ImagePublicIds là list rỗng: xóa hết ảnh.
        // Nếu ImagePublicIds có giá trị: thay thế toàn bộ ảnh cũ bằng ảnh mới.
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

            RuleFor(x => x.PublicId)
                .NotEmpty()
                .WithMessage("PublicId phải khác rỗng")
                .MustAsync(RestaurantExists)
                .WithMessage("Nhà hàng không tồn tại");

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
                    if (ids == null || !ids.Any()) return true; // Bỏ qua nếu null hoặc rỗng
                    var count = await _fileContext.Files.CountAsync(f => ids.Contains(f.PublicId), cancellation);
                    return count == ids.Count;
                })
                .WithMessage("Một hoặc nhiều PublicId của ảnh không hợp lệ.")
                .When(x => x.ImagePublicIds != null);
        }

        private async Task<bool> RestaurantExists(Guid publicId, CancellationToken cancellationToken)
        {
            return await _zaloContext.Restaurants.AnyAsync(r => r.PublicId == publicId, cancellationToken);
        }

        private async Task<bool> BeUniqueName(Command command, string name, CancellationToken cancellationToken)
        {
            return !await _zaloContext.Restaurants
                .AnyAsync(r => r.Name == name && r.PublicId != command.PublicId, cancellationToken);
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
            var restaurant = await _zaloContext.Restaurants
                .Include(r => r.Images) // Tải các ảnh hiện có
                .FirstOrDefaultAsync(r => r.PublicId == request.PublicId, cancellationToken);

            if (restaurant == null)
            {
                return new ApiResult<RestaurantDto>
                {
                    Success = false,
                    Message = "Nhà hàng không tồn tại"
                };
            }

            // Cập nhật thông tin cơ bản
            restaurant.Name = request.Name;
            restaurant.Description = request.Description;
            restaurant.Address = request.Address;
            restaurant.PhoneNumber = request.PhoneNumber;
            restaurant.OperatingHours = request.OperatingHours;
            restaurant.Schedule = request.Schedule;
            restaurant.Latitude = request.Latitude;
            restaurant.Longitude = request.Longitude;
            restaurant.VR360Link = request.VR360Link;
            restaurant.Category = request.Category;
            restaurant.AveragePriceRange = request.AveragePriceRange;
            if (request.IsActive.HasValue)
            {
                restaurant.IsActive = request.IsActive.Value;
            }
            restaurant.UpdatedAt = DateTime.UtcNow;

            if (request.ThuTu.HasValue)
            {
                var totalCount = await _zaloContext.Restaurants.CountAsync(cancellationToken);
                var newOrder = Math.Max(0, Math.Min(request.ThuTu.Value, totalCount - 1));
                var oldOrder = restaurant.ThuTu;
                if (newOrder != oldOrder)
                {
                    if (newOrder < oldOrder)
                    {
                        var affected = await _zaloContext.Restaurants
                            .Where(r => r.PublicId != restaurant.PublicId && r.ThuTu >= newOrder && r.ThuTu < oldOrder)
                            .ToListAsync(cancellationToken);
                        foreach (var r in affected)
                        {
                            r.ThuTu += 1;
                        }
                    }
                    else
                    {
                        var affected = await _zaloContext.Restaurants
                            .Where(r => r.PublicId != restaurant.PublicId && r.ThuTu > oldOrder && r.ThuTu <= newOrder)
                            .ToListAsync(cancellationToken);
                        foreach (var r in affected)
                        {
                            r.ThuTu -= 1;
                        }
                    }
                    restaurant.ThuTu = newOrder;
                }
            }

            // Xử lý cập nhật ảnh nếu có request
            if (request.ImagePublicIds != null)
            {
                // Xóa ảnh cũ
                restaurant.Images.Clear();

                // Thêm ảnh mới nếu có
                if (request.ImagePublicIds.Any())
                {
                    var imageFiles = await _fileContext.Files
                        .Where(f => request.ImagePublicIds.Contains(f.PublicId))
                        .ToListAsync(cancellationToken);

                    int displayOrder = 0;
                    foreach (var file in imageFiles)
                    {
                        restaurant.Images.Add(new RestaurantImage
                        {
                            PublicId = Guid.NewGuid(),
                            ImageUrl = $"/api/files/{file.PublicId}",
                            ImagePublicId = file.PublicId,
                            DisplayOrder = displayOrder,
                            IsPrimary = (displayOrder == 0)
                        });
                        displayOrder++;
                    }
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
                Message = "Cập nhật nhà hàng thành công"
            };
        }
    }
}
