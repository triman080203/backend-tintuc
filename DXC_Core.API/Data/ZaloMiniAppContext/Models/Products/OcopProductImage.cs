namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;

public class OcopProductImage
{
    public int Id { get; set; }

    public required Guid PublicId { get; set; }

    public int ProductId { get; set; }

    public required string ImageUrl { get; set; }

    public required Guid ImagePublicId { get; set; }

    public int DisplayOrder { get; set; } = 0;

    public bool IsPrimary { get; set; } = false;

    public string? Caption { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual OcopProduct Product { get; set; } = null!;
}
