using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;


public static class GetHotelById
{
    public class Query : IRequest<ApiResult<HotelWithImagesDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId)
                .NotEmpty()
                .WithMessage("PublicId phải khác rỗng");
        }
    }

    public class Handler : IRequestHandler<Query, ApiResult<HotelWithImagesDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<HotelWithImagesDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var hotel = await _context.Hotels
                .Where(h => h.IsActive)
                .Include(h => h.Images) // Tải danh sách ảnh
                .FirstOrDefaultAsync(h => h.PublicId == request.PublicId, cancellationToken);

            if (hotel == null)
            {
                return new ApiResult<HotelWithImagesDto>
                {
                    Success = false,
                    Message = "Khách sạn không tồn tại hoặc đã bị xóa."
                };
            }

            var hotelDto = new HotelWithImagesDto
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
                    ImageUrl = $"/api/files/{img.ImagePublicId}",
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption
                }).OrderBy(i => i.DisplayOrder).ToList()
            };

            return new ApiResult<HotelWithImagesDto>
            {
                Success = true,
                Data = hotelDto,
                Message = "Lấy thông tin khách sạn thành công"
            };
        }
    }
}
