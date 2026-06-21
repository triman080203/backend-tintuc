using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIconGroupById
{
    public class Query : IRequest<ApiResult<IconGroupDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<IconGroupDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<IconGroupDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            try
            {
                var iconGroup = await _dbContext.IconGroups
                    .Where(g => g.PublicId == request.PublicId)
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
                    .FirstOrDefaultAsync(cancellationToken);

                if (iconGroup == null)
                {
                    return new ApiResult<IconGroupDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy nhóm icon"
                    };
                }

                return new ApiResult<IconGroupDto>
                {
                    Success = true,
                    Data = iconGroup,
                    Message = "Lấy thông tin nhóm icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<IconGroupDto>
                {
                    Success = false,
                    Message = $"Lỗi lấy thông tin nhóm icon: {ex.Message}"
                };
            }
        }
    }
}
