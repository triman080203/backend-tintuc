using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Orders;

public static class GetOrders
{
    public class Query : IRequest<PagedResult<BookingOrderDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
        public string? Status { get; set; }
        public string? PaymentStatus { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current).GreaterThan(0);
            RuleFor(x => x.PageSize).GreaterThan(0).LessThanOrEqualTo(100);
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<BookingOrderDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<BookingOrderDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.BookingOrders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x => x.BookingCode == request.Keyword || (x.CustomerName != null && x.CustomerName.Contains(request.Keyword)) || (x.PhoneNumber != null && x.PhoneNumber.Contains(request.Keyword)));
            }

            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                query = query.Where(x => x.Status == request.Status);
            }

            if (!string.IsNullOrWhiteSpace(request.PaymentStatus))
            {
                query = query.Where(x => x.PaymentStatus == request.PaymentStatus);
            }

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .Include(x => x.Tour)
                .Include(x => x.Ticket)
                .OrderByDescending(x => x.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
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
                .ToListAsync(cancellationToken);

            return new PagedResult<BookingOrderDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách đơn hàng thành công"
            };
        }
    }
}
