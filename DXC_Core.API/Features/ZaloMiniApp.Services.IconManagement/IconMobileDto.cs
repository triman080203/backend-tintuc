using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public class IconMobileDto
{
    public Guid PublicId { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    [Required]
    [MaxLength(500)]
    public required string IconImageUrl { get; set; }

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

    // Navigation info
    public string? CategoryName { get; set; }
    public string? GroupName { get; set; }
}
