using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Services;

public class HotlineCategory
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }        // Tên lĩnh vực
    public string? Description { get; set; }         // Mô tả lĩnh vực
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public virtual ICollection<Hotline> Hotlines { get; set; } = new List<Hotline>();
}
