namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;

public class HomestayImageDto
{
    public Guid PublicId { get; set; }
    public required string ImageUrl { get; set; }
    public required Guid ImagePublicId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }
    public string? Caption { get; set; }
}