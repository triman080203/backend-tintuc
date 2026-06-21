using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Services;

public class Hotline
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public int CategoryId { get; set; }             // FK to HotlineCategory
    public required string PhoneNumber { get; set; } // Số điện thoại
    public required string ContactName { get; set; } // Tên người/bộ phận
    public string? Description { get; set; }         // Mô tả đường dây nóng
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public virtual HotlineCategory Category { get; set; } = null!;
}
