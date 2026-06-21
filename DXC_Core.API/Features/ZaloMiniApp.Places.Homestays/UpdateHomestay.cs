using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;

public static class UpdateHomestay
{
    public class Command : IRequest<ApiResult<HomestayDto>>
    {
        public required Guid PublicId { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string Description { get; set; }
        public required string PhoneNumber { get; set; }
        public string? Website { get; set; }
        public string? LinkVitri { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? ThuTu { get; set; }
        public List<Guid>? ImagePublicIds { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            RuleFor(c => c.PublicId)
                .NotEmpty().WithMessage("PublicId không được để trống");

            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("Tên homestay không được để trống")
                .MaximumLength(200).WithMessage("Tên homestay không được vượt quá 200 ký tự");

            RuleFor(c => c.Address)
                .NotEmpty().WithMessage("Địa chỉ không được để trống")
                .MaximumLength(500).WithMessage("Địa chỉ không được vượt quá 500 ký tự");

            RuleFor(c => c.Description)
                .NotEmpty().WithMessage("Mô tả không được để trống")
                .MaximumLength(2000).WithMessage("Mô tả không được vượt quá 2000 ký tự");

            RuleFor(c => c.PhoneNumber)
                .NotEmpty().WithMessage("Số điện thoại không được để trống")
                .Matches(@"^(\+84|84|0)[3|5|7|8|9][0-9]{8}$")
                .WithMessage("Số điện thoại không hợp lệ");

            RuleFor(c => c.AveragePrice)
                .GreaterThan(0).WithMessage("Giá trung bình phải lớn hơn 0");

            RuleFor(c => c.Latitude)
                .InclusiveBetween(-90, 90).When(c => c.Latitude.HasValue)
                .WithMessage("Vĩ độ phải nằm trong khoảng -90 đến 90");

            RuleFor(c => c.Longitude)
                .InclusiveBetween(-180, 180).When(c => c.Longitude.HasValue)
                .WithMessage("Kinh độ phải nằm trong khoảng -180 đến 180");

            RuleFor(c => c.ImagePublicIds)
                .MustAsync(async (ids, cancellation) =>
                {
                    if (ids == null || !ids.Any()) return true;
                    var count = await fileContext.Files.CountAsync(f => ids.Contains(f.PublicId), cancellation);
                    return count == ids.Count;
                })
                .When(c => c.ImagePublicIds != null && c.ImagePublicIds.Any())
                .WithMessage("Một hoặc nhiều PublicId của ảnh không hợp lệ.");

            RuleFor(c => c)
                .MustAsync(async (command, cancellation) =>
                {
                    var homestay = await zaloContext.Homestays.FirstOrDefaultAsync(h => h.PublicId == command.PublicId, cancellation);
                    return homestay != null;
                })
                .WithMessage("Homestay với PublicId được cung cấp không tồn tại.");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<HomestayDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;
        private readonly FileDbContext _fileContext;

        public Handler(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            _zaloContext = zaloContext;
            _fileContext = fileContext;
        }

        public async Task<ApiResult<HomestayDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Tìm homestay cần cập nhật
            var homestay = await _zaloContext.Homestays
                .Include(h => h.Images)
                .FirstOrDefaultAsync(h => h.PublicId == request.PublicId, cancellationToken);

            if (homestay == null)
            {
                return new ApiResult<HomestayDto>
                {
                    Success = false,
                    Data = null,
                    Message = "Không tìm thấy homestay với PublicId được cung cấp"
                };
            }

            // Cập nhật thông tin homestay
            homestay.Name = request.Name;
            homestay.Address = request.Address;
            homestay.Description = request.Description;
            homestay.PhoneNumber = request.PhoneNumber;
            homestay.Website = request.Website;
            homestay.LinkVitri = request.LinkVitri;
            homestay.AveragePrice = request.AveragePrice;
            homestay.Latitude = request.Latitude;
            homestay.Longitude = request.Longitude;

            if (request.ThuTu.HasValue)
            {
                var totalCount = await _zaloContext.Homestays.CountAsync(cancellationToken);
                var newOrder = Math.Max(0, Math.Min(request.ThuTu.Value, totalCount - 1));
                var oldOrder = homestay.ThuTu;
                if (newOrder != oldOrder)
                {
                    if (newOrder < oldOrder)
                    {
                        var affected = await _zaloContext.Homestays
                            .Where(h => h.PublicId != homestay.PublicId && h.ThuTu >= newOrder && h.ThuTu < oldOrder)
                            .ToListAsync(cancellationToken);
                        foreach (var h in affected)
                        {
                            h.ThuTu += 1;
                        }
                    }
                    else
                    {
                        var affected = await _zaloContext.Homestays
                            .Where(h => h.PublicId != homestay.PublicId && h.ThuTu > oldOrder && h.ThuTu <= newOrder)
                            .ToListAsync(cancellationToken);
                        foreach (var h in affected)
                        {
                            h.ThuTu -= 1;
                        }
                    }
                    homestay.ThuTu = newOrder;
                }
            }

            // Xử lý ảnh nếu có
            if (request.ImagePublicIds != null)
            {
                // Xóa các ảnh cũ
                _zaloContext.HomestayImages.RemoveRange(homestay.Images);

                // Thêm các ảnh mới
                if (request.ImagePublicIds.Any())
                {
                    var imageFiles = await _fileContext.Files
                        .Where(f => request.ImagePublicIds.Contains(f.PublicId))
                        .ToListAsync(cancellationToken);

                    int displayOrder = 0;
                    foreach (var file in imageFiles)
                    {
                        var homestayImage = new Data.ZaloMiniAppContext.Models.Places.HomestayImage
                        {
                            PublicId = Guid.NewGuid(),
                            ImageUrl = $"/api/files/{file.PublicId}",
                            ImagePublicId = file.PublicId,
                            DisplayOrder = displayOrder,
                            IsPrimary = (displayOrder == 0), // Ảnh đầu tiên là ảnh chính
                            Caption = null
                        };
                        homestay.Images.Add(homestayImage);
                        displayOrder++;
                    }
                }
            }

            // Lưu thay đổi
            await _zaloContext.SaveChangesAsync(cancellationToken);

            // Load lại homestay với các ảnh mới
            var updatedHomestay = await _zaloContext.Homestays
                .Include(h => h.Images)
                .FirstAsync(h => h.Id == homestay.Id, cancellationToken);

            var result = new HomestayDto
            {
                PublicId = updatedHomestay.PublicId,
                Name = updatedHomestay.Name,
                Address = updatedHomestay.Address,
                Description = updatedHomestay.Description,
                PhoneNumber = updatedHomestay.PhoneNumber,
                Website = updatedHomestay.Website,
                LinkVitri = updatedHomestay.LinkVitri,
                AveragePrice = updatedHomestay.AveragePrice,
                Latitude = updatedHomestay.Latitude,
                Longitude = updatedHomestay.Longitude,
                ThuTu = updatedHomestay.ThuTu,
                IsActive = updatedHomestay.IsActive,
                CreatedAt = updatedHomestay.CreatedAt,
                UpdatedAt = updatedHomestay.UpdatedAt,
                Images = updatedHomestay.Images.Select(img => new HomestayImageDto
                {
                    PublicId = img.PublicId,
                    ImageUrl = $"/api/files/{img.ImagePublicId}",
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption
                }).OrderBy(img => img.DisplayOrder).ToList()
            };

            return new ApiResult<HomestayDto>
            {
                Success = true,
                Data = result,
                Message = "Cập nhật homestay thành công"
            };
        }
    }
}
