using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Orders;

public static class CancelOrder
{
    public class Command : IRequest<ApiResult<BookingOrderDto>>
    {
        public Guid PublicId { get; set; }
        public string? Reason { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
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

            if (order.Status != "Pending")
            {
                return new ApiResult<BookingOrderDto> { Success = false, Message = $"Không thể huỷ đơn hàng ở trạng thái {order.Status}" };
            }

            order.Status = "Cancelled";
            if (!string.IsNullOrEmpty(request.Reason))
            {
                order.Note = string.IsNullOrEmpty(order.Note) ? $"Lý do huỷ: {request.Reason}" : $"{order.Note} | Lý do huỷ: {request.Reason}";
            }
            
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<BookingOrderDto>
            {
                Success = true,
                Message = "Huỷ đơn hàng thành công",
                Data = new BookingOrderDto 
                { 
                    PublicId = order.PublicId, 
                    BookingCode = order.BookingCode,
                    Status = order.Status
                }
            };
        }
    }
}
