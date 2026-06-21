// File: DXC_Core.API/Features/Identity/UpdateUserRoles.cs

using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Identity;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class UpdateUserRoles
{
    public class Command : IRequest<ApiResult<bool>>
    {
        public string PublicId { get; set; } = string.Empty;
        public List<string> RoleCodes { get; set; } = new();
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(c => c.PublicId)
                .NotEmpty()
                .Must(BeValidGuid)
                .WithMessage("PublicId không hợp lệ.")
                .MustAsync(UserMustExist)
                .WithMessage("Người dùng không tồn tại.");
            
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

        private bool BeValidGuid(string publicId)
        {
            return Guid.TryParse(publicId, out _);
        }

        private async Task<bool> UserMustExist(string publicId, CancellationToken cancellationToken)
        {
            if (!Guid.TryParse(publicId, out var guid))
                return false;
                
            return await _dbContext.Users.AnyAsync(u => u.PublicId == guid, cancellationToken);
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
            var publicId = Guid.Parse(request.PublicId);
            var user = await _dbContext.Users.FirstAsync(u => u.PublicId == publicId, cancellationToken);

            var currentRoles = await _dbContext.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .ToListAsync(cancellationToken);
            
            _dbContext.UserRoles.RemoveRange(currentRoles);

            // Lấy RoleIds từ RoleCodes
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