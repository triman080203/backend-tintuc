namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public class SupportGroupCategoryDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}