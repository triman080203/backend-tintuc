using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public static class GetSupportGroups
{
    public class Query : IRequest<PagedResult<SupportGroupDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? GroupName { get; set; }
        public string? GroupType { get; set; }
        public Guid? CategoryPublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<SupportGroupDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<PagedResult<SupportGroupDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = from sg in _zaloContext.SupportGroups
                        join cat in _zaloContext.SupportGroupCategories
                        on sg.CategoryId equals cat.Id
                        where sg.IsActive && cat.IsActive
                        select new { SupportGroup = sg, Category = cat };

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.GroupName))
            {
                query = query.Where(x => x.SupportGroup.GroupName.Contains(request.GroupName));
            }

            if (!string.IsNullOrWhiteSpace(request.GroupType))
            {
                query = query.Where(x => x.SupportGroup.GroupType == request.GroupType);
            }

            if (request.CategoryPublicId.HasValue)
            {
                query = query.Where(x => x.Category.PublicId == request.CategoryPublicId.Value);
            }

            var total = await query.CountAsync(cancellationToken);

            var supportGroups = await query
                .OrderBy(x => x.Category.Name)
                .ThenBy(x => x.SupportGroup.GroupName)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new SupportGroupDto
                {
                    PublicId = x.SupportGroup.PublicId,
                    CategoryPublicId = x.Category.PublicId,
                    CategoryName = x.Category.Name,
                    GroupName = x.SupportGroup.GroupName,
                    GroupLink = x.SupportGroup.GroupLink,
                    GroupType = x.SupportGroup.GroupType,
                    Description = x.SupportGroup.Description,
                    IsActive = x.SupportGroup.IsActive,
                    CreatedAt = x.SupportGroup.CreatedAt,
                    UpdatedAt = x.SupportGroup.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<SupportGroupDto>
            {
                Success = true,
                Data = supportGroups,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách nhóm hỗ trợ thành công"
            };
        }
    }
}