namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

public class TotalUserDto
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required string Username { get; set; }
    public string? Avatar { get; set; }
    public string? PhanQuyen { get; set; }
    public string? PhoneNumber { get; set; }
}
