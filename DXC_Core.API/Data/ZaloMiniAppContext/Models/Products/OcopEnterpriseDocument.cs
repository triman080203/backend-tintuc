namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;

public class OcopEnterpriseDocument
{
    public int Id { get; set; }

    public required Guid PublicId { get; set; }

    public int EnterpriseId { get; set; }

    public required string DocumentUrl { get; set; }

    public required string DocumentName { get; set; }

    public string? Description { get; set; }

    public int DisplayOrder { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual OcopEnterprise Enterprise { get; set; } = null!;
}