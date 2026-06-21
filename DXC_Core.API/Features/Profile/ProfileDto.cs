namespace DXC_Core.API.Features.Profile;

public class ProfileDto
{
    public Guid PublicId { get; set; }
    public string? Address { get; set; }
    public string? Workplace { get; set; }
    public string? JobTitle { get; set; }
    public string? Position { get; set; }
    public bool? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ProfileMobileDto
{
    public Guid PublicId { get; set; }
    public string? Address { get; set; }
    public string? Workplace { get; set; }
    public string? JobTitle { get; set; }
    public string? Position { get; set; }
    public bool? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
}

public class UserProfileDto
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }
    public bool IsActive { get; set; }
    public DateTime UserCreatedAt { get; set; }
    
    public ProfileDto? Profile { get; set; }
}

public class UpdateProfileDto
{
    public string? Address { get; set; }
    public string? Workplace { get; set; }
    public string? JobTitle { get; set; }
    public string? Position { get; set; }
    public bool? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
}
