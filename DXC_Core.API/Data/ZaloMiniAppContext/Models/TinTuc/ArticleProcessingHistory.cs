using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.TinTuc;

[Table("ArticleProcessingHistory", Schema = "TINTUC")]
public class ArticleProcessingHistory
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public Guid PublicId { get; set; } = Guid.NewGuid();

    public int ArticleId { get; set; }

    public int FromStatusId { get; set; }

    public int ToStatusId { get; set; }

    [MaxLength(50)]
    public string? Action { get; set; }

    public Guid? ActorUserPublicId { get; set; }

    [MaxLength(200)]
    public string? ActorName { get; set; }

    [MaxLength(1000)]
    public string? Note { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("ArticleId")]
    public virtual Article Article { get; set; } = null!;

    [ForeignKey("FromStatusId")]
    public virtual ArticleStatus FromStatus { get; set; } = null!;

    [ForeignKey("ToStatusId")]
    public virtual ArticleStatus ToStatus { get; set; } = null!;
}
