using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using DXC_Core.API.Shared.Services;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class ResetUserPassword
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
        public required string NewPassword { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.PublicId)
                .NotEmpty();

            RuleFor(c => c.NewPassword)
                .NotEmpty()
                .MinimumLength(8)
                .WithMessage("Mật khẩu mới phải có ít nhất 8 ký tự.");
        }
    }

    public class Handler(CoreDbContext dbContext, IPasswordHasherService passwordHasher) : IRequestHandler<Command, ApiResult>
    {
        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.PublicId == request.PublicId, cancellationToken);

            if (user == null)
            {
                return new ApiResult { Success = false, Message = "Không tìm thấy người dùng." };
            }

            user.PasswordHash = passwordHasher.HashPassword(request.NewPassword);
            await dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult { Success = true, Message = "Đã đặt lại mật khẩu cho người dùng." };
        }
    }
}
