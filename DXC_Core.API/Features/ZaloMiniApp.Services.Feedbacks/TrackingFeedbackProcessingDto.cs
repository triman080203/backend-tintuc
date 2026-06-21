namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class TrackingFeedbackProcessingDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public int FromStatusId { get; set; }
    public required string FromStatusCode { get; set; }
    public required string FromStatusName { get; set; }
    public int ToStatusId { get; set; }
    public required string ToStatusCode { get; set; }
    public required string ToStatusName { get; set; }
    public int? AssignedDepartmentId { get; set; }
    public string? AssignedDepartmentCode { get; set; }
    public string? AssignedDepartmentName { get; set; }
    public Guid? AssignedByUserPublicId { get; set; }
    public DateTime AssignedAt { get; set; }
    public string? ProcessingNote { get; set; }
    public DateTime CreatedAt { get; set; }
}