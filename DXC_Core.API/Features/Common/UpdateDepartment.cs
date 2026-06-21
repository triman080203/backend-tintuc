using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Common;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class UpdateDepartment
{
    public class Command : IRequest<ApiResult<DepartmentDto>>
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
                .WithMessage("Mã phòng ban không được để trống và không quá 50 ký tự.");

            RuleFor(c => c.Name)
                .NotEmpty()
                .MaximumLength(255)
                .WithMessage("Tên phòng ban không được để trống và không quá 255 ký tự.");

            RuleFor(c => c.Description)
                .MaximumLength(1000)
                .WithMessage("Mô tả không quá 1000 ký tự.");

            RuleFor(c => c.PublicId)
                .MustAsync(DepartmentMustExist)
                .WithMessage("Không tìm thấy phòng ban.");

            RuleFor(c => c.Code)
                .MustAsync(CodeMustBeUnique)
                .WithMessage("Mã phòng ban đã được sử dụng.");
        }

        private async Task<bool> DepartmentMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Departments
                .AnyAsync(d => d.PublicId == publicId, cancellationToken);
        }

        private async Task<bool> CodeMustBeUnique(Command command, string code, CancellationToken cancellationToken)
        {
            return !await _dbContext.Departments
                .AnyAsync(d => d.Code == code && d.PublicId != command.PublicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<DepartmentDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<DepartmentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments
                .Include(d => d.Organization)
                .FirstOrDefaultAsync(d => d.PublicId == request.PublicId, cancellationToken);

            if (department == null)
            {
                return new ApiResult<DepartmentDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phòng ban"
                };
            }

            if (!department.Organization.IsActive)
            {
                return new ApiResult<DepartmentDto>
                {
                    Success = false,
                    Message = "Không thể cập nhật phòng ban vì tổ chức đã bị xóa"
                };
            }

            department.Code = request.Code;
            department.Name = request.Name;
            department.Description = request.Description;
            department.IsActive = request.IsActive;
            department.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);

            var result = new DepartmentDto
            {
                PublicId = department.PublicId,
                Code = department.Code,
                Name = department.Name,
                Description = department.Description,
                IsActive = department.IsActive,
                CreatedAt = department.CreatedAt,
                UpdatedAt = department.UpdatedAt,
                OrganizationPublicId = department.Organization.PublicId,
                OrganizationName = department.Organization.Name
            };

            return new ApiResult<DepartmentDto>
            {
                Success = true,
                Data = result
            };
        }
    }
}
