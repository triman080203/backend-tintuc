using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tours;

public static class GetTourById
{
    public class Query : IRequest<ApiResult<TourDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<TourDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<TourDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var tour = await _context.Tours
                .Include(x => x.Images)
                .Where(x => x.PublicId == request.PublicId)
                .Select(x => new TourDto
                {
                    PublicId = x.PublicId,
                    Name = x.Name,
                    Description = x.Description,
                    Highlights = x.Highlights,
                    Schedule = x.Schedule,
                    Price = x.Price,
                    PriceCurrency = x.PriceCurrency,
                    DurationDays = x.DurationDays,
                    DurationNights = x.DurationNights,
                    DepartureLocation = x.DepartureLocation,
                    MaxParticipants = x.MaxParticipants,
                    ThuTu = x.ThuTu,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    Images = x.Images.Select(img => new TourImageDto
                    {
                        PublicId = img.PublicId,
                        ImageUrl = $"/api/files/{img.ImagePublicId}",
                        ImagePublicId = img.ImagePublicId,
                        DisplayOrder = img.DisplayOrder,
                        IsPrimary = img.IsPrimary,
                        Caption = img.Caption
                    }).OrderBy(i => i.DisplayOrder).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (tour == null)
            {
                return new ApiResult<TourDto> { Success = false, Message = "Không tìm thấy tour" };
            }

            return new ApiResult<TourDto> { Success = true, Data = tour };
        }
    }
}
