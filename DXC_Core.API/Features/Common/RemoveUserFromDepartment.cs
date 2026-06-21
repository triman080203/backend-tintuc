using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class RemoveUserFromDepartment
{
    public class Command : IRequest<ApiResult>
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
                .MustAsync(UserMustBeAssigned)
                .WithMessage("Người dùng không được gán cho phòng ban này.");
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

        private async Task<bool> UserMustBeAssigned(Command command, CancellationToken cancellationToken)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.PublicId == command.UserPublicId, cancellationToken);

            var department = await _dbContext.Departments
                .FirstOrDefaultAsync(d => d.PublicId == command.DepartmentPublicId, cancellationToken);

            if (user == null || department == null)
                return false;

            return await _dbContext.UserDepartments
                .AnyAsync(ud => ud.UserId == user.Id && ud.DepartmentId == department.Id, cancellationToken);
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
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.PublicId == request.UserPublicId, cancellationToken);

            var department = await _dbContext.Departments
                .FirstOrDefaultAsync(d => d.PublicId == request.DepartmentPublicId, cancellationToken);

            if (user == null || department == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Người dùng hoặc phòng ban không tồn tại"
                };
            }

            var userDepartment = await _dbContext.UserDepartments
                .FirstOrDefaultAsync(ud => ud.UserId == user.Id && ud.DepartmentId == department.Id, cancellationToken);

            if (userDepartment == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Người dùng không được gán cho phòng ban này"
                };
            }

            _dbContext.UserDepartments.Remove(userDepartment);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa người dùng khỏi phòng ban thành công"
            };
        }
    }
}
