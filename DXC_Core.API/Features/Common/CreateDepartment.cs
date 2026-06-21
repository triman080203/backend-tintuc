using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Common;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class CreateDepartment
{
    public class Command : IRequest<ApiResult<DepartmentDto>>
    {
        public required Guid OrganizationPublicId { get; set; }
        public required string Code { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(CoreDbContext dbContext)
        {
            RuleFor(x => x.OrganizationPublicId)
                .NotEmpty()
                .MustAsync(async (publicId, cancellation) =>
                {
                    var exists = await dbContext.Organizations
                        .AnyAsync(o => o.PublicId == publicId, cancellation);
                    return exists;
                })
                .WithMessage("Đơn vị không tồn tại");

            RuleFor(x => x.Code)
                .NotEmpty()
                .MaximumLength(50)
                .WithMessage("Mã phòng ban không được để trống và không vượt quá 50 ký tự")
                .MustAsync(async (command, code, cancellation) =>
                {
                    var organization = await dbContext.Organizations
                        .FirstOrDefaultAsync(o => o.PublicId == command.OrganizationPublicId, cancellation);
                    
                    if (organization == null) return false;
                    
                    var exists = await dbContext.Departments
                        .AnyAsync(d => d.OrganizationId == organization.Id && d.Code == code && d.IsActive, cancellation);
                    return !exists;
                })
                .WithMessage("Mã phòng ban đang hoạt động đã tồn tại trong đơn vị này");

            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(200)
                .WithMessage("Tên phòng ban không được để trống và không vượt quá 200 ký tự");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự");
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Command, ApiResult<DepartmentDto>>
    {
        public async Task<ApiResult<DepartmentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var organization = await dbContext.Organizations
                .FirstOrDefaultAsync(o => o.PublicId == request.OrganizationPublicId, cancellationToken);

            if (organization == null)
            {
                return new ApiResult<DepartmentDto> 
                { 
                    Success = false, 
                    Message = "Organization not found" 
                };
            }

            var department = new Department
            {
                OrganizationId = organization.Id,
                Code = request.Code,
                Name = request.Name,
                Description = request.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            dbContext.Departments.Add(department);
            await dbContext.SaveChangesAsync(cancellationToken);

            var result = new DepartmentDto
            {
                PublicId = department.PublicId,
                Code = department.Code,
                Name = department.Name,
                Description = department.Description,
                IsActive = department.IsActive,
                CreatedAt = department.CreatedAt,
                UpdatedAt = department.UpdatedAt,
                OrganizationPublicId = organization.PublicId,
                OrganizationName = organization.Name
            };

            return new ApiResult<DepartmentDto> { Success = true, Data = result };
        }
    }
}
