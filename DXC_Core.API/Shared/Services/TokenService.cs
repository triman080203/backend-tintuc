using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DXC_Core.API.Data.CoreContext.Models.Identity;
using Microsoft.IdentityModel.Tokens;

namespace DXC_Core.API.Shared.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Cập nhật phương thức để nhận thêm danh sách vai trò
    public string GenerateToken(User user, IEnumerable<string> roles)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Các claim cơ bản
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Dùng NameIdentifier thay cho Sub để tương thích tốt hơn
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        //Thêm các claim cho vai trò
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims, // Sử dụng danh sách claim đã được bổ sung
            expires: DateTime.Now.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}