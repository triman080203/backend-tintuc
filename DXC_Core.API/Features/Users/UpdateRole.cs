using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class UpdateRole
{
    public class Command : IRequest<ApiResult<bool>>
    {
        public Guid PublicId { get; set; }
        public required string Name { get; set; }
        public required string Code { get; set; }
        public string? Description { get; set; }
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
                .WithMessage("Vai trò không tồn tại.");

            RuleFor(c => c.Name)
                .NotEmpty()
                .WithMessage("Tên vai trò không được để trống.")
                .MaximumLength(100)
                .WithMessage("Tên vai trò không được vượt quá 100 ký tự.")
                .MustAsync(async (command, name, cancellation) =>
                {
                    return !await _dbContext.Roles.AnyAsync(r => r.Name == name && r.PublicId != command.PublicId, cancellation);
                })
                .WithMessage("Tên vai trò đã tồn tại.");

            RuleFor(c => c.Code)
                .NotEmpty()
                .WithMessage("Mã vai trò không được để trống.")
                .MaximumLength(50)
                .WithMessage("Mã vai trò không được vượt quá 50 ký tự.")
                .MustAsync(async (command, code, cancellation) =>
                {
                    return !await _dbContext.Roles.AnyAsync(r => r.Code == code && r.PublicId != command.PublicId, cancellation);
                })
                .WithMessage("Mã vai trò đã tồn tại.");

            RuleFor(c => c.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự.");
        }

        private async Task<bool> RoleMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Roles.AnyAsync(r => r.PublicId == publicId, cancellationToken);
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Command, ApiResult<bool>>
    {
        public async Task<ApiResult<bool>> Handle(Command request, CancellationToken cancellationToken)
        {
            var role = await dbContext.Roles.FirstAsync(r => r.PublicId == request.PublicId, cancellationToken);

            role.Name = request.Name;
            role.Code = request.Code;
            role.Description = request.Description;

            await dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult<bool>
            {
                Success = true,
                Data = true,
                Message = "Cập nhật vai trò thành công."
            };
        }
    }
}