using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

public static class GetHotels
{
    public class Query : IRequest<PagedResult<HotelWithImagesDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public bool? IsActive { get; set; }
        public int? StarRating { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? PriceFromCurrency { get; set; }
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

            // TenantId validation removed as per database level isolation approach

            RuleFor(x => x.StarRating)
                .InclusiveBetween(1, 5)
                .When(x => x.StarRating.HasValue)
                .WithMessage("StarRating phải từ 1 đến 5");

            RuleFor(x => x.PhoneNumber)
                .MaximumLength(20)
                .WithMessage("Số điện thoại không được vượt quá 20 ký tự");

            RuleFor(x => x.Email)
                .MaximumLength(100)
                .WithMessage("Email không được vượt quá 100 ký tự");

            RuleFor(x => x.PriceFromCurrency)
                .MaximumLength(10)
                .WithMessage("Loại tiền không được vượt quá 10 ký tự");

            RuleFor(x => x.MinPrice)
                .GreaterThanOrEqualTo(0)
                .When(x => x.MinPrice.HasValue)
                .WithMessage("Giá tối thiểu phải lớn hơn hoặc bằng 0");

            RuleFor(x => x.MaxPrice)
                .GreaterThanOrEqualTo(0)
                .When(x => x.MaxPrice.HasValue)
                .WithMessage("Giá tối đa phải lớn hơn hoặc bằng 0");

            RuleFor(x => x)
                .Must(x => !x.MinPrice.HasValue || !x.MaxPrice.HasValue || x.MinPrice <= x.MaxPrice)
                .WithMessage("Giá tối thiểu không được lớn hơn giá tối đa");
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<HotelWithImagesDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<HotelWithImagesDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Hotels.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(h => h.Name.Contains(request.Name));
            }

            // TenantId filter removed as per database level isolation approach

            if (request.IsActive.HasValue)
            {
                query = query.Where(h => h.IsActive == request.IsActive.Value);
            }

            if (request.StarRating.HasValue)
            {
                query = query.Where(h => h.StarRating == request.StarRating.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Address))
            {
                query = query.Where(h => h.Address != null && h.Address.Contains(request.Address));
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                query = query.Where(h => h.PhoneNumber != null && h.PhoneNumber.Contains(request.PhoneNumber));
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                query = query.Where(h => h.Email != null && h.Email.Contains(request.Email));
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(h => h.PriceFrom >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(h => h.PriceFrom <= request.MaxPrice.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.PriceFromCurrency))
            {
                query = query.Where(h => h.PriceFromCurrency != null && h.PriceFromCurrency.Contains(request.PriceFromCurrency));
            }

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var hotels = await query
                .Include(h => h.Images)
                .OrderBy(h => h.ThuTu)
                .ThenByDescending(h => h.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(h => new HotelWithImagesDto
                {
                    PublicId = h.PublicId,
                    Name = h.Name,
                    Description = h.Description,
                    Address = h.Address,
                    StarRating = h.StarRating,
                    PhoneNumber = h.PhoneNumber,
                    Email = h.Email,
                    Website = h.Website,
                    OperatingHours = h.OperatingHours,
                    Latitude = h.Latitude,
                    Longitude = h.Longitude,
                    VR360Link = h.VR360Link,
                    PriceFrom = h.PriceFrom,
                    PriceFromCurrency = h.PriceFromCurrency,
                    ThuTu = h.ThuTu,
                    IsActive = h.IsActive,
                    CreatedAt = h.CreatedAt,
                    UpdatedAt = h.UpdatedAt,
                    Images = h.Images.Select(img => new HotelImageDto
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

            return new PagedResult<HotelWithImagesDto>
            {
                Success = true,
                Data = hotels,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách khách sạn thành công"
            };
        }
    }
}
