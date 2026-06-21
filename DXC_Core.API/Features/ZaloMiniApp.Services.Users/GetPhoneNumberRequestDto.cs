namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

public class GetPhoneNumberRequestDto
{
    /// <summary>
    /// Token từ getPhoneNumber API của Zalo SDK
    /// </summary>
    public required string Token { get; set; }

    /// <summary>
    /// Access token của user
    /// </summary>
    public required string AccessToken { get; set; }
}