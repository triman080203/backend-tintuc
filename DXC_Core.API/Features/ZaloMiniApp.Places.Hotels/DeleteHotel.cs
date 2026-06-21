using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

public static class DeleteHotel
{
    public class Command : IRequest<ApiResult>
    {
        public Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Validator(ZaloMiniAppDbContext context)
        {
            _context = context;

            RuleFor(x => x.PublicId)
                .NotEmpty()
                .WithMessage("PublicId phải khác rỗng")
                .MustAsync(HotelExists)
                .WithMessage("Khách sạn không tồn tại");
        }

        private async Task<bool> HotelExists(Guid publicId, CancellationToken cancellationToken)
        {
            return await _context.Hotels.AnyAsync(h => h.PublicId == publicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var hotel = await _context.Hotels
                .FirstOrDefaultAsync(h => h.PublicId == request.PublicId, cancellationToken);

            if (hotel == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Khách sạn không tồn tại"
                };
            }

            hotel.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa mềm khách sạn thành công"
            };
        }
    }
}