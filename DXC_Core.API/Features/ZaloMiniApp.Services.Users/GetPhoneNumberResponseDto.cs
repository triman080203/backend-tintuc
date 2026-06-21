namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

public class GetPhoneNumberResponseDto
{
    /// <summary>
    /// Số điện thoại ở định dạng quốc tế (84xxxxxxxxx)
    /// </summary>
    public required string PhoneNumber { get; set; }

    /// <summary>
    /// Số điện thoại đã được định dạng để hiển thị (0xxxxxxxxx)
    /// </summary>
    public string? DisplayPhoneNumber { get; set; }
}