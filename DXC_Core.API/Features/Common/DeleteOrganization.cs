using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class DeleteOrganization
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
                .MustAsync(OrganizationMustExist)
                .WithMessage("Không tìm thấy tổ chức.");
        }

        private async Task<bool> OrganizationMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Organizations
                .AnyAsync(org => org.PublicId == publicId, cancellationToken);
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
            var organization = await _dbContext.Organizations
                .FirstOrDefaultAsync(org => org.PublicId == request.PublicId && org.IsActive, cancellationToken);

            if (organization == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy tổ chức hoặc tổ chức đã bị xóa"
                };
            }

            // Xóa mềm tổ chức
            organization.IsActive = false;
            organization.UpdatedAt = DateTime.UtcNow;

            // Đồng thời xóa mềm tất cả các phòng ban thuộc tổ chức
            var departments = await _dbContext.Departments
                .Where(d => d.OrganizationId == organization.Id && d.IsActive)
                .ToListAsync(cancellationToken);

            foreach (var department in departments)
            {
                department.IsActive = false;
                department.UpdatedAt = DateTime.UtcNow;
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa tổ chức và các phòng ban liên quan thành công"
            };
        }
    }
}
