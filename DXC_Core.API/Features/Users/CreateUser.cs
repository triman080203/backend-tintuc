using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Identity;
using DXC_Core.API.Shared.Contracts;
using DXC_Core.API.Shared.Services;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class CreateUser
{
    // Command chứa thông tin cần thiết để tạo người dùng
    public class Command : IRequest<ApiResult<UserDto>>
    {
        public required string FullName { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public List<string> RoleCodes { get; set; } = new();
    }

    // Validator để đảm bảo dữ liệu đầu vào hợp lệ
    public class Validator : AbstractValidator<Command>
    {
        public Validator(CoreDbContext context)
        {
            RuleFor(c => c.FullName).NotEmpty();
            RuleFor(c => c.UserName).NotEmpty().MinimumLength(4);
            RuleFor(c => c.Email).NotEmpty().EmailAddress();
            RuleFor(c => c.Password).NotEmpty().MinimumLength(8)
                .Matches("[A-Z]").WithMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa.")
                .Matches("[a-z]").WithMessage("Mật khẩu phải chứa ít nhất 1 chữ thường.")
                .Matches("[0-9]").WithMessage("Mật khẩu phải chứa ít nhất 1 chữ số.");

            // Kiểm tra tính duy nhất
            RuleFor(c => c.UserName)
                .MustAsync(async (userName, cancellation) => !await context.Users.AnyAsync(u => u.UserName == userName, cancellation))
                .WithMessage("Tên đăng nhập đã tồn tại.");

            RuleFor(c => c.Email)
                .MustAsync(async (email, cancellation) => !await context.Users.AnyAsync(u => u.Email == email, cancellation))
                .WithMessage("Email đã tồn tại.");

            // Kiểm tra RoleCodes có tồn tại không
            RuleFor(c => c.RoleCodes)
                .MustAsync(async (roleCodes, cancellation) => 
                {
                    if (!roleCodes.Any()) return true; // Cho phép danh sách rỗng
                    
                    var existingRoleCodes = await context.Roles
                        .Where(r => roleCodes.Contains(r.Code))
                        .Select(r => r.Code)
                        .ToListAsync(cancellation);
                    
                    return roleCodes.All(code => existingRoleCodes.Contains(code));
                })
                .WithMessage("Một hoặc nhiều mã vai trò không tồn tại.");
        }
    }

    // Handler xử lý logic nghiệp vụ
    public class Handler : IRequestHandler<Command, ApiResult<UserDto>>
    {
        private readonly CoreDbContext _dbContext;
        private readonly IPasswordHasherService _passwordHasher;

        public Handler(CoreDbContext dbContext, IPasswordHasherService passwordHasher)
        {
            _dbContext = dbContext;
            _passwordHasher = passwordHasher;
        }

        public async Task<ApiResult<UserDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var hashedPassword = _passwordHasher.HashPassword(request.Password);

            var user = new User
            {
                FullName = request.FullName,
                UserName = request.UserName,
                Email = request.Email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            // Bắt đầu một transaction để đảm bảo tính toàn vẹn dữ liệu
            await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                // Thêm người dùng
                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync(cancellationToken);

                // Thêm vai trò cho người dùng
                if (request.RoleCodes.Any())
                {
                    // Lấy RoleIds từ RoleCodes
                    var roleIds = await _dbContext.Roles
                        .Where(r => request.RoleCodes.Contains(r.Code))
                        .Select(r => r.Id)
                        .ToListAsync(cancellationToken);
                    
                    var userRoles = roleIds.Select(roleId => new UserRole { UserId = user.Id, RoleId = roleId });
                    _dbContext.UserRoles.AddRange(userRoles);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                }

                await transaction.CommitAsync(cancellationToken);
                
                // Lấy role codes của người dùng vừa tạo
                var roleCodes = new List<string>();
                if (request.RoleCodes.Any())
                {
                    roleCodes = await _dbContext.Roles
                        .Where(r => request.RoleCodes.Contains(r.Code))
                        .Select(r => r.Code)
                        .ToListAsync(cancellationToken);
                }
                
                // Trả về DTO của người dùng vừa tạo
                var userDto = new UserDto
                {
                    PublicId = user.PublicId,
                    FullName = user.FullName,
                    UserName = user.UserName,
                    Email = user.Email,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    RoleCodes = roleCodes
                };
                
                return new ApiResult<UserDto> { Success = true, Data = userDto };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync(cancellationToken);
                throw; // Ném lại lỗi để GlobalExceptionHandler xử lý
            }
        }
    }
}