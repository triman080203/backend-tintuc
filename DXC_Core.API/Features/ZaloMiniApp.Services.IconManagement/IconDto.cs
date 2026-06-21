using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public class IconDto
{
    public Guid PublicId { get; set; }

    public Guid? IconCategoryPublicId { get; set; }

    public Guid? IconGroupPublicId { get; set; }

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

    public string? LinkAndroid { get; set; }

    public string? LinkIOS { get; set; }

    public int DisplayOrder { get; set; }
    public int ThuTu { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // Navigation properties for admin
    public string? IconCategoryName { get; set; }
    public string? IconGroupName { get; set; }
}
