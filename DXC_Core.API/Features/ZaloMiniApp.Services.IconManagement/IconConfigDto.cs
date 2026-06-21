using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public class IconConfigDto
{
    public List<IconCategoryMobileDto> Categories { get; set; } = new List<IconCategoryMobileDto>();
}

public class IconCategoryMobileDto
{
    public Guid PublicId { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; }

    public List<IconGroupMobileDto> Groups { get; set; } = new List<IconGroupMobileDto>();
    public List<IconMobileDto> Icons { get; set; } = new List<IconMobileDto>();
}

public class IconGroupMobileDto
{
    public Guid PublicId { get; set; }

    [Required]
    [MaxLength(100)]
    public required string Name { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public Guid? ImagePublicId { get; set; }

    public List<IconMobileDto> Icons { get; set; } = new List<IconMobileDto>();
}
