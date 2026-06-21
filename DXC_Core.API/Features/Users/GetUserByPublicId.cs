using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace DXC_Core.API.Features.Users;

public static class GetUserByPublicId
{
    public class Query : IRequest<ApiResult<UserDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(q => q.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không được để trống.");
        }
    }

    public class Handler : IRequestHandler<Query, ApiResult<UserDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<UserDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .AsNoTracking()
                .Where(u => u.PublicId == request.PublicId)
                .Select(u => new UserDto
                {
                    PublicId = u.PublicId,
                    FullName = u.FullName,
                    UserName = u.UserName,
                    Email = u.Email,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                return new ApiResult<UserDto> { Success = false, Message = "Không tìm thấy người dùng." };
            }

            // Lấy danh sách mã vai trò
            var userId = await _dbContext.Users
                .Where(u => u.PublicId == request.PublicId)
                .Select(u => u.Id)
                .FirstOrDefaultAsync(cancellationToken);

            user.RoleCodes = await _dbContext.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role.Code)
                .ToListAsync(cancellationToken);

            return new ApiResult<UserDto> { Success = true, Data = user };
        }
    }
}
