namespace DXC_Core.API.Data.CoreContext.Models.Common;

public class Organization
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation property
    public virtual ICollection<Department> Departments { get; set; } = new List<Department>();
}
