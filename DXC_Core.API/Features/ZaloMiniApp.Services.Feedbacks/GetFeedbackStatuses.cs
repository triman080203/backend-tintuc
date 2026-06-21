using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbackStatuses
{
    public class Query : IRequest<PagedResult<FeedbackStatusDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? Code { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<FeedbackStatusDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<FeedbackStatusDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var queryable = _dbContext.FeedbackStatuses.AsNoTracking();

            // Áp dụng bộ lọc
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                queryable = queryable.Where(s => s.Name.Contains(request.Name));
            }

            if (!string.IsNullOrWhiteSpace(request.Code))
            {
                queryable = queryable.Where(s => s.Code.Contains(request.Code));
            }

            if (request.IsActive.HasValue)
            {
                queryable = queryable.Where(s => s.IsActive == request.IsActive.Value);
            }
            
            // Lấy tổng số lượng bản ghi trước khi phân trang
            var total = await queryable.CountAsync(cancellationToken);

            // Áp dụng phân trang và sắp xếp theo SortOrder rồi theo Name
            var statuses = await queryable
                .OrderBy(s => s.SortOrder)
                .ThenBy(s => s.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(s => new FeedbackStatusDto
                {
                    PublicId = s.PublicId,
                    Code = s.Code,
                    Name = s.Name,
                    Description = s.Description,
                    Color = s.Color,
                    SortOrder = s.SortOrder,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt
                })
                .ToListAsync(cancellationToken);
            
            // Trả về theo cấu trúc PagedResult đã thống nhất
            return new PagedResult<FeedbackStatusDto>
            {
                Success = true,
                Data = statuses,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
