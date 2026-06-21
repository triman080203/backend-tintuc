using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Feedback;

[Table("FeedbackProcessing", Schema = "FEEDBACK")]
public class FeedbackProcessing
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public Guid PublicId { get; set; } = Guid.NewGuid();

    // Foreign Keys
    public int FeedbackId { get; set; }
    public int FromStatusId { get; set; }
    public int ToStatusId { get; set; }
    public int? AssignedDepartmentId { get; set; }
    public Guid? AssignedByUserPublicId { get; set; }

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string? ProcessingNote { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("FeedbackId")]
    public virtual Feedback Feedback { get; set; } = null!;

    [ForeignKey("FromStatusId")]
    public virtual FeedbackStatus FromStatus { get; set; } = null!;

    [ForeignKey("ToStatusId")]
    public virtual FeedbackStatus ToStatus { get; set; } = null!;
}