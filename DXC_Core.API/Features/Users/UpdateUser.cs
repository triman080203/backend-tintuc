using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Identity;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class UpdateUser
{
    public class Command : IRequest<ApiResult<bool>>
    {
        public Guid PublicId { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public bool IsActive { get; set; }
        public List<string> RoleCodes { get; set; } = new();
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext context)
        {
            _dbContext = context;
            
            RuleFor(c => c.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không hợp lệ.")
                .MustAsync(UserMustExist)
                .WithMessage("Người dùng không tồn tại.");
            
            RuleFor(c => c.FullName).NotEmpty();
            RuleFor(c => c.Email).NotEmpty().EmailAddress();
            
            // Đảm bảo email mới không bị trùng với người dùng khác
            RuleFor(c => c.Email)
                .MustAsync(async (command, email, cancellation) => {
                    return !await _dbContext.Users.AnyAsync(u => u.Email == email && u.PublicId != command.PublicId, cancellation);
                })
                .WithMessage("Email đã được sử dụng bởi một người dùng khác.");
            
            RuleFor(c => c.RoleCodes)
                .NotNull()
                .MustAsync(async (roleCodes, cancellation) =>
                {
                    if (!roleCodes.Any()) return true; // Cho phép danh sách rỗng
                    
                    var existingRoleCodes = await _dbContext.Roles
                        .Where(r => roleCodes.Contains(r.Code))
                        .Select(r => r.Code)
                        .ToListAsync(cancellation);
                    
                    return roleCodes.All(code => existingRoleCodes.Contains(code));
                })
                .WithMessage("Một hoặc nhiều mã vai trò không tồn tại.");
        }

        private async Task<bool> UserMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Users.AnyAsync(u => u.PublicId == publicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<bool>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<bool>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users.FirstAsync(u => u.PublicId == request.PublicId, cancellationToken);

            // Cập nhật thông tin user
            user.FullName = request.FullName;
            user.Email = request.Email;
            user.IsActive = request.IsActive;

            // Cập nhật roles
            var currentRoles = await _dbContext.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .ToListAsync(cancellationToken);
            
            _dbContext.UserRoles.RemoveRange(currentRoles);

            // Lấy RoleIds từ RoleCodes và thêm roles mới
            if (request.RoleCodes.Any())
            {
                var roleIds = await _dbContext.Roles
                    .Where(r => request.RoleCodes.Contains(r.Code))
                    .Select(r => r.Id)
                    .ToListAsync(cancellationToken);
                
                var newUserRoles = roleIds.Select(roleId => new UserRole { UserId = user.Id, RoleId = roleId });
                await _dbContext.UserRoles.AddRangeAsync(newUserRoles, cancellationToken);
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult<bool> { Success = true, Data = true };
        }
    }
}