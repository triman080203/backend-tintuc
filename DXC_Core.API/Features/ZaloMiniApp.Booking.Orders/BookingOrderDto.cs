namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Orders;

public class BookingOrderDto
{
    public Guid PublicId { get; set; }
    public string? BookingCode { get; set; }
    public string? CustomerName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Note { get; set; }
    public Guid? TourId { get; set; }
    public Guid? TicketId { get; set; }
    public string? ServiceType { get; set; }
    public string? ServiceName { get; set; }
    public int Quantity { get; set; }
    public int AdultQuantity { get; set; }
    public int ChildQuantity { get; set; }
    public DateTime? DepartureDate { get; set; }
    public string? DepartureTime { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
