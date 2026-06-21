namespace DXC_Core.API.Features.Users;

public class UserWithRolesDto
{
    public Guid PublicId { get; set; }
    public required string FullName { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    // Thống nhất tên thuộc tính cho danh sách vai trò
    public List<string> RoleCodes { get; set; } = new();
}