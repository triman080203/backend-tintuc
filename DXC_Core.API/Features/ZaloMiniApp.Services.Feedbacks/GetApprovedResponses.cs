using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetApprovedResponses
{
    public class Query : IRequest<PagedResult<FeedbackResponseDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Filter parameters
        public int? DepartmentId { get; set; }
        public DateTime? ApprovedFrom { get; set; }
        public DateTime? ApprovedTo { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<FeedbackResponseDto>>
    {
        private readonly ZaloMiniAppDbContext _context;
        private readonly FileDbContext _fileContext;
        private readonly CoreDbContext _coreContext;

        public Handler(ZaloMiniAppDbContext context, FileDbContext fileContext, CoreDbContext coreContext)
        {
            _context = context;
            _fileContext = fileContext;
            _coreContext = coreContext;
        }

        public async Task<PagedResult<FeedbackResponseDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.FeedbackResponses
                .Include(r => r.Feedback)
                .Include(r => r.Attachments)
                .Where(r => r.IsActive && r.IsApproved != null) // Only approved/rejected responses
                .AsQueryable();

            // Apply filters
            if (request.DepartmentId.HasValue)
            {
                query = query.Where(r => r.DepartmentId == request.DepartmentId.Value);
            }

            if (request.ApprovedFrom.HasValue)
            {
                query = query.Where(r => r.ApprovedAt >= request.ApprovedFrom.Value);
            }

            if (request.ApprovedTo.HasValue)
            {
                query = query.Where(r => r.ApprovedAt <= request.ApprovedTo.Value);
            }

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination
            var responses = await query
                .OrderByDescending(r => r.ApprovedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Load departments from CoreContext
            var departmentIds = responses.Select(r => r.DepartmentId).Distinct().ToList();
            var departments = await _coreContext.Departments
                .Where(d => departmentIds.Contains(d.Id))
                .ToDictionaryAsync(d => d.Id, cancellationToken);

            // Map to DTOs
            var responseDtos = responses.Select(r =>
            {
                var dept = departments.TryGetValue(r.DepartmentId, out var d) ? d : null;
                return new FeedbackResponseDto
                {
                    Id = r.Id,
                    PublicId = r.PublicId,
                    DepartmentId = r.DepartmentId,
                    DepartmentCode = dept?.Code ?? "",
                    DepartmentName = dept?.Name ?? "",
                    ResponseContent = r.ResponseContent ?? "",
                    ResponseAttachments = r.ResponseAttachments,
                    IsApproved = r.IsApproved,
                    ApprovedByUserPublicId = r.ApprovedByUserPublicId,
                    ApprovedAt = r.ApprovedAt,
                    ApprovalNote = r.ApprovalNote,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    Attachments = r.Attachments.Select(a => new FeedbackResponseAttachmentDto
                    {
                        Id = a.Id,
                        PublicId = a.PublicId,
                        FilePublicId = a.FilePublicId,
                        FileName = a.FileName,
                        FileSize = a.FileSize,
                        FileType = a.FileType,
                        SortOrder = a.SortOrder,
                        DownloadUrl = $"/{_fileContext.Files.FirstOrDefault(f => f.PublicId == a.FilePublicId)?.FilePath}",
                        CreatedAt = a.CreatedAt
                    }).OrderBy(a => a.SortOrder).ToList()
                };
            }).ToList();

            return new PagedResult<FeedbackResponseDto>
            {
                Success = true,
                Data = responseDtos,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = $"Tìm thấy {total} phản hồi đã xử lý"
            };
        }
    }
}