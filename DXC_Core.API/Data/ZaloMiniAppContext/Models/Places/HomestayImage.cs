namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;

public class HomestayImage
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public int HomestayId { get; set; }
    public required string ImageUrl { get; set; }
    public required Guid ImagePublicId { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsPrimary { get; set; } = false;
    public string? Caption { get; set; }
    public DateTime CreatedAt { get; set; }
}