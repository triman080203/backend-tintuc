using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Services;

public class SupportGroup
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public int CategoryId { get; set; }             // FK to SupportGroupCategory
    public required string GroupName { get; set; }   // Tên nhóm
    public required string GroupLink { get; set; }   // Link tham gia nhóm
    public required string GroupType { get; set; }   // Zalo, Facebook, Telegram, etc.
    public string? Description { get; set; }         // Mô tả nhóm
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation property
    public virtual SupportGroupCategory Category { get; set; } = null!;
}