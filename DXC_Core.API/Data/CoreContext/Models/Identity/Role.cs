namespace DXC_Core.API.Data.CoreContext.Models.Identity;

public class Role
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; } // Nullable để khớp với database schema
}