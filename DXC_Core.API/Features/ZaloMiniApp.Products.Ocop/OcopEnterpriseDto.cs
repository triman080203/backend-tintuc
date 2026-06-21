using System.Text.Json.Serialization;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public class OcopEnterpriseDto
{
    [JsonPropertyName("publicId")]
    public Guid PublicId { get; set; }

    [JsonPropertyName("name")]
    public required string Name { get; set; }

    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }

    [JsonPropertyName("representative")]
    public string? Representative { get; set; }

    [JsonPropertyName("taxCode")]
    public string? TaxCode { get; set; }

    [JsonPropertyName("establishedYear")]
    public int? EstablishedYear { get; set; }

    [JsonPropertyName("address")]
    public string? Address { get; set; }

    [JsonPropertyName("ocopCertificateNumber")]
    public string? OcopCertificateNumber { get; set; }

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
}

public class OcopEnterpriseMobileDto : OcopEnterpriseDto
{
    // Mobile-specific fields can be added here if needed
}