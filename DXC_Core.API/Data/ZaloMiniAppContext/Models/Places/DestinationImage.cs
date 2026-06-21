namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;

public class DestinationImage
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public int DestinationId { get; set; }
    public required string ImageUrl { get; set; }
    public required string ImagePublicId { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsPrimary { get; set; } = false;
    public string? Caption { get; set; }
    public DateTime CreatedAt { get; set; }

    public virtual Destination Destination { get; set; } = null!;
}
