using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Common;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class AssignUserToDepartment
{
    public class Command : IRequest<ApiResult<UserDepartmentDto>>
    {
        public required Guid UserPublicId { get; set; }
        public required Guid DepartmentPublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(c => c.UserPublicId)
                .NotEmpty()
                .WithMessage("UserPublicId không hợp lệ.");

            RuleFor(c => c.DepartmentPublicId)
                .NotEmpty()
                .WithMessage("DepartmentPublicId không hợp lệ.");

            RuleFor(c => c.UserPublicId)
                .MustAsync(UserMustExist)
                .WithMessage("Không tìm thấy người dùng.");

            RuleFor(c => c.DepartmentPublicId)
                .MustAsync(DepartmentMustExist)
                .WithMessage("Không tìm thấy phòng ban.");

            RuleFor(c => c)
                .MustAsync(UserNotAlreadyAssigned)
                .WithMessage("Người dùng đã được gán cho phòng ban này.");
        }

        private async Task<bool> UserMustExist(Guid userPublicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Users
                .AnyAsync(u => u.PublicId == userPublicId, cancellationToken);
        }

        private async Task<bool> DepartmentMustExist(Guid departmentPublicId, CancellationToken cancellationToken)
        {
            return await _dbContext.Departments
                .AnyAsync(d => d.PublicId == departmentPublicId, cancellationToken);
        }

        private async Task<bool> UserNotAlreadyAssigned(Command command, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.PublicId == command.UserPublicId, cancellationToken);

            var department = await _dbContext.Departments
                .FirstOrDefaultAsync(d => d.PublicId == command.DepartmentPublicId, cancellationToken);

            if (user == null || department == null)
                return true;

            return !await _dbContext.UserDepartments
                .AnyAsync(ud => ud.UserId == user.Id && ud.DepartmentId == department.Id, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<UserDepartmentDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<UserDepartmentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.PublicId == request.UserPublicId, cancellationToken);

            var department = await _dbContext.Departments
                .Include(d => d.Organization)
                .FirstOrDefaultAsync(d => d.PublicId == request.DepartmentPublicId, cancellationToken);

            if (user == null || department == null)
            {
                return new ApiResult<UserDepartmentDto>
                {
                    Success = false,
                    Message = "Người dùng hoặc phòng ban không tồn tại"
                };
            }

            // Check if department's organization is still active
            if (!department.Organization.IsActive)
            {
                return new ApiResult<UserDepartmentDto>
                {
                    Success = false,
                    Message = "Không thể gán vào phòng ban vì tổ chức đã bị xóa"
                };
            }

            // Check if department is still active
            if (!department.IsActive)
            {
                return new ApiResult<UserDepartmentDto>
                {
                    Success = false,
                    Message = "Không thể gán vào phòng ban vì phòng ban đã bị xóa"
                };
            }

            var userDepartment = new UserDepartment
            {
                UserId = user.Id,
                DepartmentId = department.Id
            };

            _dbContext.UserDepartments.Add(userDepartment);
            await _dbContext.SaveChangesAsync(cancellationToken);

            var result = new UserDepartmentDto
            {
                UserPublicId = user.PublicId,
                UserName = user.UserName,
                UserFullName = user.FullName,
                DepartmentPublicId = department.PublicId,
                DepartmentCode = department.Code,
                DepartmentName = department.Name,
                OrganizationPublicId = department.Organization.PublicId,
                OrganizationName = department.Organization.Name
            };

            return new ApiResult<UserDepartmentDto>
            {
                Success = true,
                Data = result,
                Message = "Gán người dùng vào phòng ban thành công"
            };
        }
    }
}
