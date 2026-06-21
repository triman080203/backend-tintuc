namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

public class BannerMobileDto
{
    public Guid PublicId { get; set; }
    public required string Title { get; set; }
    public required string ImageUrl { get; set; }
    public required string Position { get; set; }
    public required string BannerType { get; set; }
    public string? NativeParams { get; set; }
    public string? WebLink { get; set; }
    public int ThuTu { get; set; }
}
