using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetActiveFeedbackStatuses
{
    public class Query : IRequest<ApiResult<List<FeedbackStatusDto>>>
    {
        // Không có parameters, chỉ lấy danh sách active feedback statuses
    }

    public class Handler : IRequestHandler<Query, ApiResult<List<FeedbackStatusDto>>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<List<FeedbackStatusDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var statuses = await _dbContext.FeedbackStatuses
                .AsNoTracking()
                .Where(s => s.IsActive)
                .OrderBy(s => s.SortOrder)
                .ThenBy(s => s.Name)
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

            return new ApiResult<List<FeedbackStatusDto>> 
            { 
                Success = true, 
                Data = statuses 
            };
        }
    }
}
