using System.Security.Claims;
using DXC_Core.API.Data.CoreContext.Models.Identity;

namespace DXC_Core.API.Shared.Services;

public interface ITokenService
{
     // Cập nhật phương thức để nhận thêm danh sách vai trò
    string GenerateToken(User user, IEnumerable<string> roles);
}