using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public class IconCategoryDto
{
    public Guid PublicId { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    // Navigation properties for admin
    public int TotalIconGroups { get; set; }
    public int TotalIcons { get; set; }
}