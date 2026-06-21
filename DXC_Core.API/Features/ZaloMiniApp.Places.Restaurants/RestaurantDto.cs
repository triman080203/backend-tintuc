namespace DXC_Core.API.Features.ZaloMiniApp.Places.Restaurants;

public class RestaurantDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OperatingHours { get; set; }
    public string? Schedule { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? VR360Link { get; set; }
    public string? Category { get; set; }
    public string? AveragePriceRange { get; set; }
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<RestaurantImageDto> Images { get; set; } = new List<RestaurantImageDto>();
}
