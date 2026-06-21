using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class CreateFeedbackDto
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