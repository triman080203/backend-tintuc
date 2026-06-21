using FluentValidation;
using MediatR;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Booking;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tickets;

public static class CreateTicket
{
    public class Command : IRequest<ApiResult<TicketDto>>
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal ChildPrice { get; set; }
        public string? PriceCurrency { get; set; } = "VND";
        public int ThuTu { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
            RuleFor(x => x.ChildPrice).GreaterThanOrEqualTo(0);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<TicketDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<TicketDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var ticket = new Ticket
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                ChildPrice = request.ChildPrice,
                PriceCurrency = request.PriceCurrency,
                ThuTu = request.ThuTu,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<TicketDto>
            {
                Success = true,
                Message = "Tạo vé thành công",
                Data = new TicketDto { PublicId = ticket.PublicId, Name = ticket.Name }
            };
        }
    }
}
