namespace DXC_Core.API.Data.CoreContext.Models.Common;

public class UserDepartment
{
    public int UserId { get; set; }
    public int DepartmentId { get; set; }

    // Navigation properties
    public virtual Models.Identity.User User { get; set; } = null!;
    public virtual Department Department { get; set; } = null!;
}
