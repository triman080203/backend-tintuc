using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbackTrackingById
{
    public class Query : IRequest<ApiResult<FeedbackTrackingDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<FeedbackTrackingDto>>
    {
        private readonly ZaloMiniAppDbContext _context;
        private readonly CoreDbContext _coreContext;

        public Handler(ZaloMiniAppDbContext context, CoreDbContext coreContext)
        {
            _context = context;
            _coreContext = coreContext;
        }

        public async Task<ApiResult<FeedbackTrackingDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var feedback = await _context.Feedbacks
                .Include(f => f.CurrentStatus)
                .FirstOrDefaultAsync(f => f.PublicId == request.PublicId && f.IsActive, cancellationToken);

            if (feedback == null)
            {
                return new ApiResult<FeedbackTrackingDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phản ánh với ID được cung cấp"
                };
            }

            // Load department data from CoreContext
            var departmentIds = new List<int>();
            if (feedback.AssignedDepartmentId.HasValue)
                departmentIds.Add(feedback.AssignedDepartmentId.Value);

            var departments = await _coreContext.Departments
                .Where(d => departmentIds.Contains(d.Id))
                .ToDictionaryAsync(d => d.Id, cancellationToken);

            // Get assigned department if exists
            var assignedDept = feedback.AssignedDepartmentId.HasValue && departments.TryGetValue(feedback.AssignedDepartmentId.Value, out var ad)
                ? ad : null;

            // Load processings separately to avoid navigation issues
            var processings = await _context.FeedbackProcessings
                .Include(p => p.FromStatus)
                .Include(p => p.ToStatus)
                .Where(p => p.FeedbackId == feedback.Id && p.IsActive)
                .ToListAsync(cancellationToken);

            // Get all department IDs from processings
            var processingDepartmentIds = processings
                .Where(p => p.AssignedDepartmentId.HasValue)
                .Select(p => p.AssignedDepartmentId.Value)
                .Distinct()
                .ToList();

            departmentIds.AddRange(processingDepartmentIds);

            // Load additional department details if needed
            var additionalDepartments = await _coreContext.Departments
                .Where(d => processingDepartmentIds.Contains(d.Id))
                .ToDictionaryAsync(d => d.Id, cancellationToken);

            var allDepartments = departments.ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
            foreach (var kvp in additionalDepartments)
            {
                allDepartments[kvp.Key] = kvp.Value;
            }

            // Map to DTO
            var feedbackDto = new FeedbackTrackingDto
            {
                Id = feedback.Id,
                PublicId = feedback.PublicId,
                Title = feedback.Title,
                Content = feedback.Content,
                FullName = feedback.FullName,
                PhoneNumber = feedback.PhoneNumber,
                Location = feedback.Location,
                IsPublic = feedback.IsPublic,
                CurrentStatusId = feedback.CurrentStatusId,
                CurrentStatusCode = feedback.CurrentStatus.Code,
                CurrentStatusName = feedback.CurrentStatus.Name,
                CurrentStatusColor = feedback.CurrentStatus.Color,
                AssignedDepartmentId = feedback.AssignedDepartmentId,
                AssignedDepartmentPublicId = assignedDept?.PublicId,
                AssignedDepartmentCode = assignedDept?.Code,
                AssignedDepartmentName = assignedDept?.Name,
                IsActive = feedback.IsActive,
                CreatedAt = feedback.CreatedAt,
                UpdatedAt = feedback.UpdatedAt,
                Processings = processings.Select(p =>
                {
                    var pDept = p.AssignedDepartmentId.HasValue && allDepartments.TryGetValue(p.AssignedDepartmentId.Value, out var pd)
                        ? pd : null;
                    return new TrackingFeedbackProcessingDto
                    {
                        Id = p.Id,
                        PublicId = p.PublicId,
                        FromStatusId = p.FromStatusId,
                        FromStatusCode = p.FromStatus.Code,
                        FromStatusName = p.FromStatus.Name,
                        ToStatusId = p.ToStatusId,
                        ToStatusCode = p.ToStatus.Code,
                        ToStatusName = p.ToStatus.Name,
                        AssignedDepartmentId = p.AssignedDepartmentId,
                        AssignedDepartmentCode = pDept?.Code,
                        AssignedDepartmentName = pDept?.Name,
                        AssignedByUserPublicId = p.AssignedByUserPublicId,
                        AssignedAt = p.AssignedAt,
                        ProcessingNote = p.ProcessingNote,
                        CreatedAt = p.CreatedAt
                    };
                }).ToList()
            };

            return new ApiResult<FeedbackTrackingDto>
            {
                Success = true,
                Data = feedbackDto,
                Message = "Lấy thông tin phản ánh thành công"
            };
        }
    }
}
