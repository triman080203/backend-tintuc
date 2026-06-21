using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class FeedbackMobileDto
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

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Additional computed properties for mobile
    public int AttachmentCount { get; set; } = 0;
    public bool HasResponse { get; set; } = false;
    public DateTime? LastResponseDate { get; set; }
}

public class CreateFeedbackMobileDto
{
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

    // File attachment PublicIds (optional) - Danh sách PublicId của các file đã upload
    public List<Guid>? AttachmentPublicIds { get; set; }
}

public class FeedbackDetailMobileDto
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

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Related data for mobile
    public List<FeedbackAttachmentMobileDto> Attachments { get; set; } = new List<FeedbackAttachmentMobileDto>();
    public List<FeedbackResponseMobileDto> Responses { get; set; } = new List<FeedbackResponseMobileDto>();

    // Assigned department info
    public int? AssignedDepartmentId { get; set; }
    public string? AssignedDepartmentCode { get; set; }
    public string? AssignedDepartmentName { get; set; }
}

public class FeedbackAttachmentMobileDto
{
    [Required]
    public Guid FilePublicId { get; set; }

    [Required]
    [MaxLength(500)]
    public required string FileName { get; set; }

    public long FileSize { get; set; }

    [MaxLength(10)]
    public string? FileType { get; set; }

    public int SortOrder { get; set; }

    // Direct URL to download/view the file
    public string? FileUrl { get; set; }
}

public class FeedbackResponseMobileDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }

    public required string ResponseContent { get; set; }

    public bool? IsApproved { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // File attachments from the handling unit response
    public List<FeedbackResponseAttachmentMobileDto> Attachments { get; set; } = new List<FeedbackResponseAttachmentMobileDto>();
}

public class FeedbackResponseAttachmentMobileDto
{
    [Required]
    public Guid FilePublicId { get; set; }

    [Required]
    [MaxLength(500)]
    public required string FileName { get; set; }

    public long FileSize { get; set; }

    [MaxLength(10)]
    public string? FileType { get; set; }

    public int SortOrder { get; set; }

    // Direct URL to download/view the file
    public string? FileUrl { get; set; }
}
