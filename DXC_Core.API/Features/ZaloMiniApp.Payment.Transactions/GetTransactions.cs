using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Payment.Transactions;

public static class GetTransactions
{
    public class Query : IRequest<PagedResult<PaymentTransactionDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
        public string? Status { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current).GreaterThan(0);
            RuleFor(x => x.PageSize).GreaterThan(0).LessThanOrEqualTo(100);
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<PaymentTransactionDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<PaymentTransactionDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.PaymentTransactions.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x => x.GatewayTransactionId != null && x.GatewayTransactionId.Contains(request.Keyword));
            }

            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                query = query.Where(x => x.Status == request.Status);
            }

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new PaymentTransactionDto
                {
                    PublicId = x.PublicId,
                    BookingOrderId = x.BookingOrderId,
                    Amount = x.Amount,
                    Currency = x.Currency,
                    PaymentMethod = x.PaymentMethod,
                    Status = x.Status,
                    GatewayTransactionId = x.GatewayTransactionId,
                    GatewayResponseCode = x.GatewayResponseCode,
                    GatewayMessage = x.GatewayMessage,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<PaymentTransactionDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách giao dịch thành công"
            };
        }
    }
}
