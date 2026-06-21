using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.TinTuc;

[Table("ArticleAttachments", Schema = "TINTUC")]
public class ArticleAttachment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public Guid PublicId { get; set; } = Guid.NewGuid();

    public int ArticleId { get; set; }

    [Required]
    public Guid FilePublicId { get; set; }

    [Required]
    [MaxLength(500)]
    public required string FileName { get; set; }

    public long FileSize { get; set; }

    [MaxLength(10)]
    public string? FileType { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("ArticleId")]
    public virtual Article Article { get; set; } = null!;
}
