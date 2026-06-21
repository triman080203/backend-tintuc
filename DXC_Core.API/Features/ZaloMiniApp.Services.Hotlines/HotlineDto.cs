namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public class HotlineDto
{
    public Guid PublicId { get; set; }
    public Guid CategoryPublicId { get; set; }
    public required string CategoryName { get; set; }
    public required string PhoneNumber { get; set; }
    public required string ContactName { get; set; }
    public string? Description { get; set; }
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class HotlineMobileDto
{
    public Guid PublicId { get; set; }
    public required string PhoneNumber { get; set; }
    public required string ContactName { get; set; }
    public string? Description { get; set; }
    public int ThuTu { get; set; }
}
