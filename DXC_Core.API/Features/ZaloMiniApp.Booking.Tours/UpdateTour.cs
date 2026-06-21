using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tours;

public static class UpdateTour
{
    public class Command : IRequest<ApiResult<TourDto>>
    {
        public Guid PublicId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Highlights { get; set; }
        public string? Schedule { get; set; }
        public decimal Price { get; set; }
        public string? PriceCurrency { get; set; }
        public int DurationDays { get; set; }
        public int DurationNights { get; set; }
        public string? DepartureLocation { get; set; }
        public int MaxParticipants { get; set; }
        public int ThuTu { get; set; }
        public bool IsActive { get; set; }
        public List<TourImageDto>? Images { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
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
            var tour = await _context.Tours
                .Include(t => t.Images)
                .FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);
            
            if (tour == null)
            {
                return new ApiResult<TourDto> { Success = false, Message = "Không tìm thấy tour" };
            }

            tour.Name = request.Name;
            tour.Description = request.Description;
            tour.Highlights = request.Highlights;
            tour.Schedule = request.Schedule;
            tour.Price = request.Price;
            tour.PriceCurrency = request.PriceCurrency;
            tour.DurationDays = request.DurationDays;
            tour.DurationNights = request.DurationNights;
            tour.DepartureLocation = request.DepartureLocation;
            tour.MaxParticipants = request.MaxParticipants;
            tour.ThuTu = request.ThuTu;
            tour.IsActive = request.IsActive;
            tour.UpdatedAt = DateTime.UtcNow;

            _context.TourImages.RemoveRange(tour.Images);
            tour.Images.Clear();

            if (request.Images != null && request.Images.Any())
            {
                foreach (var img in request.Images)
                {
                    tour.Images.Add(new Data.ZaloMiniAppContext.Models.Booking.TourImage
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

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<TourDto>
            {
                Success = true,
                Message = "Cập nhật tour thành công"
            };
        }
    }
}
