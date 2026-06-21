namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tours;

public class TourDto
{
    public Guid PublicId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Highlights { get; set; }
    public string? Schedule { get; set; }
    public decimal Price { get; set; }
    public string? PriceCurrency { get; set; }
    public int DurationDays { get; set; }
    public int DurationNights { get; set; }
    public string? DepartureLocation { get; set; }
    public int MaxParticipants { get; set; }
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public List<TourImageDto> Images { get; set; } = new();
}

public class TourImageDto
{
    public Guid? PublicId { get; set; }
    public string ImageUrl { get; set; } = null!;
    public string ImagePublicId { get; set; } = null!;
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }
    public string? Caption { get; set; }
}
