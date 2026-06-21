using System.Text.Json.Serialization;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

public class HotelDto
{
    
    
    [JsonPropertyName("publicId")]
    public Guid PublicId { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("address")]
    public string? Address { get; set; }
    
    [JsonPropertyName("starRating")]
    public int? StarRating { get; set; }
    
    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }
    
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    
    [JsonPropertyName("website")]
    public string? Website { get; set; }
    
    [JsonPropertyName("operatingHours")]
    public string? OperatingHours { get; set; }
    
    [JsonPropertyName("latitude")]
    public decimal? Latitude { get; set; }
    
    [JsonPropertyName("longitude")]
    public decimal? Longitude { get; set; }
    
    [JsonPropertyName("vr360Link")]
    public string? VR360Link { get; set; }
    
    [JsonPropertyName("priceFrom")]
    public decimal? PriceFrom { get; set; }
    
    [JsonPropertyName("priceFromCurrency")]
    public string? PriceFromCurrency { get; set; }
    
    [JsonPropertyName("thuTu")]
    public int ThuTu { get; set; }
    
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

public class HotelWithImagesDto : HotelDto
{
    [JsonPropertyName("images")]
    public List<HotelImageDto> Images { get; set; } = new();
}
