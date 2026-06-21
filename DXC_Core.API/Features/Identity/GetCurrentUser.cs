using System.Security.Claims;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using DXC_Core.API.Features.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Identity;

public static class GetCurrentUser // <-- Đã đổi tên
{
    public class Query : IRequest<ApiResult<UserDto>> { }

    public class Handler : IRequestHandler<Query, ApiResult<UserDto>>
    {
        private readonly CoreDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public Handler(CoreDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ApiResult<UserDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var userIdString = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return new ApiResult<UserDto> { Success = false, Message = "Token không hợp lệ hoặc không tìm thấy User ID." };
            }

            var user = await _dbContext.Users
                .AsNoTracking()
                .Where(u => u.Id == userId)
                .Select(u => new UserDto
                {
                    PublicId = u.PublicId,
                    FullName = u.FullName,
                    UserName = u.UserName,
                    Email = u.Email,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);
            
            if (user == null)
            {
                return new ApiResult<UserDto> { Success = false, Message = "Không tìm thấy người dùng." };
            }

            // Lấy danh sách mã vai trò
            user.RoleCodes = await _dbContext.UserRoles
                .Where(ur => ur.UserId == userId)
                .Select(ur => ur.Role.Code)
                .ToListAsync(cancellationToken);

            // Lấy thông tin phòng ban và tổ chức (nếu user được gán)
            var departmentInfo = await _dbContext.UserDepartments
                .AsNoTracking()
                .Where(ud => ud.UserId == userId)
                .Include(ud => ud.Department)
                .ThenInclude(d => d.Organization)
                .Select(ud => new
                {
                    DepartmentPublicId = ud.Department.PublicId,
                    DepartmentName = ud.Department.Name,
                    OrganizationPublicId = ud.Department.Organization.PublicId,
                    OrganizationName = ud.Department.Organization.Name
                })
                .FirstOrDefaultAsync(cancellationToken);

            // Gán thông tin phòng ban và tổ chức vào user
            if (departmentInfo != null)
            {
                user.DepartmentPublicId = departmentInfo.DepartmentPublicId;
                user.DepartmentName = departmentInfo.DepartmentName;
                user.OrganizationPublicId = departmentInfo.OrganizationPublicId;
                user.OrganizationName = departmentInfo.OrganizationName;
            }

            return new ApiResult<UserDto> { Success = true, Data = user };
        }
    }
}