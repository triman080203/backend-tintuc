namespace DXC_Core.API.Features.Common;

public class DepartmentDto
{
    public Guid PublicId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public Guid OrganizationPublicId { get; set; }
    public required string OrganizationName { get; set; }
}

public class CreateDepartmentDto
{
    public required Guid OrganizationPublicId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}

public class UpdateDepartmentDto
{
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}

public class DepartmentMobileDto
{
    public Guid PublicId { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public Guid OrganizationPublicId { get; set; }
    public required string OrganizationName { get; set; }
}

public class DepartmentWithOrganizationDto : DepartmentDto
{
    public OrganizationDto Organization { get; set; } = null!;
}
