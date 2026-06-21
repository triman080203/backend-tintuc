namespace DXC_Core.API.Features.Users;

public class UserDto
{
    public Guid PublicId { get; set; }
    public required string FullName { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Đổi tên thuộc tính để thống nhất với các DTO và Command/Query khác
    public List<string> RoleCodes { get; set; } = new();
    
    // Department and Organization information
    public Guid? DepartmentPublicId { get; set; }
    public string? DepartmentName { get; set; }
    public Guid? OrganizationPublicId { get; set; }
    public string? OrganizationName { get; set; }
}