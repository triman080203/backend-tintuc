using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class UpdateFeedbackDto
{
    [Required]
    public Guid PublicId { get; set; }

    [MaxLength(500)]
    public string? Title { get; set; }

    public string? Content { get; set; }

    [MaxLength(200)]
    public string? FullName { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    public bool? IsPublic { get; set; }

    // Admin only fields
    public int? CurrentStatusId { get; set; }
    public Guid? AssignedDepartmentPublicId { get; set; }
}

public class AssignFeedbackDto
{
    [Required]
    public Guid FeedbackPublicId { get; set; }

    [Required]
    public Guid DepartmentPublicId { get; set; }

    [Required]
    public int ToStatusId { get; set; }

    [MaxLength(1000)]
    public string? ProcessingNote { get; set; }
}

public class ProcessFeedbackDto
{
    [Required]
    public Guid FeedbackPublicId { get; set; }

    [Required]
    public int FromStatusId { get; set; }

    [Required]
    public int ToStatusId { get; set; }

    [MaxLength(1000)]
    public string? ProcessingNote { get; set; }
}

public class ApproveFeedbackResponseDto
{
    [Required]
    public int ResponseId { get; set; }

    public bool IsApproved { get; set; }

    [MaxLength(500)]
    public string? ApprovalNote { get; set; }
}