namespace DXC_Core.API.Shared.Services;

public interface IZaloPhoneNumberService
{
    /// <summary>
    /// Lấy số điện thoại từ Zalo Open API sử dụng token
    /// </summary>
    /// <param name="token">Token từ getPhoneNumber API</param>
    /// <param name="accessToken">Access token của user</param>
    /// <returns>Số điện thoại ở định dạng quốc tế (84xxxxxxxxx)</returns>
    Task<string> GetPhoneNumberAsync(string token, string accessToken);
}