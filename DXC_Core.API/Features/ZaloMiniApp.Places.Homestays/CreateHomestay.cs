using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;

public static class CreateHomestay
{
    public class Command : IRequest<ApiResult<HomestayDto>>
    {
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
            var maxOrder = await _zaloContext.Homestays.MaxAsync(h => (int?)h.ThuTu, cancellationToken) ?? -1;
            var nextOrder = (request.ThuTu.HasValue && request.ThuTu.Value >= 0) ? request.ThuTu.Value : maxOrder + 1;

            // Tạo homestay mới
            var homestay = new Data.ZaloMiniAppContext.Models.Places.Homestay
            {
                PublicId = Guid.NewGuid(),
                Name = request.Name,
                Address = request.Address,
                Description = request.Description,
                PhoneNumber = request.PhoneNumber,
                Website = request.Website,
                LinkVitri = request.LinkVitri,
                AveragePrice = request.AveragePrice,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                ThuTu = nextOrder,
                IsActive = true
            };

            _zaloContext.Homestays.Add(homestay);

            // Xử lý liên kết hình ảnh
            if (request.ImagePublicIds != null && request.ImagePublicIds.Any())
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

            await _zaloContext.SaveChangesAsync(cancellationToken);

            // Load lại homestay với các ảnh để trả về
            var createdHomestay = await _zaloContext.Homestays
                .Include(h => h.Images)
                .FirstAsync(h => h.Id == homestay.Id, cancellationToken);

            var result = new HomestayDto
            {
                PublicId = createdHomestay.PublicId,
                Name = createdHomestay.Name,
                Address = createdHomestay.Address,
                Description = createdHomestay.Description,
                PhoneNumber = createdHomestay.PhoneNumber,
                Website = createdHomestay.Website,
                LinkVitri = createdHomestay.LinkVitri,
                AveragePrice = createdHomestay.AveragePrice,
                Latitude = createdHomestay.Latitude,
                Longitude = createdHomestay.Longitude,
                ThuTu = createdHomestay.ThuTu,
                IsActive = createdHomestay.IsActive,
                CreatedAt = createdHomestay.CreatedAt,
                UpdatedAt = createdHomestay.UpdatedAt,
                Images = createdHomestay.Images.Select(img => new HomestayImageDto
                {
                    PublicId = img.PublicId,
                    ImageUrl = $"/api/files/{img.ImagePublicId}",
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption
                }).OrderBy(i => i.DisplayOrder).ToList()
            };

            return new ApiResult<HomestayDto>
            {
                Success = true,
                Data = result,
                Message = "Tạo homestay thành công"
            };
        }
    }
}
