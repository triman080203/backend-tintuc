namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public class SupportGroupDto
{
    public Guid PublicId { get; set; }
    public Guid CategoryPublicId { get; set; }
    public required string CategoryName { get; set; }
    public required string GroupName { get; set; }
    public required string GroupLink { get; set; }
    public required string GroupType { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class SupportGroupMobileDto
{
    public Guid PublicId { get; set; }
    public required string GroupName { get; set; }
    public required string GroupLink { get; set; }
    public required string GroupType { get; set; }
    public string? Description { get; set; }
}