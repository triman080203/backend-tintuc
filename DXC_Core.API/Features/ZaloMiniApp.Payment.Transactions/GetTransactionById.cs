using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Payment.Transactions;

public static class GetTransactionById
{
    public class Query : IRequest<ApiResult<PaymentTransactionDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<PaymentTransactionDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<PaymentTransactionDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var transaction = await _context.PaymentTransactions
                .Where(x => x.PublicId == request.PublicId)
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
                .FirstOrDefaultAsync(cancellationToken);

            if (transaction == null)
            {
                return new ApiResult<PaymentTransactionDto> { Success = false, Message = "Không tìm thấy giao dịch" };
            }

            return new ApiResult<PaymentTransactionDto> { Success = true, Data = transaction };
        }
    }
}
