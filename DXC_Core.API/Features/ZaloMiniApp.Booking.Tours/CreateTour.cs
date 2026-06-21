using FluentValidation;
using MediatR;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Booking;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tours;

public static class CreateTour
{
    public class Command : IRequest<ApiResult<TourDto>>
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Highlights { get; set; }
        public string? Schedule { get; set; }
        public decimal Price { get; set; }
        public string? PriceCurrency { get; set; } = "VND";
        public int DurationDays { get; set; } = 1;
        public int DurationNights { get; set; } = 0;
        public string? DepartureLocation { get; set; }
        public int MaxParticipants { get; set; } = 20;
        public int ThuTu { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public List<TourImageDto>? Images { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<TourDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<TourDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var tour = new Tour
            {
                Name = request.Name,
                Description = request.Description,
                Highlights = request.Highlights,
                Schedule = request.Schedule,
                Price = request.Price,
                PriceCurrency = request.PriceCurrency,
                DurationDays = request.DurationDays,
                DurationNights = request.DurationNights,
                DepartureLocation = request.DepartureLocation,
                MaxParticipants = request.MaxParticipants,
                ThuTu = request.ThuTu,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            if (request.Images != null && request.Images.Any())
            {
                foreach (var img in request.Images)
                {
                    tour.Images.Add(new TourImage
                    {
                        PublicId = Guid.NewGuid(),
                        ImageUrl = img.ImageUrl,
                        ImagePublicId = img.ImagePublicId,
                        DisplayOrder = img.DisplayOrder,
                        IsPrimary = img.IsPrimary,
                        Caption = img.Caption
                    });
                }
            }

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<TourDto>
            {
                Success = true,
                Message = "Tạo tour thành công",
                Data = new TourDto { PublicId = tour.PublicId, Name = tour.Name }
            };
        }
    }
}
