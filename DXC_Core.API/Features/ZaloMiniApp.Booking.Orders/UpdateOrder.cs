using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Orders;

public static class UpdateOrder
{
    public class Command : IRequest<ApiResult<BookingOrderDto>>
    {
        public Guid PublicId { get; set; }
        public string Status { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
            RuleFor(x => x.Status).NotEmpty();
            RuleFor(x => x.PaymentStatus).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<BookingOrderDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<BookingOrderDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var order = await _context.BookingOrders.FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);
            
            if (order == null)
            {
                return new ApiResult<BookingOrderDto> { Success = false, Message = "Không tìm thấy đơn hàng" };
            }

            order.Status = request.Status;
            order.PaymentStatus = request.PaymentStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<BookingOrderDto>
            {
                Success = true,
                Message = "Cập nhật đơn hàng thành công"
            };
        }
    }
}
