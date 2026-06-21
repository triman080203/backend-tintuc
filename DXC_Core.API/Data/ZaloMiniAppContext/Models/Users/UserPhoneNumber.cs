using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Users;

public class UserPhoneNumber
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string PhoneNumber { get; set; }        // Số điện thoại ở định dạng quốc tế (84xxxxxxxxx)
    public string? DisplayPhoneNumber { get; set; }        // Số điện thoại để hiển thị (0xxxxxxxxx)
    public string? ZaloUserId { get; set; }                 // ID của user trong Zalo
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Foreign key to User (nếu có bảng Users)
    // public int? UserId { get; set; }
    // public virtual User? User { get; set; }
}