using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Booking;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Orders;

public static class CreateOrder
{
    public class Command : IRequest<ApiResult<BookingOrderDto>>
    {
        public string? CustomerName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Note { get; set; }
        public Guid? TourId { get; set; }
        public Guid? TicketId { get; set; }
        public int Quantity { get; set; } = 1;
        public int AdultQuantity { get; set; } = 1;
        public int ChildQuantity { get; set; } = 0;
        public DateTime? DepartureDate { get; set; }
        public string? DepartureTime { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.TotalAmount).GreaterThanOrEqualTo(0);
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
            int? actualTourId = null;
            if (request.TourId.HasValue)
            {
                actualTourId = await _context.Tours
                    .Where(x => x.PublicId == request.TourId.Value)
                    .Select(x => x.Id)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            int? actualTicketId = null;
            if (request.TicketId.HasValue)
            {
                actualTicketId = await _context.Tickets
                    .Where(x => x.PublicId == request.TicketId.Value)
                    .Select(x => x.Id)
                    .FirstOrDefaultAsync(cancellationToken);
            }

            var order = new BookingOrder
            {
                BookingCode = $"BK-{DateTime.Now:yyyyMMddHHmmss}-{new Random().Next(1000, 9999)}",
                CustomerName = request.CustomerName,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                Note = request.Note,
                TourId = actualTourId,
                TicketId = actualTicketId,
                Quantity = request.Quantity,
                AdultQuantity = request.AdultQuantity,
                ChildQuantity = request.ChildQuantity,
                DepartureDate = request.DepartureDate,
                DepartureTime = request.DepartureTime,
                TotalAmount = request.TotalAmount,
                Status = "Pending",
                PaymentStatus = "Unpaid",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.BookingOrders.Add(order);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<BookingOrderDto>
            {
                Success = true,
                Message = "Tạo đơn hàng thành công",
                Data = new BookingOrderDto { PublicId = order.PublicId, BookingCode = order.BookingCode }
            };
        }
    }
}
