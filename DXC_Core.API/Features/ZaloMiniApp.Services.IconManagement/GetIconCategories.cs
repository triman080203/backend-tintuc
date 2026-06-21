using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIconCategories
{
    public class Query : IRequest<PagedResult<IconCategoryDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<IconCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<IconCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _dbContext.IconCategories.AsQueryable();

                // Apply filters
                if (!string.IsNullOrWhiteSpace(request.Name))
                {
                    query = query.Where(c => c.Name.Contains(request.Name));
                }

                if (request.IsActive.HasValue)
                {
                    var active = request.IsActive.Value;
                    query = query.Where(c => c.IsActive == active);
                }

                // Get total count
                var total = await query.CountAsync(cancellationToken);

                // Apply pagination and ordering
                var items = await query
                    .OrderBy(c => c.DisplayOrder)
                    .ThenBy(c => c.Name)
                    .Skip((request.Current - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(c => new IconCategoryDto
                    {
                        PublicId = c.PublicId,
                        Name = c.Name,
                        Description = c.Description,
                        DisplayOrder = c.DisplayOrder,
                        IsActive = c.IsActive,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        TotalIconGroups = c.IconGroups.Count(g => g.IsActive),
                        TotalIcons = c.Icons.Count(i => i.IsActive)
                    })
                    .ToListAsync(cancellationToken);

                return new PagedResult<IconCategoryDto>
                {
                    Success = true,
                    Data = items,
                    Total = total,
                    Current = request.Current,
                    PageSize = request.PageSize,
                    Message = "Lấy danh sách danh mục icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new PagedResult<IconCategoryDto>
                {
                    Success = false,
                    Data = new List<IconCategoryDto>(),
                    Total = 0,
                    Current = request.Current,
                    PageSize = request.PageSize,
                    Message = $"Lỗi lấy danh sách danh mục icon: {ex.Message}"
                };
            }
        }
    }
}
