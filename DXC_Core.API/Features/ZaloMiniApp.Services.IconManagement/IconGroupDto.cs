using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public class IconGroupDto
{
    public Guid PublicId { get; set; }

    [Required]
    public Guid IconCategoryPublicId { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public int DisplayOrder { get; set; }
    public int ThuTu { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public Guid? ImagePublicId { get; set; }

    // Navigation properties for admin
    public string? IconCategoryName { get; set; }
    public int TotalIcons { get; set; }
}
