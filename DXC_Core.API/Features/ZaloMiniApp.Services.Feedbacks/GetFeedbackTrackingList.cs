using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbackTrackingList
{
    public class Query : IRequest<PagedResult<FeedbackTrackingDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Filter parameters
        public string? Title { get; set; }
        public string? PhoneNumber { get; set; }
        public int? CurrentStatusId { get; set; }
        public string? CurrentStatusCode { get; set; }
        public Guid? AssignedDepartmentPublicId { get; set; }
        public bool? IsActive { get; set; }

        // Date range filters
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<FeedbackTrackingDto>>
    {
        private readonly ZaloMiniAppDbContext _context;
        private readonly CoreDbContext _coreContext;

        public Handler(ZaloMiniAppDbContext context, CoreDbContext coreContext)
        {
            _context = context;
            _coreContext = coreContext;
        }

        public async Task<PagedResult<FeedbackTrackingDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Feedbacks
                .Include(f => f.CurrentStatus)
                .Where(f => f.IsActive)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Title))
            {
                query = query.Where(f => f.Title.Contains(request.Title));
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                query = query.Where(f => f.PhoneNumber != null && f.PhoneNumber.Contains(request.PhoneNumber));
            }

            if (!string.IsNullOrWhiteSpace(request.CurrentStatusCode))
            {
                var statusId = await _context.FeedbackStatuses
                    .Where(s => s.Code == request.CurrentStatusCode)
                    .Select(s => (int?)s.Id)
                    .FirstOrDefaultAsync(cancellationToken);

                if (statusId.HasValue)
                {
                    query = query.Where(f => f.CurrentStatusId == statusId.Value);
                }
                else
                {
                    return new PagedResult<FeedbackTrackingDto>
                    {
                        Success = true,
                        Data = Enumerable.Empty<FeedbackTrackingDto>(),
                        Total = 0,
                        Current = request.Current,
                        PageSize = request.PageSize
                    };
                }
            }
            else if (request.CurrentStatusId.HasValue)
            {
                query = query.Where(f => f.CurrentStatusId == request.CurrentStatusId.Value);
            }

            // Filter by department PublicId (from Common.Department)
            if (request.AssignedDepartmentPublicId.HasValue)
            {
                var departmentId = await _coreContext.Departments
                    .Where(d => d.PublicId == request.AssignedDepartmentPublicId.Value && d.IsActive)
                    .Select(d => (int?)d.Id)
                    .FirstOrDefaultAsync(cancellationToken);

                if (departmentId.HasValue)
                {
                    query = query.Where(f => f.AssignedDepartmentId == departmentId.Value);
                }
                else
                {
                    // Department not found, return empty result
                    return new PagedResult<FeedbackTrackingDto>
                    {
                        Success = true,
                        Data = Enumerable.Empty<FeedbackTrackingDto>(),
                        Total = 0,
                        Current = request.Current,
                        PageSize = request.PageSize
                    };
                }
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(f => f.IsActive == request.IsActive.Value);
            }

            if (request.CreatedFrom.HasValue)
            {
                query = query.Where(f => f.CreatedAt >= request.CreatedFrom.Value);
            }

            if (request.CreatedTo.HasValue)
            {
                query = query.Where(f => f.CreatedAt <= request.CreatedTo.Value);
            }

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination
            var feedbacks = await query
                .OrderByDescending(f => f.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Get all unique assigned department IDs to load from CoreContext
            var departmentIds = feedbacks
                .Where(f => f.AssignedDepartmentId.HasValue)
                .Select(f => f.AssignedDepartmentId.Value)
                .Distinct()
                .ToList();

            // Load department details from CoreContext
            var departments = await _coreContext.Departments
                .Where(d => departmentIds.Contains(d.Id))
                .ToDictionaryAsync(d => d.Id, cancellationToken);

            // Load processings separately to avoid navigation issues
            var feedbackIds = feedbacks.Select(f => f.Id).ToList();
            var processings = await _context.FeedbackProcessings
                .Include(p => p.FromStatus)
                .Include(p => p.ToStatus)
                .Where(p => feedbackIds.Contains(p.FeedbackId) && p.IsActive)
                .ToListAsync(cancellationToken);

            // Group processings by feedback ID
            var processingsByFeedback = processings
                .GroupBy(p => p.FeedbackId)
                .ToDictionary(g => g.Key, g => g.ToList());

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

            // Map to DTOs
            var feedbackDtos = feedbacks.Select(f =>
            {
                var department = f.AssignedDepartmentId.HasValue && allDepartments.TryGetValue(f.AssignedDepartmentId.Value, out var dept)
                    ? dept
                    : null;

                var feedbackProcessings = processingsByFeedback.TryGetValue(f.Id, out var procList) ? procList : new List<Data.ZaloMiniAppContext.Models.Feedback.FeedbackProcessing>();

                return new FeedbackTrackingDto
                {
                    Id = f.Id,
                    PublicId = f.PublicId,
                    Title = f.Title,
                    Content = f.Content,
                    FullName = f.FullName,
                    PhoneNumber = f.PhoneNumber,
                    Location = f.Location,
                    IsPublic = f.IsPublic,
                    CurrentStatusId = f.CurrentStatusId,
                    CurrentStatusCode = f.CurrentStatus.Code,
                    CurrentStatusName = f.CurrentStatus.Name,
                    CurrentStatusColor = f.CurrentStatus.Color,
                    AssignedDepartmentId = f.AssignedDepartmentId,
                    AssignedDepartmentPublicId = department?.PublicId,
                    AssignedDepartmentCode = department?.Code,
                    AssignedDepartmentName = department?.Name,
                    IsActive = f.IsActive,
                    CreatedAt = f.CreatedAt,
                    UpdatedAt = f.UpdatedAt,
                    Processings = feedbackProcessings.Select(p =>
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
            }).ToList();

            return new PagedResult<FeedbackTrackingDto>
            {
                Success = true,
                Data = feedbackDtos,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = $"Tìm thấy {total} phản ánh"
            };
        }
    }
}
