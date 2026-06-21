using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;

public class OcopEnterprise
{
    public int Id { get; set; }

    public required Guid PublicId { get; set; }

    public required string Name { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Representative { get; set; }

    public string? TaxCode { get; set; }

    public int? EstablishedYear { get; set; }

    public string? Address { get; set; }

    public string? OcopCertificateNumber { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<OcopProduct> Products { get; set; } = new List<OcopProduct>();
    public virtual ICollection<OcopEnterpriseDocument> Documents { get; set; } = new List<OcopEnterpriseDocument>();
}