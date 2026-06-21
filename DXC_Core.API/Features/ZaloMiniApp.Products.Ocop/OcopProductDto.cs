using System.Text.Json.Serialization;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public class OcopProductDto
{
    [JsonPropertyName("publicId")]
    public Guid PublicId { get; set; }

    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("referencePrice")]
    public decimal? ReferencePrice { get; set; }

    [JsonPropertyName("promotionalPrice")]
    public decimal? PromotionalPrice { get; set; }

    [JsonPropertyName("contactPhone")]
    public string? ContactPhone { get; set; }

    [JsonPropertyName("contactAddress")]
    public string? ContactAddress { get; set; }

    [JsonPropertyName("latitude")]
    public decimal? Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public decimal? Longitude { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    [JsonPropertyName("category")]
    public OcopProductCategoryDto? Category { get; set; }

    [JsonPropertyName("enterprise")]
    public OcopEnterpriseDto? Enterprise { get; set; }

    [JsonPropertyName("images")]
    public List<OcopProductImageDto> Images { get; set; } = new();
}

public class OcopProductMobileDto : OcopProductDto
{
    // Mobile-specific fields can be added here if needed
}