using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class DeleteRole
{
    public class Command : IRequest<ApiResult<bool>>
    {
        public Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(c => c.PublicId)
                .NotEmpty()
                .WithMessage("PublicID vai trò không được rỗng.")
                .MustAsync(RoleMustExist)
                .WithMessage("Vai trò không tồn tại.")
                .MustAsync(RoleNotInUse)
                .WithMessage("Không thể xóa vai trò đang được sử dụng bởi người dùng.");
        }

        private async Task<bool> RoleMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Roles.AnyAsync(r => r.PublicId == publicId, cancellationToken);
        }

        private async Task<bool> RoleNotInUse(Guid publicId, CancellationToken cancellationToken)
        {
            var role = await _dbContext.Roles.FirstOrDefaultAsync(r => r.PublicId == publicId, cancellationToken);
            if (role == null) return true; // Or false, depending on how you want to handle this case. Let's assume RoleMustExist already handled it.
            return !await _dbContext.UserRoles.AnyAsync(ur => ur.RoleId == role.Id, cancellationToken);
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Command, ApiResult<bool>>
    {
        public async Task<ApiResult<bool>> Handle(Command request, CancellationToken cancellationToken)
        {
            var role = await dbContext.Roles.FirstAsync(r => r.PublicId == request.PublicId, cancellationToken);

            dbContext.Roles.Remove(role);
            await dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult<bool>
            {
                Success = true,
                Data = true,
                Message = "Xóa vai trò thành công."
            };
        }
    }
}