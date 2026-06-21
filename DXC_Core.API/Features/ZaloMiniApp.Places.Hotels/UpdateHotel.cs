using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

public static class UpdateHotel
{
    public class Command : IRequest<ApiResult<HotelWithImagesDto>>
    {
        public Guid PublicId { get; set; }
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
                .MustAsync(HotelExists)
                .WithMessage("Khách sạn không tồn tại");

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Tên khách sạn không được để trống")
                .MaximumLength(200)
                .WithMessage("Tên khách sạn không được vượt quá 200 ký tự");


            // ... (các rule khác giữ nguyên)

            RuleFor(x => x.ImagePublicIds)
                .MustAsync(async (ids, cancellation) =>
                {
                    if (ids == null || !ids.Any()) return true; // Bỏ qua nếu null hoặc rỗng
                    var count = await _fileContext.Files.CountAsync(f => ids.Contains(f.PublicId), cancellation);
                    return count == ids.Count;
                })
                .WithMessage("Một hoặc nhiều PublicId của ảnh không hợp lệ.")
                ;
        }

        private async Task<bool> HotelExists(Guid publicId, CancellationToken cancellationToken)
        {
            return await _zaloContext.Hotels.AnyAsync(h => h.PublicId == publicId, cancellationToken);
        }

        private async Task<bool> BeUniqueName(Command command, string name, CancellationToken cancellationToken)
        {
            return !await _zaloContext.Hotels
                .AnyAsync(h => h.Name == name && h.PublicId != command.PublicId, cancellationToken);
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
            var hotel = await _zaloContext.Hotels
                .Include(h => h.Images) // Tải các ảnh hiện có
                .FirstOrDefaultAsync(h => h.PublicId == request.PublicId, cancellationToken);

            if (hotel == null)
            {
                return new ApiResult<HotelWithImagesDto>
                {
                    Success = false,
                    Message = "Khách sạn không tồn tại"
                };
            }

            // Cập nhật thông tin cơ bản
            hotel.Name = request.Name;
            hotel.Description = request.Description;
            hotel.Address = request.Address;
            hotel.StarRating = request.StarRating;
            hotel.PhoneNumber = request.PhoneNumber;
            hotel.Email = request.Email;
            hotel.Website = request.Website;
            hotel.OperatingHours = request.OperatingHours;
            hotel.Latitude = request.Latitude;
            hotel.Longitude = request.Longitude;
            hotel.VR360Link = request.VR360Link;
            hotel.PriceFrom = request.PriceFrom;
            hotel.PriceFromCurrency = request.PriceFromCurrency;
            if (request.IsActive.HasValue)
            {
                hotel.IsActive = request.IsActive.Value;
            }
            hotel.UpdatedAt = DateTime.UtcNow;

            if (request.ThuTu.HasValue)
            {
                var totalCount = await _zaloContext.Hotels.CountAsync(cancellationToken);
                var newOrder = Math.Max(0, Math.Min(request.ThuTu.Value, totalCount - 1));
                var oldOrder = hotel.ThuTu;
                if (newOrder != oldOrder)
                {
                    if (newOrder < oldOrder)
                    {
                        var affected = await _zaloContext.Hotels
                            .Where(h => h.PublicId != hotel.PublicId && h.ThuTu >= newOrder && h.ThuTu < oldOrder)
                            .ToListAsync(cancellationToken);
                        foreach (var h in affected)
                        {
                            h.ThuTu += 1;
                        }
                    }
                    else
                    {
                        var affected = await _zaloContext.Hotels
                            .Where(h => h.PublicId != hotel.PublicId && h.ThuTu > oldOrder && h.ThuTu <= newOrder)
                            .ToListAsync(cancellationToken);
                        foreach (var h in affected)
                        {
                            h.ThuTu -= 1;
                        }
                    }
                    hotel.ThuTu = newOrder;
                }
            }

            // Xử lý cập nhật ảnh nếu có request
            if (request.ImagePublicIds != null)
            {
                // Xóa ảnh cũ
                hotel.Images.Clear();

                // Thêm ảnh mới nếu có
                if (request.ImagePublicIds.Any())
                {
                    var imageFiles = await _fileContext.Files
                        .Where(f => request.ImagePublicIds.Contains(f.PublicId))
                        .ToListAsync(cancellationToken);

                    int displayOrder = 0;
                    foreach (var file in imageFiles)
                    {
                        hotel.Images.Add(new HotelImage
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
                Message = "Cập nhật khách sạn thành công"
            };
        }
    }
}
