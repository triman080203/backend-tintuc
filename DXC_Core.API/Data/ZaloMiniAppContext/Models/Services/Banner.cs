using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Services;

[Table("Banners", Schema = "SERVICES")]
public class Banner
{
    public int Id { get; set; }

    public Guid PublicId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public Guid ImagePublicId { get; set; }

    [Required]
    [MaxLength(20)]
    public string Position { get; set; } = string.Empty; // 'top', 'middle', 'bottom'

    [Required]
    [MaxLength(20)]
    public string BannerType { get; set; } = string.Empty; // 'native', 'web'

    [MaxLength(500)]
    public string? NativeParams { get; set; } // JSON string chứa tham số cho native

    [MaxLength(500)]
    public string? WebLink { get; set; } // URL cho web link
    
    public int ThuTu { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
