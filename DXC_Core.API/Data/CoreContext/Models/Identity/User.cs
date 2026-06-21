namespace DXC_Core.API.Data.CoreContext.Models.Identity;

public class User
{
    // Giữ nguyên PK nội bộ
    public int Id { get; set; }
    
    // Thêm ID công khai
    public Guid PublicId { get; set; }
    
    public required string FullName { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}