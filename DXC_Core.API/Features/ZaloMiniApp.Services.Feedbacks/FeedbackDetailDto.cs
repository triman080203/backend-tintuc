using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class FeedbackDetailDto
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
    public string? AssignedDepartmentContactEmail { get; set; }
    public string? AssignedDepartmentContactPhone { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Related data
    public List<FeedbackAttachmentDto> Attachments { get; set; } = new List<FeedbackAttachmentDto>();
    public List<FeedbackProcessingDto> Processings { get; set; } = new List<FeedbackProcessingDto>();
    public List<FeedbackResponseDto> Responses { get; set; } = new List<FeedbackResponseDto>();
}

public class FeedbackAttachmentDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public Guid FilePublicId { get; set; }
    public required string FileName { get; set; }
    public long FileSize { get; set; }
    public string? FileType { get; set; }
    public int SortOrder { get; set; }
    public string? DownloadUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class FeedbackProcessingDto
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

public class FeedbackResponseDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public int DepartmentId { get; set; }
    public required string DepartmentCode { get; set; }
    public required string DepartmentName { get; set; }
    public required string ResponseContent { get; set; }
    public string? ResponseAttachments { get; set; }
    public bool? IsApproved { get; set; }
    public Guid? ApprovedByUserPublicId { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? ApprovalNote { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Related data
    public List<FeedbackResponseAttachmentDto> Attachments { get; set; } = new List<FeedbackResponseAttachmentDto>();
}