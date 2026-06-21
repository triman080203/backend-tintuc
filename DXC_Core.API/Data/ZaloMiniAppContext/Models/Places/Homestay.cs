namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;

public class Homestay
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public decimal? AveragePrice { get; set; }
    public string? AveragePriceCurrency { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? Website { get; set; }
    public string? LinkVitri { get; set; }
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<HomestayImage> Images { get; set; } = new List<HomestayImage>();
}
