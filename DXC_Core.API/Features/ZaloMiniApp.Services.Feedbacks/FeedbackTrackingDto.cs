using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class FeedbackTrackingDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }

    [Required]
    [MaxLength(500)]
    public required string Title { get; set; }

    [Required]
    public required string Content { get; set; }

    [Required]
    [MaxLength(200)]
    public required string FullName { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(500)]
    public string? Location { get; set; }

    public bool IsPublic { get; set; } = false;

    // Status information
    public int CurrentStatusId { get; set; }
    public required string CurrentStatusCode { get; set; }
    public required string CurrentStatusName { get; set; }
    public string? CurrentStatusColor { get; set; }

    // Department information
    public int? AssignedDepartmentId { get; set; }
    public Guid? AssignedDepartmentPublicId { get; set; }
    public string? AssignedDepartmentCode { get; set; }
    public string? AssignedDepartmentName { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Processing information
    public List<TrackingFeedbackProcessingDto> Processings { get; set; } = new List<TrackingFeedbackProcessingDto>();
}

public class FeedbackTrackingMobileDto
{
    public Guid PublicId { get; set; }
    public required string Title { get; set; }
    public required string FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public int CurrentStatusId { get; set; }
    public required string CurrentStatusName { get; set; }
    public DateTime CreatedAt { get; set; }
}