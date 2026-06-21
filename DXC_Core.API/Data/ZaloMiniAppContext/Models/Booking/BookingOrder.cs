namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Booking;

public class BookingOrder
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public string? BookingCode { get; set; }
    
    // Customer info
    public string? CustomerName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Note { get; set; }
    
    // Reference to what they booked
    public int? TourId { get; set; }
    public virtual Tour? Tour { get; set; }
    
    public int? TicketId { get; set; }
    public virtual Ticket? Ticket { get; set; }

    public int Quantity { get; set; } = 1;
    public int AdultQuantity { get; set; } = 1;
    public int ChildQuantity { get; set; } = 0;
    public DateTime? DepartureDate { get; set; }
    public string? DepartureTime { get; set; }
    
    // Payment and status
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed
    public string PaymentStatus { get; set; } = "Unpaid"; // Unpaid, Paid, Refunded
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
