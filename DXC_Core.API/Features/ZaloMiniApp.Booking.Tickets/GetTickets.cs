using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tickets;

public static class GetTickets
{
    public class Query : IRequest<PagedResult<TicketDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current).GreaterThan(0);
            RuleFor(x => x.PageSize).GreaterThan(0).LessThanOrEqualTo(100);
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<TicketDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<TicketDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Tickets.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x => x.Name.Contains(request.Keyword) || (x.Description != null && x.Description.Contains(request.Keyword)));
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == request.IsActive.Value);
            }

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderBy(x => x.ThuTu)
                .ThenByDescending(x => x.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
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
                .ToListAsync(cancellationToken);

            return new PagedResult<TicketDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách vé thành công"
            };
        }
    }
}
