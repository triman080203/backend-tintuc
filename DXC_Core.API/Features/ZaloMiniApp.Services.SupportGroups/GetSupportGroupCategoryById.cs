using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public static class GetSupportGroupCategoryById
{
    public class Query : IRequest<ApiResult<SupportGroupCategoryDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<SupportGroupCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<SupportGroupCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var category = await _zaloContext.SupportGroupCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.PublicId && c.IsActive, cancellationToken);

            if (category == null)
            {
                return new ApiResult<SupportGroupCategoryDto>
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục nhóm hỗ trợ"
                };
            }

            var categoryDto = new SupportGroupCategoryDto
            {
                PublicId = category.PublicId,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };

            return new ApiResult<SupportGroupCategoryDto>
            {
                Success = true,
                Data = categoryDto,
                Message = "Lấy thông tin danh mục nhóm hỗ trợ thành công"
            };
        }
    }
}