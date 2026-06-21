using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

public static class CreateHotel
{
    public class Command : IRequest<ApiResult<HotelWithImagesDto>>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public int? StarRating { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? OperatingHours { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? VR360Link { get; set; }
        public decimal? PriceFrom { get; set; }
        public string? PriceFromCurrency { get; set; }
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
                .WithMessage("Tên khách sạn không được để trống")
                .MaximumLength(200)
                .WithMessage("Tên khách sạn không được vượt quá 200 ký tự");

            // ... (các rule khác giữ nguyên)

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
            return !await _zaloContext.Hotels
                .AnyAsync(h => h.Name == name, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<HotelWithImagesDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;
        private readonly FileDbContext _fileContext;

        public Handler(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            _zaloContext = zaloContext;
            _fileContext = fileContext;
        }

        public async Task<ApiResult<HotelWithImagesDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var maxOrder = await _zaloContext.Hotels.MaxAsync(h => (int?)h.ThuTu, cancellationToken) ?? -1;
            var nextOrder = (request.ThuTu.HasValue && request.ThuTu.Value >= 0) ? request.ThuTu.Value : maxOrder + 1;

            var hotel = new Hotel
            {
                PublicId = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                Address = request.Address,
                StarRating = request.StarRating,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                Website = request.Website,
                OperatingHours = request.OperatingHours,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                VR360Link = request.VR360Link,
                PriceFrom = request.PriceFrom,
                PriceFromCurrency = request.PriceFromCurrency,
                ThuTu = nextOrder
            };

            _zaloContext.Hotels.Add(hotel);

            // Xử lý liên kết hình ảnh
            if (request.ImagePublicIds != null && request.ImagePublicIds.Any())
            {
                var imageFiles = await _fileContext.Files
                    .Where(f => request.ImagePublicIds.Contains(f.PublicId))
                    .ToListAsync(cancellationToken);

                int displayOrder = 0;
                foreach (var file in imageFiles)
                {
                    var hotelImage = new HotelImage
                    {
                        PublicId = Guid.NewGuid(),
                        // Không gán HotelId trực tiếp
                        ImageUrl = $"/api/files/{file.PublicId}",
                        ImagePublicId = file.PublicId,
                        DisplayOrder = displayOrder,
                        IsPrimary = (displayOrder == 0) // Ảnh đầu tiên là ảnh chính
                    };
                    // Thêm ảnh vào danh sách của khách sạn
                    hotel.Images.Add(hotelImage);
                    displayOrder++;
                }
            }

            await _zaloContext.SaveChangesAsync(cancellationToken);

            var hotelWithImagesDto = new HotelWithImagesDto
            {
                PublicId = hotel.PublicId,
                Name = hotel.Name,
                Description = hotel.Description,
                Address = hotel.Address,
                StarRating = hotel.StarRating,
                PhoneNumber = hotel.PhoneNumber,
                Email = hotel.Email,
                Website = hotel.Website,
                OperatingHours = hotel.OperatingHours,
                Latitude = hotel.Latitude,
                Longitude = hotel.Longitude,
                VR360Link = hotel.VR360Link,
                PriceFrom = hotel.PriceFrom,
                PriceFromCurrency = hotel.PriceFromCurrency,
                ThuTu = hotel.ThuTu,
                IsActive = hotel.IsActive,
                CreatedAt = hotel.CreatedAt,
                UpdatedAt = hotel.UpdatedAt,
                Images = hotel.Images.Select(img => new HotelImageDto
                {
                    PublicId = img.PublicId,
                    ImageUrl = img.ImageUrl,
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption
                }).ToList()
            };

            return new ApiResult<HotelWithImagesDto>
            {
                Success = true,
                Data = hotelWithImagesDto,
                Message = "Tạo khách sạn thành công"
            };
        }
    }
}
