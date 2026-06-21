using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Services;

public class SupportGroupCategory
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }        // Tên danh mục
    public string? Description { get; set; }         // Mô tả
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public virtual ICollection<SupportGroup> SupportGroups { get; set; } = new List<SupportGroup>();
}