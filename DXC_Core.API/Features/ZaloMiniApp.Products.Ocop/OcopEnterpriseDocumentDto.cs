using System.Text.Json.Serialization;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public class OcopEnterpriseDocumentDto
{
    [JsonPropertyName("publicId")]
    public Guid PublicId { get; set; }

    [JsonPropertyName("enterpriseId")]
    public int EnterpriseId { get; set; }

    [JsonPropertyName("documentUrl")]
    public required string DocumentUrl { get; set; }

    [JsonPropertyName("documentName")]
    public required string DocumentName { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("displayOrder")]
    public int DisplayOrder { get; set; }

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    // Navigation property
    [JsonPropertyName("enterprise")]
    public OcopEnterpriseDto? Enterprise { get; set; }
}