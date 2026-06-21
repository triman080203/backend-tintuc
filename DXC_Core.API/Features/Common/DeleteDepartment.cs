using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class DeleteDepartment
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
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

            RuleFor(c => c.PublicId)
                .MustAsync(DepartmentMustExist)
                .WithMessage("Không tìm thấy phòng ban.");
        }

        private async Task<bool> DepartmentMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Departments
                .AnyAsync(d => d.PublicId == publicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments
                .Include(d => d.Organization)
                .FirstOrDefaultAsync(d => d.PublicId == request.PublicId && d.IsActive, cancellationToken);

            if (department == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy phòng ban hoặc phòng ban đã bị xóa"
                };
            }

            // Kiểm tra xem tổ chức còn active không
            if (!department.Organization.IsActive)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không thể xóa phòng ban vì tổ chức đã bị xóa"
                };
            }

            // Xóa mềm phòng ban
            department.IsActive = false;
            department.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa phòng ban thành công"
            };
        }
    }
}
