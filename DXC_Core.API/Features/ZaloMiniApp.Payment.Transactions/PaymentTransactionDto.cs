namespace DXC_Core.API.Features.ZaloMiniApp.Payment.Transactions;

public class PaymentTransactionDto
{
    public Guid PublicId { get; set; }
    public int BookingOrderId { get; set; }
    public decimal Amount { get; set; }
    public string? Currency { get; set; }
    public string PaymentMethod { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? GatewayTransactionId { get; set; }
    public string? GatewayResponseCode { get; set; }
    public string? GatewayMessage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
