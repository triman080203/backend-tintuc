using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using DXC_Core.API.Shared.Services;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Identity;

public static class Login
{
    // DTO chứa token trả về
    public class LoginResult
    {
        public required string AccessToken { get; set; }
    }

    public class Query : IRequest<ApiResult<LoginResult>>
    {
        public required string UserName { get; set; }
        public required string Password { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(q => q.UserName).NotEmpty();
            RuleFor(q => q.Password).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Query, ApiResult<LoginResult>>
    {
        private readonly CoreDbContext _coreDbContext;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly ITokenService _tokenService;

        public Handler(CoreDbContext coreDbContext, IPasswordHasherService passwordHasher, ITokenService tokenService)
        {
            _coreDbContext = coreDbContext;
            _passwordHasher = passwordHasher;
            _tokenService = tokenService;
        }

        public async Task<ApiResult<LoginResult>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _coreDbContext.Users
                .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

            if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return new ApiResult<LoginResult> { Success = false, Message = "Tên đăng nhập hoặc mật khẩu không chính xác." };
            }


            // 3. Lấy danh sách tên vai trò của người dùng
            var userRoles = await _coreDbContext.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .Select(ur => ur.Role.Code) 
                .ToListAsync(cancellationToken);

            // 4. Tạo token và truyền danh sách vai trò vào
            var token = _tokenService.GenerateToken(user, userRoles);
            
            
            // 5. Trả về kết quả
            return new ApiResult<LoginResult>
            {
                Success = true,
                Data = new LoginResult { AccessToken = token }
            };
        }
    }
}