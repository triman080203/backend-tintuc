using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbackStatusCountsMobile
{
    public class Query : IRequest<ApiResult<FeedbackStatusCountsDto>>
    {
        public string? PhoneNumber { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<FeedbackStatusCountsDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<FeedbackStatusCountsDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var baseQuery = _context.Feedbacks
                .Include(f => f.CurrentStatus)
                .Where(f => f.IsActive)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                baseQuery = baseQuery.Where(f => f.PhoneNumber == request.PhoneNumber);
            }
            else
            {
                baseQuery = baseQuery.Where(f => f.IsPublic);
            }

            var submittedStatus = await _context.FeedbackStatuses.FirstOrDefaultAsync(s => s.Code == "submitted", cancellationToken);
            var inProgressStatus = await _context.FeedbackStatuses.FirstOrDefaultAsync(s => s.Code == "in_progress", cancellationToken);
            var completedStatus = await _context.FeedbackStatuses.FirstOrDefaultAsync(s => s.Code == "completed", cancellationToken);
            var rejectedStatus = await _context.FeedbackStatuses.FirstOrDefaultAsync(s => s.Code == "rejected", cancellationToken);
            var waitingForApprovalStatus = await _context.FeedbackStatuses.FirstOrDefaultAsync(s => s.Code == "waiting_for_approval", cancellationToken);

            var submittedCount = submittedStatus == null
                ? 0
                : await baseQuery.Where(f => f.CurrentStatusId == submittedStatus.Id).CountAsync(cancellationToken);

            var inProgressCount = inProgressStatus == null
                ? 0
                : await baseQuery.Where(f => f.CurrentStatusId == inProgressStatus.Id).CountAsync(cancellationToken);

            var completedCount = completedStatus == null
                ? 0
                : await baseQuery.Where(f => f.CurrentStatusId == completedStatus.Id).CountAsync(cancellationToken);

            var rejectedCount = rejectedStatus == null
                ? 0
                : await baseQuery.Where(f => f.CurrentStatusId == rejectedStatus.Id).CountAsync(cancellationToken);

            var confirmCount = waitingForApprovalStatus == null
                ? 0
                : await baseQuery.Where(f => f.CurrentStatusId == waitingForApprovalStatus.Id).CountAsync(cancellationToken);

            var dto = new FeedbackStatusCountsDto
            {
                SubmittedCount = submittedCount,
                InProgressCount = inProgressCount,
                CompletedCount = completedCount,
                RejectedCount = rejectedCount,
                ConfirmCount = confirmCount,
                TotalCount = submittedCount + inProgressCount + completedCount + rejectedCount + confirmCount
            };

            return new ApiResult<FeedbackStatusCountsDto>
            {
                Success = true,
                Data = dto,
                Message = "Thống kê số lượng phản ánh theo trạng thái"
            };
        }
    }
}
