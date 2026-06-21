using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Users;

public static class GetRoles
{
    public class Query : IRequest<PagedResult<RoleDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Query, PagedResult<RoleDto>>
    {
        public async Task<PagedResult<RoleDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = dbContext.Roles.AsQueryable();

            // Lọc theo tên vai trò
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(r => r.Name.Contains(request.Name));
            }

            // Lọc theo mã vai trò
            if (!string.IsNullOrWhiteSpace(request.Code))
            {
                query = query.Where(r => r.Code.Contains(request.Code));
            }

            // Lọc theo mô tả
            if (!string.IsNullOrWhiteSpace(request.Description))
            {
                query = query.Where(r => r.Description != null && r.Description.Contains(request.Description));
            }

            // Đếm tổng số bản ghi
            var total = await query.CountAsync(cancellationToken);

            // Phân trang và lấy dữ liệu
            var roles = await query
                .OrderBy(r => r.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(r => new RoleDto
                {
                    PublicId = r.PublicId,
                    Name = r.Name,
                    Code = r.Code,
                    Description = r.Description
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<RoleDto>
            {
                Success = true,
                Data = roles,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}