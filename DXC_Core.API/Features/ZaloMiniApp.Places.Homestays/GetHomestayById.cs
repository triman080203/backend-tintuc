using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;

public static class GetHomestayById
{
    public class Query : IRequest<ApiResult<HomestayDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(q => q.PublicId)
                .NotEmpty().WithMessage("PublicId không được để trống");
        }
    }

    public class Handler : IRequestHandler<Query, ApiResult<HomestayDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<HomestayDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var homestay = await _context.Homestays
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

            var result = new HomestayDto
            {
                PublicId = homestay.PublicId,
                Name = homestay.Name,
                Address = homestay.Address,
                Description = homestay.Description,
                PhoneNumber = homestay.PhoneNumber,
                AveragePrice = homestay.AveragePrice,
                Latitude = homestay.Latitude,
                Longitude = homestay.Longitude,
                Website = homestay.Website,
                LinkVitri = homestay.LinkVitri,
                ThuTu = homestay.ThuTu,
                IsActive = homestay.IsActive,
                CreatedAt = homestay.CreatedAt,
                UpdatedAt = homestay.UpdatedAt,
                Images = homestay.Images.Select(img => new HomestayImageDto
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
                Message = "Lấy thông tin homestay thành công"
            };
        }
    }
}
