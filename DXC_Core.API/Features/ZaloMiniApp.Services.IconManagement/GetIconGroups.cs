using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIconGroups
{
    public class Query : IRequest<PagedResult<IconGroupDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public Guid? IconCategoryPublicId { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<IconGroupDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<IconGroupDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _dbContext.IconGroups.AsQueryable();

                // Apply filters
                if (!string.IsNullOrWhiteSpace(request.Name))
                {
                    query = query.Where(g => g.Name.Contains(request.Name));
                }

                if (request.IconCategoryPublicId.HasValue)
                {
                    query = query.Where(g => g.IconCategory.PublicId == request.IconCategoryPublicId.Value);
                }

                if (request.IsActive.HasValue)
                {
                    var active = request.IsActive.Value;
                    query = query.Where(g => g.IsActive == active);
                }

                // Get total count
                var total = await query.CountAsync(cancellationToken);

                // Apply pagination and ordering
                    var items = await query
                        .OrderBy(g => g.IconCategory.Name)
                        .ThenBy(g => g.DisplayOrder)
                        .ThenBy(g => g.Name)
                        .Skip((request.Current - 1) * request.PageSize)
                        .Take(request.PageSize)
                        .Select(g => new IconGroupDto
                        {
                            PublicId = g.PublicId,
                            IconCategoryPublicId = g.IconCategory.PublicId,
                            Name = g.Name,
                            Description = g.Description,
                            DisplayOrder = g.DisplayOrder,
                            IsActive = g.IsActive,
                            CreatedAt = g.CreatedAt,
                            UpdatedAt = g.UpdatedAt,
                            ImageUrl = g.ImageUrl,
                            ImagePublicId = g.ImagePublicId,
                            IconCategoryName = g.IconCategory.Name,
                            TotalIcons = g.Icons.Count(i => i.IsActive)
                        })
                        .ToListAsync(cancellationToken);

                return new PagedResult<IconGroupDto>
                {
                    Success = true,
                    Data = items,
                    Total = total,
                    Current = request.Current,
                    PageSize = request.PageSize,
                    Message = "Lấy danh sách nhóm icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new PagedResult<IconGroupDto>
                {
                    Success = false,
                    Data = new List<IconGroupDto>(),
                    Total = 0,
                    Current = request.Current,
                    PageSize = request.PageSize,
                    Message = $"Lỗi lấy danh sách nhóm icon: {ex.Message}"
                };
            }
        }
    }
}
