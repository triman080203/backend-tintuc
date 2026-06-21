using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class GetRoleById
{
    public class Query : IRequest<ApiResult<RoleDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(q => q.PublicId)
                .NotEmpty()
                .WithMessage("PublicID vai trò không được rỗng.")
                .MustAsync(RoleMustExist)
                .WithMessage("Vai trò không tồn tại.");
        }

        private async Task<bool> RoleMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Roles.AnyAsync(r => r.PublicId == publicId, cancellationToken);
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Query, ApiResult<RoleDto>>
    {
        public async Task<ApiResult<RoleDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var role = await dbContext.Roles
                .AsNoTracking()
                .Where(r => r.PublicId == request.PublicId)
                .Select(r => new RoleDto
                {
                    PublicId = r.PublicId,
                    Name = r.Name,
                    Code = r.Code,
                    Description = r.Description
                })
                .FirstAsync(cancellationToken);

            return new ApiResult<RoleDto>
            {
                Success = true,
                Data = role
            };
        }
    }
}