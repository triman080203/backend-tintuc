namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tickets;

public class TicketDto
{
    public Guid PublicId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal ChildPrice { get; set; }
    public string? PriceCurrency { get; set; }
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
