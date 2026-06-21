using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class DeleteUser
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
                .WithMessage("PublicId không hợp lệ.")
                .MustAsync(UserMustExist)
                .WithMessage("Không tìm thấy người dùng.");
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

            // Thực hiện xóa mềm (soft-delete)
            user.IsActive = false;
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult<bool> { Success = true, Data = true };
        }
    }
}