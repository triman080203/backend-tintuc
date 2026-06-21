namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;

public class Hotel
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public int? StarRating { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public string? OperatingHours { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? VR360Link { get; set; }
    public decimal? PriceFrom { get; set; }
    public string? PriceFromCurrency { get; set; }
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<HotelImage> Images { get; set; } = new List<HotelImage>();
}
