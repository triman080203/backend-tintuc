namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class FeedbackStatusDto
{
    public required Guid PublicId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
