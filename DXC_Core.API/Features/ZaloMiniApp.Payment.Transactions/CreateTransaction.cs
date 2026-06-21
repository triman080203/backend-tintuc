using FluentValidation;
using MediatR;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Payment;
using DXC_Core.API.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Payment.Transactions;

public static class CreateTransaction
{
    public class Command : IRequest<ApiResult<PaymentTransactionDto>>
    {
        public Guid BookingOrderPublicId { get; set; }
        public decimal Amount { get; set; }
        public string? Currency { get; set; } = "VND";
        public string PaymentMethod { get; set; } = null!;
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.BookingOrderPublicId).NotEmpty();
            RuleFor(x => x.Amount).GreaterThan(0);
            RuleFor(x => x.PaymentMethod).NotEmpty();
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
            var order = await _context.BookingOrders.FirstOrDefaultAsync(x => x.PublicId == request.BookingOrderPublicId, cancellationToken);
            if (order == null)
            {
                return new ApiResult<PaymentTransactionDto> { Success = false, Message = "Đơn hàng không tồn tại" };
            }

            var transaction = new PaymentTransaction
            {
                BookingOrderId = order.Id,
                Amount = request.Amount,
                Currency = request.Currency,
                PaymentMethod = request.PaymentMethod,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.PaymentTransactions.Add(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<PaymentTransactionDto>
            {
                Success = true,
                Message = "Tạo giao dịch thành công",
                Data = new PaymentTransactionDto { PublicId = transaction.PublicId }
            };
        }
    }
}
