using FluentValidation;
using MediatR;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Destinations;

public static class CreateDestination
{
    public class Command : IRequest<ApiResult<DestinationDto>>
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? TimeLimit { get; set; }
        public string? Tag { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? VR360Link { get; set; }
        public int ThuTu { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(255);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<DestinationDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<DestinationDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var destination = new Destination
            {
                Name = request.Name,
                Description = request.Description,
                Address = request.Address,
                TimeLimit = request.TimeLimit,
                Tag = request.Tag,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                VR360Link = request.VR360Link,
                ThuTu = request.ThuTu,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<DestinationDto>
            {
                Success = true,
                Message = "Tạo địa điểm thành công",
                Data = new DestinationDto { PublicId = destination.PublicId, Name = destination.Name }
            };
        }
    }
}
