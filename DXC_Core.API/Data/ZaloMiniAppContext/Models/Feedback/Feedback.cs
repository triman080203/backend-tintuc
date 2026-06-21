using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Feedback;

[Table("Feedback", Schema = "FEEDBACK")]
public class Feedback
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public Guid PublicId { get; set; } = Guid.NewGuid();

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

    // Foreign Keys
    public int CurrentStatusId { get; set; }
    public int? AssignedDepartmentId { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("CurrentStatusId")]
    public virtual FeedbackStatus CurrentStatus { get; set; } = null!;

    public virtual ICollection<FeedbackAttachment> Attachments { get; set; } = new List<FeedbackAttachment>();
    public virtual ICollection<FeedbackProcessing> Processings { get; set; } = new List<FeedbackProcessing>();
    public virtual ICollection<FeedbackResponse> Responses { get; set; } = new List<FeedbackResponse>();
}