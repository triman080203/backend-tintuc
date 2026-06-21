using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Services.IconManagement;

[Table("Icons", Schema = "SERVICES")]
public class Icon
{
    public int Id { get; set; }

    [Required]
    public Guid PublicId { get; set; } = Guid.NewGuid();

    public int? IconCategoryId { get; set; }

    public int? IconGroupId { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? IconImageUrl { get; set; } // Kept for backward compatibility

    public Guid? ImagePublicId { get; set; } // New field for standard file upload pattern

    [Required]
    [MaxLength(20)]
    public required string IconType { get; set; } // 'native' hoặc 'web'

    [MaxLength(1000)]
    public string? ScreenParams { get; set; } // Params cho native icon

    [MaxLength(500)]
    public string? WebLink { get; set; } // Link cho web icon

    [Column(TypeName = "nvarchar(max)")]
    public string? LinkAndroid { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? LinkIOS { get; set; }

    public int DisplayOrder { get; set; } = 0;
    public int ThuTu { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("IconCategoryId")]
    public virtual IconCategory? IconCategory { get; set; }

    [ForeignKey("IconGroupId")]
    public virtual IconGroup? IconGroup { get; set; }
}
