using System.Security.Claims;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using DXC_Core.API.Shared.Services;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Identity;

public static class ResetMyPassword
{
    public class Command : IRequest<ApiResult>
    {
        public required string NewPassword { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.NewPassword)
                .NotEmpty()
                .MinimumLength(8)
                .WithMessage("Mật khẩu mới phải có ít nhất 8 ký tự.");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly CoreDbContext _dbContext;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public Handler(CoreDbContext dbContext, IPasswordHasherService passwordHasher, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _passwordHasher = passwordHasher;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var userIdString = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return new ApiResult { Success = false, Message = "Token không hợp lệ hoặc không tìm thấy User ID." };
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

            if (user == null)
            {
                return new ApiResult { Success = false, Message = "Không tìm thấy người dùng." };
            }

            user.PasswordHash = _passwordHasher.HashPassword(request.NewPassword);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult { Success = true, Message = "Đặt lại mật khẩu thành công." };
        }
    }
}
