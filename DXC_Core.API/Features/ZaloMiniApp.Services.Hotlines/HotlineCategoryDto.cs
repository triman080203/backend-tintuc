namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public class HotlineCategoryDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int HotlinesCount { get; set; }
}

public class HotlineCategoryMobileDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int ThuTu { get; set; }
    public List<HotlineMobileDto> Hotlines { get; set; } = new List<HotlineMobileDto>();
}
