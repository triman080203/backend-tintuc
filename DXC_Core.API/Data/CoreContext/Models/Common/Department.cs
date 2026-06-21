namespace DXC_Core.API.Data.CoreContext.Models.Common;

public class Department
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public int OrganizationId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual Organization Organization { get; set; } = null!;
}
