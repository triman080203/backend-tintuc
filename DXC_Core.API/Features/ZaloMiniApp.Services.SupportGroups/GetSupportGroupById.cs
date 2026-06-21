using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public static class GetSupportGroupById
{
    public class Query : IRequest<ApiResult<SupportGroupDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<SupportGroupDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<SupportGroupDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var supportGroup = await (
                from sg in _zaloContext.SupportGroups
                join cat in _zaloContext.SupportGroupCategories
                on sg.CategoryId equals cat.Id
                where sg.PublicId == request.PublicId && sg.IsActive && cat.IsActive
                select new { SupportGroup = sg, Category = cat }
            ).FirstOrDefaultAsync(cancellationToken);

            if (supportGroup == null)
            {
                return new ApiResult<SupportGroupDto>
                {
                    Success = false,
                    Message = "Không tìm thấy nhóm hỗ trợ"
                };
            }

            var supportGroupDto = new SupportGroupDto
            {
                PublicId = supportGroup.SupportGroup.PublicId,
                CategoryPublicId = supportGroup.Category.PublicId,
                CategoryName = supportGroup.Category.Name,
                GroupName = supportGroup.SupportGroup.GroupName,
                GroupLink = supportGroup.SupportGroup.GroupLink,
                GroupType = supportGroup.SupportGroup.GroupType,
                Description = supportGroup.SupportGroup.Description,
                IsActive = supportGroup.SupportGroup.IsActive,
                CreatedAt = supportGroup.SupportGroup.CreatedAt,
                UpdatedAt = supportGroup.SupportGroup.UpdatedAt
            };

            return new ApiResult<SupportGroupDto>
            {
                Success = true,
                Data = supportGroupDto,
                Message = "Lấy thông tin nhóm hỗ trợ thành công"
            };
        }
    }
}