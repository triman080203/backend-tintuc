using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbackDetailMobile
{
    public class Query : IRequest<ApiResult<FeedbackDetailMobileDto>>
    {
        public required Guid PublicId { get; set; }
        public string? PhoneNumber { get; set; } // Optional: for user verification
    }

    public class Handler : IRequestHandler<Query, ApiResult<FeedbackDetailMobileDto>>
    {
        private readonly ZaloMiniAppDbContext _context;
        private readonly CoreDbContext _coreContext;
        private readonly FileDbContext _fileContext;

        public Handler(ZaloMiniAppDbContext context, CoreDbContext coreContext, FileDbContext fileContext)
        {
            _context = context;
            _coreContext = coreContext;
            _fileContext = fileContext;
        }

        public async Task<ApiResult<FeedbackDetailMobileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Feedbacks
                .Include(f => f.CurrentStatus)
                .Include(f => f.Attachments.Where(a => a.IsActive))
                .Include(f => f.Responses.Where(r => r.IsActive && r.IsApproved == true))
                    .ThenInclude(r => r.Attachments.Where(a => a.IsActive))
                .Where(f => f.IsActive && f.PublicId == request.PublicId)
                .AsQueryable();

            // If phone number is provided, verify ownership (for private feedbacks)
            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                query = query.Where(f => f.PhoneNumber == request.PhoneNumber || f.IsPublic);
            }
            else
            {
                // Only allow public feedbacks if no phone number provided
                query = query.Where(f => f.IsPublic);
            }

            var feedback = await query.FirstOrDefaultAsync(cancellationToken);

            if (feedback == null)
            {
                return new ApiResult<FeedbackDetailMobileDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phản ánh hoặc bạn không có quyền truy cập"
                };
            }

            // Map to DTO
            var feedbackDto = new FeedbackDetailMobileDto
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
                IsActive = feedback.IsActive,
                CreatedAt = feedback.CreatedAt,
                UpdatedAt = feedback.UpdatedAt,
                Attachments = feedback.Attachments.Select(a => new FeedbackAttachmentMobileDto
                {
                    FilePublicId = a.FilePublicId,
                    FileName = a.FileName,
                    FileSize = a.FileSize,
                    FileType = a.FileType,
                    SortOrder = a.SortOrder,
                    FileUrl = $"/{_fileContext.Files.FirstOrDefault(f => f.PublicId == a.FilePublicId)?.FilePath}"
                }).ToList(),
                Responses = feedback.Responses.Select(r => new FeedbackResponseMobileDto
                {
                    Id = r.Id,
                    PublicId = r.PublicId,
                    ResponseContent = r.ResponseContent,
                    IsApproved = r.IsApproved,
                    ApprovedAt = r.ApprovedAt,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    Attachments = r.Attachments.Select(a => new FeedbackResponseAttachmentMobileDto
                    {
                        FilePublicId = a.FilePublicId,
                        FileName = a.FileName,
                        FileSize = a.FileSize,
                        FileType = a.FileType,
                        SortOrder = a.SortOrder,
                        FileUrl = $"/{_fileContext.Files.FirstOrDefault(f => f.PublicId == a.FilePublicId)?.FilePath}"
                    }).OrderBy(a => a.SortOrder).ToList()
                }).ToList()
            };

            if (feedback.AssignedDepartmentId.HasValue)
            {
                var dept = await _coreContext.Departments
                    .FirstOrDefaultAsync(d => d.Id == feedback.AssignedDepartmentId.Value, cancellationToken);
                if (dept != null)
                {
                    feedbackDto.AssignedDepartmentId = dept.Id;
                    feedbackDto.AssignedDepartmentCode = dept.Code;
                    feedbackDto.AssignedDepartmentName = dept.Name;
                }
            }

            return new ApiResult<FeedbackDetailMobileDto>
            {
                Success = true,
                Data = feedbackDto,
                Message = "Lấy thông tin phản ánh thành công"
            };
        }
    }
}
