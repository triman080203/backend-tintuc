using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Destinations;

public static class UpdateDestination
{
    public class Command : IRequest<ApiResult<DestinationDto>>
    {
        public Guid PublicId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? TimeLimit { get; set; }
        public string? Tag { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? VR360Link { get; set; }
        public int ThuTu { get; set; }
        public bool IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
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
            var destination = await _context.Destinations.FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);
            
            if (destination == null)
            {
                return new ApiResult<DestinationDto> { Success = false, Message = "Không tìm thấy địa điểm" };
            }

            destination.Name = request.Name;
            destination.Description = request.Description;
            destination.Address = request.Address;
            destination.TimeLimit = request.TimeLimit;
            destination.Tag = request.Tag;
            destination.Latitude = request.Latitude;
            destination.Longitude = request.Longitude;
            destination.VR360Link = request.VR360Link;
            destination.ThuTu = request.ThuTu;
            destination.IsActive = request.IsActive;
            destination.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<DestinationDto>
            {
                Success = true,
                Message = "Cập nhật địa điểm thành công"
            };
        }
    }
}
