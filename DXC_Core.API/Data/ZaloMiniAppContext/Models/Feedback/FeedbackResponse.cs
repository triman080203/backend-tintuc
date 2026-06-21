using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Feedback;

[Table("FeedbackResponse", Schema = "FEEDBACK")]
public class FeedbackResponse
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public Guid PublicId { get; set; } = Guid.NewGuid();

    // Foreign Keys
    public int FeedbackId { get; set; }
    public int DepartmentId { get; set; }

    [Required]
    public required string ResponseContent { get; set; }

    [MaxLength(1000)]
    public string? ResponseAttachments { get; set; } // JSON string

    public bool? IsApproved { get; set; } // NULL/0/1

    public Guid? ApprovedByUserPublicId { get; set; }

    public DateTime? ApprovedAt { get; set; }

    [MaxLength(500)]
    public string? ApprovalNote { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("FeedbackId")]
    public virtual Feedback Feedback { get; set; } = null!;

    public virtual ICollection<FeedbackResponseAttachment> Attachments { get; set; } = new List<FeedbackResponseAttachment>();
}