namespace DXC_Core.API.Features.Users;

public class RoleDto
{
    
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; }
}