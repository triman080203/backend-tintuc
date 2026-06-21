using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIconCategoryById
{
    public class Query : IRequest<ApiResult<IconCategoryDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<IconCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<IconCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                var iconCategory = await _dbContext.IconCategories
                    .Where(c => c.PublicId == request.PublicId)
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
                    .FirstOrDefaultAsync(cancellationToken);

                if (iconCategory == null)
                {
                    return new ApiResult<IconCategoryDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy danh mục icon"
                    };
                }

                return new ApiResult<IconCategoryDto>
                {
                    Success = true,
                    Data = iconCategory,
                    Message = "Lấy thông tin danh mục icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<IconCategoryDto>
                {
                    Success = false,
                    Message = $"Lỗi lấy thông tin danh mục icon: {ex.Message}"
                };
            }
        }
    }
}