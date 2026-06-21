namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

public class BannerDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Title { get; set; }
    public Guid ImagePublicId { get; set; }
    public required string Position { get; set; }
    public required string BannerType { get; set; }
    public string? NativeParams { get; set; }
    public string? WebLink { get; set; }
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
