using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Payment.Transactions;

public static class UpdateTransaction
{
    public class Command : IRequest<ApiResult<PaymentTransactionDto>>
    {
        public Guid PublicId { get; set; }
        public string Status { get; set; } = null!;
        public string? GatewayTransactionId { get; set; }
        public string? GatewayResponseCode { get; set; }
        public string? GatewayMessage { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
            RuleFor(x => x.Status).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<PaymentTransactionDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<PaymentTransactionDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var transaction = await _context.PaymentTransactions.FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);
            
            if (transaction == null)
            {
                return new ApiResult<PaymentTransactionDto> { Success = false, Message = "Không tìm thấy giao dịch" };
            }

            transaction.Status = request.Status;
            transaction.GatewayTransactionId = request.GatewayTransactionId;
            transaction.GatewayResponseCode = request.GatewayResponseCode;
            transaction.GatewayMessage = request.GatewayMessage;
            transaction.UpdatedAt = DateTime.UtcNow;

            if (request.Status.Equals("Success", StringComparison.OrdinalIgnoreCase))
            {
                var order = await _context.BookingOrders.FirstOrDefaultAsync(x => x.Id == transaction.BookingOrderId, cancellationToken);
                if (order != null)
                {
                    order.PaymentStatus = "Paid";
                    order.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<PaymentTransactionDto>
            {
                Success = true,
                Message = "Cập nhật giao dịch thành công"
            };
        }
    }
}
