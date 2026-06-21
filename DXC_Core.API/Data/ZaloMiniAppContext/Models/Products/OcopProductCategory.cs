namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;

public class OcopProductCategory
{
    public int Id { get; set; }

    public required Guid PublicId { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public Guid? ImagePublicId { get; set; }

    public int DisplayOrder { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<OcopProduct> Products { get; set; } = new List<OcopProduct>();
}