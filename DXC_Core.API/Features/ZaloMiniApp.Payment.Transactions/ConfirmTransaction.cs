using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Payment.Transactions;

public static class ConfirmTransaction
{
    public class Query : IRequest<ConfirmResult>
    {
        public Guid PublicId { get; set; }
    }

    public class ConfirmResult
    {
        public bool Success { get; set; }
        public bool AlreadyPaid { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? BookingCode { get; set; }
        public decimal? Amount { get; set; }
    }

    public class Handler : IRequestHandler<Query, ConfirmResult>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ConfirmResult> Handle(Query request, CancellationToken cancellationToken)
        {
            var transaction = await _context.PaymentTransactions
                .Include(x => x.BookingOrder)
                .FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);

            if (transaction == null)
                return new ConfirmResult { Success = false, Message = "Không tìm thấy giao dịch" };

            if (transaction.Status == "Success")
                return new ConfirmResult
                {
                    Success = true,
                    AlreadyPaid = true,
                    Message = "Giao dịch này đã được thanh toán trước đó",
                    BookingCode = transaction.BookingOrder?.BookingCode,
                    Amount = transaction.Amount
                };

            // Cập nhật transaction
            transaction.Status = "Success";
            transaction.GatewayTransactionId = "QR_SCAN_" + DateTime.UtcNow.Ticks;
            transaction.GatewayResponseCode = "00";
            transaction.GatewayMessage = "Thanh toán qua mã QR thành công";
            transaction.UpdatedAt = DateTime.UtcNow;

            // Cập nhật trạng thái đơn hàng
            if (transaction.BookingOrder != null)
            {
                transaction.BookingOrder.PaymentStatus = "Paid";
                transaction.BookingOrder.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new ConfirmResult
            {
                Success = true,
                AlreadyPaid = false,
                Message = "Thanh toán thành công!",
                BookingCode = transaction.BookingOrder?.BookingCode,
                Amount = transaction.Amount
            };
        }
    }
}
