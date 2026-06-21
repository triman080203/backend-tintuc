namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;

public class OcopProduct
{
    public int Id { get; set; }

    public required Guid PublicId { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public int CategoryId { get; set; }

    public int EnterpriseId { get; set; }

    public decimal? ReferencePrice { get; set; }

    public decimal? PromotionalPrice { get; set; }

    public string? ContactPhone { get; set; }

    public string? ContactAddress { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual OcopProductCategory Category { get; set; } = null!;

    public virtual OcopEnterprise Enterprise { get; set; } = null!;

    public virtual ICollection<OcopProductImage> Images { get; set; } = new List<OcopProductImage>();
}