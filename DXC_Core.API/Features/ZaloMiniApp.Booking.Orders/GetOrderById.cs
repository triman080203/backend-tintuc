using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Orders;

public static class GetOrderById
{
    public class Query : IRequest<ApiResult<BookingOrderDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<BookingOrderDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<BookingOrderDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var order = await _context.BookingOrders
                .Include(x => x.Tour)
                .Include(x => x.Ticket)
                .Where(x => x.PublicId == request.PublicId)
                .Select(x => new BookingOrderDto
                {
                    PublicId = x.PublicId,
                    BookingCode = x.BookingCode,
                    CustomerName = x.CustomerName,
                    PhoneNumber = x.PhoneNumber,
                    Email = x.Email,
                    Note = x.Note,
                    TourId = x.Tour != null ? x.Tour.PublicId : null,
                    TicketId = x.Ticket != null ? x.Ticket.PublicId : null,
                    ServiceType = x.TourId != null ? "Tour" : (x.TicketId != null ? "Ticket" : "Khác"),
                    ServiceName = x.Tour != null ? x.Tour.Name : (x.Ticket != null ? x.Ticket.Name : "Khác"),
                    Quantity = x.Quantity,
                    AdultQuantity = x.AdultQuantity,
                    ChildQuantity = x.ChildQuantity,
                    DepartureDate = x.DepartureDate,
                    DepartureTime = x.DepartureTime,
                    TotalAmount = x.TotalAmount,
                    Status = x.Status,
                    PaymentStatus = x.PaymentStatus,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (order == null)
            {
                return new ApiResult<BookingOrderDto> { Success = false, Message = "Không tìm thấy đơn hàng" };
            }

            return new ApiResult<BookingOrderDto> { Success = true, Data = order };
        }
    }
}
