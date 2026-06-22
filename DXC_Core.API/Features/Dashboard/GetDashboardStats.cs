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

            // News stats
            var totalNews = await _miniDb.TinTucArticles.AsNoTracking().Where(a => a.IsActive).CountAsync(cancellationToken);
            
            // Assuming status IDs are: 1 (draft), 2 (pending_review), 3 (returned), 4 (approved), 5 (published)
            // It is safer to query by code, but for now we can just get counts grouped by status code if possible.
            var newsStatuses = await _miniDb.TinTucStatuses.AsNoTracking().ToDictionaryAsync(s => s.Code, s => s.Id, cancellationToken);
            
            var pendingNewsId = newsStatuses.GetValueOrDefault("pending_review", 0);
            var approvedNewsId = newsStatuses.GetValueOrDefault("approved", 0);
            var publishedNewsId = newsStatuses.GetValueOrDefault("published", 0);
            
            var pendingNews = pendingNewsId > 0 ? await _miniDb.TinTucArticles.AsNoTracking().CountAsync(a => a.IsActive && a.CurrentStatusId == pendingNewsId, cancellationToken) : 0;
            var approvedNews = approvedNewsId > 0 ? await _miniDb.TinTucArticles.AsNoTracking().CountAsync(a => a.IsActive && a.CurrentStatusId == approvedNewsId, cancellationToken) : 0;
            var publishedNews = publishedNewsId > 0 ? await _miniDb.TinTucArticles.AsNoTracking().CountAsync(a => a.IsActive && a.CurrentStatusId == publishedNewsId, cancellationToken) : 0;

            var data = new DashboardStatsDto
            {
                TotalFeedbacks = totalFeedbacks,
                ProcessingFeedbacks = processingFeedbacks,
                ApprovedFeedbackResponses = approvedFeedbacks,
                TotalUsers = totalUsers,
                TotalNews = totalNews,
                PendingNews = pendingNews,
                ApprovedNews = approvedNews,
                PublishedNews = publishedNews
            };

            return new ApiResult<DashboardStatsDto>
            {
                Success = true,
                Data = data
            };
        }
    }
}