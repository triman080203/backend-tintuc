using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Common;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class UpdateOrganization
{
    public class Command : IRequest<ApiResult<OrganizationWithDepartmentsDto>>
    {
        public required Guid PublicId { get; set; }
        public required string Code { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(c => c.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không hợp lệ.");

            RuleFor(c => c.Code)
                .NotEmpty()
                .MaximumLength(50)
                .WithMessage("Mã tổ chức không được để trống và không quá 50 ký tự.");

            RuleFor(c => c.Name)
                .NotEmpty()
                .MaximumLength(255)
                .WithMessage("Tên tổ chức không được để trống và không quá 255 ký tự.");

            RuleFor(c => c.Description)
                .MaximumLength(1000)
                .WithMessage("Mô tả không quá 1000 ký tự.");

            RuleFor(c => c.PublicId)
                .MustAsync(OrganizationMustExist)
                .WithMessage("Không tìm thấy tổ chức.");

            RuleFor(c => c.Code)
                .MustAsync(CodeMustBeUnique)
                .WithMessage("Mã tổ chức đã được sử dụng.");
        }

        private async Task<bool> OrganizationMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Organizations
                .AnyAsync(o => o.PublicId == publicId, cancellationToken);
        }

        private async Task<bool> CodeMustBeUnique(Command command, string code, CancellationToken cancellationToken)
        {
            return !await _dbContext.Organizations
                .AnyAsync(o => o.Code == code && o.PublicId != command.PublicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<OrganizationWithDepartmentsDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<OrganizationWithDepartmentsDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var organization = await _dbContext.Organizations
                .Include(o => o.Departments)
                .FirstOrDefaultAsync(o => o.PublicId == request.PublicId, cancellationToken);

            if (organization == null)
            {
                return new ApiResult<OrganizationWithDepartmentsDto>
                {
                    Success = false,
                    Message = "Không tìm thấy tổ chức"
                };
            }

            // Update organization properties
            organization.Code = request.Code;
            organization.Name = request.Name;
            organization.Description = request.Description;
            organization.IsActive = request.IsActive;
            organization.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);

            // Return updated organization with departments
            var result = new OrganizationWithDepartmentsDto
            {
                PublicId = organization.PublicId,
                Code = organization.Code,
                Name = organization.Name,
                Description = organization.Description,
                IsActive = organization.IsActive,
                CreatedAt = organization.CreatedAt,
                UpdatedAt = organization.UpdatedAt,
                DepartmentCount = organization.Departments.Count(d => d.IsActive),
                Departments = organization.Departments
                    .Where(d => d.IsActive)
                    .OrderBy(d => d.Name)
                    .Select(d => new DepartmentDto
                    {
                        PublicId = d.PublicId,
                        Code = d.Code,
                        Name = d.Name,
                        Description = d.Description,
                        IsActive = d.IsActive,
                        CreatedAt = d.CreatedAt,
                        UpdatedAt = d.UpdatedAt,
                        OrganizationPublicId = organization.PublicId,
                        OrganizationName = organization.Name
                    })
                    .ToList()
            };

            return new ApiResult<OrganizationWithDepartmentsDto>
            {
                Success = true,
                Data = result
            };
        }
    }
}
