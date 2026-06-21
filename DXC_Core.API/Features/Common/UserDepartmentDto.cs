namespace DXC_Core.API.Features.Common;

public class UserDepartmentDto
{
    public Guid UserPublicId { get; set; }
    public required string UserName { get; set; }
    public required string UserFullName { get; set; }
    public Guid DepartmentPublicId { get; set; }
    public required string DepartmentCode { get; set; }
    public required string DepartmentName { get; set; }
    public Guid OrganizationPublicId { get; set; }
    public required string OrganizationName { get; set; }
}

public class DepartmentUserDto
{
    public Guid UserPublicId { get; set; }
    public required string UserName { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
