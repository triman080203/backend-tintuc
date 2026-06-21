// File: DXC_Core.API/Features/Identity/Register.cs

using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Identity;
using DXC_Core.API.Data.CoreContext.Models.Profile;
using DXC_Core.API.Shared.Services;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.Identity;

public static class Register
{
    public class RegisterResult 
    { 
        public Guid PublicId { get; set; }
    }
    
    public class Command : IRequest<ApiResult<RegisterResult>>
    {
        public required string FullName { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _coreDbContext;

        // B1: Inject DbContext vào Validator
        public Validator(CoreDbContext coreDbContext)
        {
            _coreDbContext = coreDbContext;

            RuleFor(c => c.FullName).NotEmpty();
            RuleFor(c => c.UserName).NotEmpty().MinimumLength(4);
            RuleFor(c => c.Email).NotEmpty().EmailAddress();
            RuleFor(c => c.Password).NotEmpty().MinimumLength(8);

            // B2: Thêm các rule kiểm tra DB
            RuleFor(c => c.UserName);
                // .MustAsync(BeUniqueUserName)
                // .WithMessage("Tên đăng nhập đã tồn tại.");

            RuleFor(c => c.Email);
                // .MustAsync(BeUniqueEmail)
                // .WithMessage("Email đã tồn tại.");
        }

        // B3: Tạo các phương thức kiểm tra bất đồng bộ
        private async Task<bool> BeUniqueUserName(string userName, CancellationToken cancellationToken)
        {
            return !await _coreDbContext.Users.AnyAsync(u => u.UserName == userName, cancellationToken);
        }

        private async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
        {
            return !await _coreDbContext.Users.AnyAsync(u => u.Email == email, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<RegisterResult>>
    {
        private readonly CoreDbContext _coreDbContext;
        private readonly IPasswordHasherService _passwordHasher;

        public Handler(CoreDbContext coreDbContext, IPasswordHasherService passwordHasher)
        {
            _coreDbContext = coreDbContext;
            _passwordHasher = passwordHasher;
        }

        public async Task<ApiResult<RegisterResult>> Handle(Command request, CancellationToken cancellationToken)
        {
            // B4: Logic trong Handler bây giờ đã sạch sẽ hơn rất nhiều
            // Nó có thể giả định rằng dữ liệu đầu vào đã hoàn toàn hợp lệ.
            var hashedPassword = _passwordHasher.HashPassword(request.Password);

            var user = new User
            {
                PublicId = Guid.NewGuid(),
                FullName = request.FullName,
                UserName = request.UserName,
                Email = request.Email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow,
                IsActive = false
            };

            // Bắt đầu transaction để đảm bảo cả user và profile được tạo thành công
            using var transaction = await _coreDbContext.Database.BeginTransactionAsync(cancellationToken);
            
            try
            {
                _coreDbContext.Users.Add(user);
                await _coreDbContext.SaveChangesAsync(cancellationToken);

                // T UserProfile rỗng cho user mới
                var userProfile = new UserProfile
                {
                    UserId = user.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _coreDbContext.UserProfiles.Add(userProfile);
                await _coreDbContext.SaveChangesAsync(cancellationToken);

                // Commit transaction
                await transaction.CommitAsync(cancellationToken);

                return new ApiResult<RegisterResult>
                {
                    Success = true,
                    Data = new RegisterResult 
                    { 
                        PublicId = user.PublicId
                    }
                };
            }
            catch
            {
                // Rollback transaction nếu có lỗi
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }
    }
}