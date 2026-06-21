using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbackById
{
    public class Query : IRequest<ApiResult<FeedbackDetailDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<FeedbackDetailDto>>
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

        public async Task<ApiResult<FeedbackDetailDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var feedback = await _context.Feedbacks
                .Include(f => f.CurrentStatus)
                .Include(f => f.Attachments.Where(a => a.IsActive))
                .Include(f => f.Processings.Where(p => p.IsActive))
                    .ThenInclude(p => p.FromStatus)
                .Include(f => f.Processings.Where(p => p.IsActive))
                    .ThenInclude(p => p.ToStatus)
                .Include(f => f.Responses.Where(r => r.IsActive))
                    .ThenInclude(r => r.Attachments.Where(a => a.IsActive))
                .FirstOrDefaultAsync(f => f.PublicId == request.PublicId && f.IsActive, cancellationToken);

            if (feedback == null)
            {
                return new ApiResult<FeedbackDetailDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phản ánh với ID được cung cấp"
                };
            }

            // Load department data from CoreContext
            var departmentIds = new List<int>();
            if (feedback.AssignedDepartmentId.HasValue)
                departmentIds.Add(feedback.AssignedDepartmentId.Value);
            
            departmentIds.AddRange(feedback.Processings
                .Where(p => p.AssignedDepartmentId.HasValue)
                .Select(p => p.AssignedDepartmentId.Value));
            
            departmentIds.AddRange(feedback.Responses
                .Where(r => r.DepartmentId > 0)
                .Select(r => r.DepartmentId));

            var departments = await _coreContext.Departments
                .Where(d => departmentIds.Contains(d.Id))
                .ToDictionaryAsync(d => d.Id, cancellationToken);

            // Get assigned department if exists
            var assignedDept = feedback.AssignedDepartmentId.HasValue && departments.TryGetValue(feedback.AssignedDepartmentId.Value, out var ad)
                ? ad : null;

            // Map to DTO
            var feedbackDto = new FeedbackDetailDto
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
                CurrentStatusCode = feedback.CurrentStatus.Code ?? "",
                CurrentStatusName = feedback.CurrentStatus.Name ?? "",
                CurrentStatusColor = feedback.CurrentStatus.Color,
                AssignedDepartmentId = feedback.AssignedDepartmentId,
                AssignedDepartmentPublicId = assignedDept?.PublicId,
                AssignedDepartmentCode = assignedDept?.Code,
                AssignedDepartmentName = assignedDept?.Name,
                AssignedDepartmentContactEmail = assignedDept?.ContactEmail,
                AssignedDepartmentContactPhone = assignedDept?.ContactPhone,
                IsActive = feedback.IsActive,
                CreatedAt = feedback.CreatedAt,
                UpdatedAt = feedback.UpdatedAt,
                Attachments = feedback.Attachments.Select(a => new FeedbackAttachmentDto
                {
                    Id = a.Id,
                    PublicId = a.PublicId,
                    FilePublicId = a.FilePublicId,
                    FileName = a.FileName,
                    FileSize = a.FileSize,
                    FileType = a.FileType,
                    SortOrder = a.SortOrder,
                    CreatedAt = a.CreatedAt
                }).ToList(),
                Processings = feedback.Processings.Select(p =>
                {
                    var pDept = p.AssignedDepartmentId.HasValue && departments.TryGetValue(p.AssignedDepartmentId.Value, out var pd)
                        ? pd : null;
                    return new FeedbackProcessingDto
                    {
                        Id = p.Id,
                        PublicId = p.PublicId,
                        FromStatusId = p.FromStatusId,
                        FromStatusCode = p.FromStatus.Code ?? "",
                        FromStatusName = p.FromStatus.Name ?? "",
                        ToStatusId = p.ToStatusId,
                        ToStatusCode = p.ToStatus.Code ?? "",
                        ToStatusName = p.ToStatus.Name ?? "",
                        AssignedDepartmentId = p.AssignedDepartmentId,
                        AssignedDepartmentCode = pDept?.Code,
                        AssignedDepartmentName = pDept?.Name,
                        AssignedByUserPublicId = p.AssignedByUserPublicId,
                        AssignedAt = p.AssignedAt,
                        ProcessingNote = p.ProcessingNote,
                        CreatedAt = p.CreatedAt
                    };
                }).ToList(),
                Responses = feedback.Responses.Select(r =>
                {
                    var rDept = departments.TryGetValue(r.DepartmentId, out var rd) ? rd : null;
                    return new FeedbackResponseDto
                    {
                        Id = r.Id,
                        PublicId = r.PublicId,
                        DepartmentId = r.DepartmentId,
                        DepartmentCode = rDept?.Code ?? "",
                        DepartmentName = rDept?.Name ?? "",
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
                }).ToList()
            };

            return new ApiResult<FeedbackDetailDto>
            {
                Success = true,
                Data = feedbackDto,
                Message = "Lấy thông tin phản ánh thành công"
            };
        }
    }
}