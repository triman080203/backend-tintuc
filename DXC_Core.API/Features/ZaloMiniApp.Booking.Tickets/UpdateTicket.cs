using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tickets;

public static class UpdateTicket
{
    public class Command : IRequest<ApiResult<TicketDto>>
    {
        public Guid PublicId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal ChildPrice { get; set; }
        public string? PriceCurrency { get; set; }
        public int ThuTu { get; set; }
        public bool IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
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
            var ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);
            
            if (ticket == null)
            {
                return new ApiResult<TicketDto> { Success = false, Message = "Không tìm thấy vé" };
            }

            ticket.Name = request.Name;
            ticket.Description = request.Description;
            ticket.Price = request.Price;
            ticket.ChildPrice = request.ChildPrice;
            ticket.PriceCurrency = request.PriceCurrency;
            ticket.ThuTu = request.ThuTu;
            ticket.IsActive = request.IsActive;
            ticket.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<TicketDto>
            {
                Success = true,
                Message = "Cập nhật vé thành công"
            };
        }
    }
}
