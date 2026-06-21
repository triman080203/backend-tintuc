using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbacks
{
    public class Query : IRequest<PagedResult<FeedbackAdminDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Filter parameters (theo quy tắc filtering cụ thể)
        public string? Title { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public int? CurrentStatusId { get; set; }
        public Guid? AssignedDepartmentPublicId { get; set; }
        public bool? IsPublic { get; set; }
        public bool? IsActive { get; set; }

        // Date range filters
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<FeedbackAdminDto>>
    {
        private readonly ZaloMiniAppDbContext _context;
        private readonly CoreDbContext _coreContext;

        public Handler(ZaloMiniAppDbContext context, CoreDbContext coreContext)
        {
            _context = context;
            _coreContext = coreContext;
        }

        public async Task<PagedResult<FeedbackAdminDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Feedbacks
                .Include(f => f.CurrentStatus)
                .Include(f => f.Attachments)
                .Include(f => f.Processings)
                .Include(f => f.Responses)
                .Where(f => f.IsActive)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Title))
            {
                query = query.Where(f => f.Title.Contains(request.Title));
            }

            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                query = query.Where(f => f.FullName.Contains(request.FullName));
            }

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                query = query.Where(f => f.PhoneNumber != null && f.PhoneNumber.Contains(request.PhoneNumber));
            }

            if (!string.IsNullOrWhiteSpace(request.Location))
            {
                query = query.Where(f => f.Location != null && f.Location.Contains(request.Location));
            }

            if (request.CurrentStatusId.HasValue)
            {
                query = query.Where(f => f.CurrentStatusId == request.CurrentStatusId.Value);
            }

            // Filter by department PublicId (from Common.Department)
            // First, resolve PublicId to internal Id from CoreContext
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
                    return new PagedResult<FeedbackAdminDto>
                    {
                        Success = true,
                        Data = Enumerable.Empty<FeedbackAdminDto>(),
                        Total = 0,
                        Current = request.Current,
                        PageSize = request.PageSize
                    };
                }
            }

            if (request.IsPublic.HasValue)
            {
                query = query.Where(f => f.IsPublic == request.IsPublic.Value);
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

            // Map to DTOs
            var feedbackDtos = feedbacks.Select(f =>
            {
                var department = f.AssignedDepartmentId.HasValue && departments.TryGetValue(f.AssignedDepartmentId.Value, out var dept)
                    ? dept
                    : null;

                return new FeedbackAdminDto
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
                    AttachmentCount = f.Attachments.Count(a => a.IsActive),
                    ProcessingCount = f.Processings.Count(p => p.IsActive),
                    ResponseCount = f.Responses.Count(r => r.IsActive)
                };
            }).ToList();

            return new PagedResult<FeedbackAdminDto>
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