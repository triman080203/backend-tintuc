namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;
 
public class HomestayDto
{
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
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<HomestayImageDto> Images { get; set; } = new List<HomestayImageDto>();
}
