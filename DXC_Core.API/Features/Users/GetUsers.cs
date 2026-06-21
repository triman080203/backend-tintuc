// Path: DXC_Core.API/Features/Identity/GetUsers.cs
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DXC_Core.API.Features.Users;

public static class GetUsers
{
    // Kiểu dữ liệu trả về là một danh sách phẳng, tương thích ProTable
    public class Query : IRequest<PagedResult<UserWithRolesDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<UserWithRolesDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<UserWithRolesDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var queryable = _dbContext.Users.AsNoTracking();

            // Áp dụng bộ lọc
            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                queryable = queryable.Where(u => u.FullName.Contains(request.FullName));
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                queryable = queryable.Where(u => u.Email.Contains(request.Email));
            }
            
            if (request.IsActive.HasValue)
            {
                queryable = queryable.Where(u => u.IsActive == request.IsActive.Value);
            }
            
            // Lấy tổng số lượng bản ghi trước khi phân trang
            var total = await queryable.CountAsync(cancellationToken);

            // Áp dụng phân trang
            var users = await queryable
                .OrderByDescending(u => u.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var userIds = users.Select(u => u.Id).ToList();

            // --- THAY ĐỔI: Lấy Role.Name và coi nó là "Role Code" ---
            var userRoles = await _dbContext.UserRoles
                .Where(ur => userIds.Contains(ur.UserId))
                .Select(ur => new { ur.UserId, RoleCode = ur.Role.Code }) // Lấy Name làm Code
                .ToListAsync(cancellationToken);

            var userRolesLookup = userRoles.ToLookup(ur => ur.UserId, ur => ur.RoleCode);

            // Map kết quả sang DTO
            var userDtos = users.Select(user => new UserWithRolesDto
            {
                PublicId = user.PublicId,
                FullName = user.FullName,
                UserName = user.UserName,
                Email = user.Email,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                // Gán danh sách role code vào thuộc tính mới
                RoleCodes = userRolesLookup[user.Id].ToList() 
            }).ToList();
            
            // Trả về theo cấu trúc PagedResult đã thống nhất
            return new PagedResult<UserWithRolesDto>
            {
                Success = true,
                Data = userDtos,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
