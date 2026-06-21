namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class FeedbackDepartmentDto
{
    public required Guid PublicId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
