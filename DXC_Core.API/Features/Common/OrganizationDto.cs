namespace DXC_Core.API.Features.Common;

public class OrganizationDto
{
    public Guid PublicId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public int DepartmentCount { get; set; }
}

public class CreateOrganizationDto
{
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}

public class UpdateOrganizationDto
{
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}

public class OrganizationMobileDto
{
    public Guid PublicId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}

public class OrganizationWithDepartmentsDto : OrganizationDto
{
    public List<DepartmentDto> Departments { get; set; } = new();
}
