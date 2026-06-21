using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tickets;

public static class GetTicketById
{
    public class Query : IRequest<ApiResult<TicketDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<TicketDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<TicketDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var ticket = await _context.Tickets
                .Where(x => x.PublicId == request.PublicId)
                .Select(x => new TicketDto
                {
                    PublicId = x.PublicId,
                    Name = x.Name,
                    Description = x.Description,
                    Price = x.Price,
                    ChildPrice = x.ChildPrice,
                    PriceCurrency = x.PriceCurrency,
                    ThuTu = x.ThuTu,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (ticket == null)
            {
                return new ApiResult<TicketDto> { Success = false, Message = "Không tìm thấy vé" };
            }

            return new ApiResult<TicketDto> { Success = true, Data = ticket };
        }
    }
}
