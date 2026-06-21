using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Identity;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class CreateRole
{
    public class Command : IRequest<ApiResult<int>>
    {
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

            RuleFor(c => c.Name)
                .NotEmpty()
                .WithMessage("Tên vai trò không được để trống.")
                .MaximumLength(100)
                .WithMessage("Tên vai trò không được vượt quá 100 ký tự.")
                .MustAsync(async (name, cancellation) =>
                {
                    return !await _dbContext.Roles.AnyAsync(r => r.Name == name, cancellation);
                })
                .WithMessage("Tên vai trò đã tồn tại.");

            RuleFor(c => c.Code)
                .NotEmpty()
                .WithMessage("Mã vai trò không được để trống.")
                .MaximumLength(50)
                .WithMessage("Mã vai trò không được vượt quá 50 ký tự.")
                .MustAsync(async (code, cancellation) =>
                {
                    return !await _dbContext.Roles.AnyAsync(r => r.Code == code, cancellation);
                })
                .WithMessage("Mã vai trò đã tồn tại.");

            RuleFor(c => c.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự.");
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Command, ApiResult<int>>
    {
        public async Task<ApiResult<int>> Handle(Command request, CancellationToken cancellationToken)
        {
            var role = new Role
            {
                Name = request.Name,
                Code = request.Code,
                Description = request.Description
            };

            dbContext.Roles.Add(role);
            await dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult<int>
            {
                Success = true,
                Data = role.Id,
                Message = "Tạo vai trò thành công."
            };
        }
    }
}