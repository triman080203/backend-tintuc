using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Common;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class CreateOrganization
{
    public class Command : IRequest<ApiResult<OrganizationDto>>
    {
        public required string Code { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(CoreDbContext dbContext)
        {
            RuleFor(x => x.Code)
                .NotEmpty()
                .MaximumLength(50)
                .WithMessage("Mã đơn vị không được để trống và không vượt quá 50 ký tự")
                .MustAsync(async (code, cancellation) =>
                {
                    var exists = await dbContext.Organizations
                        .AnyAsync(o => o.Code == code, cancellation);
                    return !exists;
                })
                .WithMessage("Mã đơn vị đã tồn tại");

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(200)
                .WithMessage("Tên đơn vị không được để trống và không vượt quá 200 ký tự");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự");
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Command, ApiResult<OrganizationDto>>
    {
        public async Task<ApiResult<OrganizationDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var organization = new Organization
            {
                Code = request.Code,
                Name = request.Name,
                Description = request.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            dbContext.Organizations.Add(organization);
            await dbContext.SaveChangesAsync(cancellationToken);

            var result = new OrganizationDto
            {
                PublicId = organization.PublicId,
                Code = organization.Code,
                Name = organization.Name,
                Description = organization.Description,
                IsActive = organization.IsActive,
                CreatedAt = organization.CreatedAt,
                UpdatedAt = organization.UpdatedAt,
                DepartmentCount = 0
            };

            return new ApiResult<OrganizationDto> { Success = true, Data = result };
        }
    }
}
