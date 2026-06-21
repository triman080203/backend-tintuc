using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.TinTuc;

[Table("Articles", Schema = "TINTUC")]
public class Article
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public Guid PublicId { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(500)]
    public required string Title { get; set; }

    [MaxLength(1000)]
    public string? Summary { get; set; }

    [Required]
    public required string Content { get; set; }

    [MaxLength(500)]
    public string? ThumbnailUrl { get; set; }

    public int CategoryId { get; set; }

    public int CurrentStatusId { get; set; }

    public Guid? AuthorUserPublicId { get; set; }

    [MaxLength(200)]
    public string? AuthorName { get; set; }

    public Guid? EditorUserPublicId { get; set; }

    [MaxLength(500)]
    public string? Tags { get; set; }

    [MaxLength(500)]
    public string? Slug { get; set; }

    public int ViewCount { get; set; } = 0;

    public bool IsPublic { get; set; } = false;

    public DateTime? PublishedAt { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("CategoryId")]
    public virtual ArticleCategory Category { get; set; } = null!;

    [ForeignKey("CurrentStatusId")]
    public virtual ArticleStatus CurrentStatus { get; set; } = null!;

    public virtual ICollection<ArticleAttachment> Attachments { get; set; } = new List<ArticleAttachment>();
    public virtual ICollection<ArticleProcessingHistory> ProcessingHistories { get; set; } = new List<ArticleProcessingHistory>();
}
