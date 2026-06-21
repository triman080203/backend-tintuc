using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Dashboard;

public static class GetDashboardStats
{
    public class Query : IRequest<ApiResult<DashboardStatsDto>> { }

    public class Handler : IRequestHandler<Query, ApiResult<DashboardStatsDto>>
    {
        private readonly ZaloMiniAppDbContext _miniDb;
        private readonly CoreDbContext _coreDb;

        public Handler(ZaloMiniAppDbContext miniDb, CoreDbContext coreDb)
        {
            _miniDb = miniDb;
            _coreDb = coreDb;
        }

        public async Task<ApiResult<DashboardStatsDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var totalFeedbacks = await _miniDb.Feedbacks.AsNoTracking().Where(f => f.IsActive).CountAsync(cancellationToken);

            var completedStatusId = await _miniDb.FeedbackStatuses
                .AsNoTracking()
                .Where(s => s.Code == "completed")
                .Select(s => s.Id)
                .FirstOrDefaultAsync(cancellationToken);

            var approvedFeedbacks = completedStatusId == 0
                ? 0
                : await _miniDb.Feedbacks.AsNoTracking()
                    .Where(f => f.IsActive && f.CurrentStatusId == completedStatusId)
                    .CountAsync(cancellationToken);

            var processingFeedbacks = completedStatusId == 0
                ? totalFeedbacks
                : await _miniDb.Feedbacks.AsNoTracking()
                    .Where(f => f.IsActive && f.CurrentStatusId != completedStatusId)
                    .CountAsync(cancellationToken);
            var totalUsers = await _coreDb.Users.AsNoTracking().Where(u => u.IsActive).CountAsync(cancellationToken);

            var data = new DashboardStatsDto
            {
                TotalFeedbacks = totalFeedbacks,
                ProcessingFeedbacks = processingFeedbacks,
                ApprovedFeedbackResponses = approvedFeedbacks,
                TotalUsers = totalUsers
            };

            return new ApiResult<DashboardStatsDto>
            {
                Success = true,
                Data = data
            };
        }
    }
}