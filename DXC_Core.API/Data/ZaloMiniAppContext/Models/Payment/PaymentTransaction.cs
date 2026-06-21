namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Payment;

using DXC_Core.API.Data.ZaloMiniAppContext.Models.Booking;

public class PaymentTransaction
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    
    public int BookingOrderId { get; set; }
    public virtual BookingOrder BookingOrder { get; set; } = null!;

    public decimal Amount { get; set; }
    public string? Currency { get; set; } = "VND";
    public string PaymentMethod { get; set; } = "VNPAY"; // VNPAY, MoMo, BankTransfer, Cash
    public string Status { get; set; } = "Pending"; // Pending, Success, Failed
    
    public string? GatewayTransactionId { get; set; } // ID từ VNPAY/MoMo trả về
    public string? GatewayResponseCode { get; set; }
    public string? GatewayMessage { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
