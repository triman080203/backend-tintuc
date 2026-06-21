namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Booking;

public class Tour
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Highlights { get; set; }
    public string? Schedule { get; set; }
    public decimal Price { get; set; }
    public string? PriceCurrency { get; set; } = "VND";
    public int DurationDays { get; set; } = 1;
    public int DurationNights { get; set; } = 0;
    public string? DepartureLocation { get; set; }
    public int MaxParticipants { get; set; } = 20;
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<TourImage> Images { get; set; } = new List<TourImage>();
}
