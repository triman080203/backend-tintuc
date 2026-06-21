using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public static class GetSupportGroupCategories
{
    public class Query : IRequest<PagedResult<SupportGroupCategoryDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<SupportGroupCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<PagedResult<SupportGroupCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _zaloContext.SupportGroupCategories
                .Where(c => c.IsActive);

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(c => c.Name.Contains(request.Name));
            }

            var total = await query.CountAsync(cancellationToken);

            var categories = await query
                .OrderBy(c => c.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new SupportGroupCategoryDto
                {
                    PublicId = c.PublicId,
                    Name = c.Name,
                    Description = c.Description,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<SupportGroupCategoryDto>
            {
                Success = true,
                Data = categories,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách danh mục nhóm hỗ trợ thành công"
            };
        }
    }
}