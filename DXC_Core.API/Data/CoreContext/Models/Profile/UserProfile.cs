namespace DXC_Core.API.Data.CoreContext.Models.Profile;

public class UserProfile
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    
    // Foreign key to User
    public int UserId { get; set; }
    
    // Thông tin mở rộng không bắt buộc
    public string? Address { get; set; }
    public string? Workplace { get; set; }
    public string? JobTitle { get; set; }
    public string? Position { get; set; }
    public bool? Gender { get; set; } // true=nam, false=nữ, null=không khai báo
    public DateTime? DateOfBirth { get; set; }
    
    // Audit fields
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Soft delete
    public bool IsActive { get; set; } = true;
    
    // Navigation property
    public virtual Models.Identity.User User { get; set; } = null!;
}
