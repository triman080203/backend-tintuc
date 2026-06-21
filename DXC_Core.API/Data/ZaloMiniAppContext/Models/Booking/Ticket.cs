namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Booking;

public class Ticket
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; } // e.g., Vé cáp treo Sun World, Vé vào cổng...
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal ChildPrice { get; set; } = 0;
    public string? PriceCurrency { get; set; } = "VND";
    public string? TicketType { get; set; } // Adult, Child, Senior
    public string? CoverImagePublicId { get; set; }
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
