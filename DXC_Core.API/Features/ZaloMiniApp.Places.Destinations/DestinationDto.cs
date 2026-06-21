namespace DXC_Core.API.Features.ZaloMiniApp.Places.Destinations;

public class DestinationDto
{
    public Guid PublicId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? TimeLimit { get; set; }
    public string? Tag { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? VR360Link { get; set; }
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public List<DestinationImageDto> Images { get; set; } = new();
}

public class DestinationImageDto
{
    public Guid PublicId { get; set; }
    public string ImageUrl { get; set; } = null!;
    public string ImagePublicId { get; set; } = null!;
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }
    public string? Caption { get; set; }
}
