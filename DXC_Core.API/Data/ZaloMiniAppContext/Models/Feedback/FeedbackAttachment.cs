using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Feedback;

[Table("FeedbackAttachment", Schema = "FEEDBACK")]
public class FeedbackAttachment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public Guid PublicId { get; set; } = Guid.NewGuid();

    // Foreign Keys
    public int FeedbackId { get; set; }
    public Guid FilePublicId { get; set; }

    [Required]
    [MaxLength(500)]
    public required string FileName { get; set; }

    public long FileSize { get; set; }

    [MaxLength(100)]
    public string? FileType { get; set; }

    public int SortOrder { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("FeedbackId")]
    public virtual Feedback Feedback { get; set; } = null!;
}