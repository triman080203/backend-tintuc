using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIcons
{
    public class Query : IRequest<PagedResult<IconDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? IconType { get; set; }
        public Guid? IconCategoryPublicId { get; set; }
        public Guid? IconGroupPublicId { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<IconDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<IconDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                var query = _dbContext.Icons.AsQueryable();

                // Apply filters
                if (!string.IsNullOrWhiteSpace(request.Name))
                {
                    query = query.Where(i => i.Name.Contains(request.Name));
                }

                if (!string.IsNullOrWhiteSpace(request.IconType))
                {
                    query = query.Where(i => i.IconType == request.IconType);
                }

                if (request.IconCategoryPublicId.HasValue)
                {
                    query = query.Where(i => i.IconCategory != null && i.IconCategory.PublicId == request.IconCategoryPublicId.Value);
                }

                if (request.IconGroupPublicId.HasValue)
                {
                    query = query.Where(i => i.IconGroup != null && i.IconGroup.PublicId == request.IconGroupPublicId.Value);
                }

                if (request.IsActive.HasValue)
                {
                    query = query.Where(i => i.IsActive == request.IsActive.Value);
                }

                // Get total count
                var total = await query.CountAsync(cancellationToken);

                // Apply pagination and ordering
                var items = await query
                    .OrderBy(i => i.IconCategory != null ? i.IconCategory.Name : "")
                    .ThenBy(i => i.IconGroup != null ? i.IconGroup.Name : "")
                    .ThenBy(i => i.DisplayOrder)
                    .ThenBy(i => i.Name)
                    .Skip((request.Current - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(i => new IconDto
                    {
                        PublicId = i.PublicId,
                        IconCategoryPublicId = i.IconCategory != null ? i.IconCategory.PublicId : null,
                        IconGroupPublicId = i.IconGroup != null ? i.IconGroup.PublicId : null,
                        Name = i.Name,
                        Description = i.Description,
                        IconImageUrl = i.ImagePublicId.HasValue ? $"/api/files/{i.ImagePublicId}" : i.IconImageUrl,
                        ImagePublicId = i.ImagePublicId,
                        IconType = i.IconType,
                        ScreenParams = i.ScreenParams,
                        WebLink = i.WebLink,
                        LinkAndroid = i.LinkAndroid,
                        LinkIOS = i.LinkIOS,
                        DisplayOrder = i.DisplayOrder,
                        IsActive = i.IsActive,
                        CreatedAt = i.CreatedAt,
                        UpdatedAt = i.UpdatedAt,
                        IconCategoryName = i.IconCategory != null ? i.IconCategory.Name : null,
                        IconGroupName = i.IconGroup != null ? i.IconGroup.Name : null
                    })
                    .ToListAsync(cancellationToken);

                return new PagedResult<IconDto>
                {
                    Success = true,
                    Data = items,
                    Total = total,
                    Current = request.Current,
                    PageSize = request.PageSize,
                    Message = "Lấy danh sách icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new PagedResult<IconDto>
                {
                    Success = false,
                    Data = new List<IconDto>(),
                    Total = 0,
                    Current = request.Current,
                    PageSize = request.PageSize,
                    Message = $"Lỗi lấy danh sách icon: {ex.Message}"
                };
            }
        }
    }
}
