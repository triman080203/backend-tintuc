using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Feedback;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using DXC_Core.API.Features.Files;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class CreateFeedbackResponse
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid FeedbackPublicId { get; set; }
        public required string ResponseContent { get; set; }
        public List<Guid>? FilePublicIds { get; set; } // List of uploaded file PublicIds
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly FileDbContext _fileContext;

        public Validator(FileDbContext fileContext)
        {
            _fileContext = fileContext;

            RuleFor(c => c.FeedbackPublicId)
                .NotEmpty();

            RuleFor(c => c.ResponseContent)
                .NotEmpty()
                .MaximumLength(5000);

            RuleFor(c => c.FilePublicIds)
                .MustAsync(async (ids, cancellation) =>
                {
                    if (ids == null || !ids.Any()) return true;
                    var count = await _fileContext.Files.CountAsync(f => ids.Contains(f.PublicId), cancellation);
                    return count == ids.Count;
                })
                .WithMessage("Một hoặc nhiều PublicId của file không hợp lệ hoặc không tồn tại.")
                .When(c => c.FilePublicIds != null && c.FilePublicIds.Any());
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
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

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                // Find feedback by PublicId
                var feedback = await _context.Feedbacks
                    .FirstOrDefaultAsync(f => f.PublicId == request.FeedbackPublicId && f.IsActive, cancellationToken);

                if (feedback == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không tìm thấy phản ánh với ID được cung cấp"
                    };
                }

                // Validate that feedback is assigned to a department
                if (feedback.AssignedDepartmentId == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Phản ánh chưa được điều phối cho phòng ban nào"
                    };
                }

                // Create response
                var response = new Data.ZaloMiniAppContext.Models.Feedback.FeedbackResponse
                {
                    PublicId = Guid.NewGuid(),
                    FeedbackId = feedback.Id,
                    DepartmentId = feedback.AssignedDepartmentId.Value,
                    ResponseContent = request.ResponseContent,
                    IsApproved = null, // Pending approval
                    IsActive = true
                };

                _context.FeedbackResponses.Add(response);

                // Save response first to get the generated Id
                await _context.SaveChangesAsync(cancellationToken);

                // Xử lý liên kết file attachments - Frontend đã upload file trước
                if (request.FilePublicIds != null && request.FilePublicIds.Any())
                {
                    // Validate các file đã upload có tồn tại không
                    var existingFiles = await _fileContext.Files
                        .Where(f => request.FilePublicIds.Contains(f.PublicId))
                        .ToListAsync(cancellationToken);

                    if (existingFiles.Count != request.FilePublicIds.Count)
                    {
                        return new ApiResult
                        {
                            Success = false,
                            Message = "Một hoặc nhiều file không tồn tại hoặc đã bị xóa"
                        };
                    }

                    // Tạo FeedbackResponseAttachment records
                    int sortOrder = 0;
                    foreach (var file in existingFiles.OrderBy(f => request.FilePublicIds.IndexOf(f.PublicId)))
                    {
                        var responseAttachment = new FeedbackResponseAttachment
                        {
                            PublicId = Guid.NewGuid(),
                            FeedbackResponseId = response.Id, // Now has the actual generated Id
                            FilePublicId = file.PublicId,
                            FileName = file.FileName,
                            FileSize = file.FileSize,
                            FileType = string.IsNullOrEmpty(file.ContentType) ? null : (file.ContentType.Length > 10 ? file.ContentType[..10] : file.ContentType),
                            SortOrder = sortOrder,
                            IsActive = true,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.FeedbackResponseAttachments.Add(responseAttachment);
                        sortOrder++;
                    }
                }

                // Record the status change from current status to "waiting_for_approval"
                var waitingForApprovalStatus = await _context.FeedbackStatuses
                    .FirstOrDefaultAsync(s => s.Code == "waiting_for_approval", cancellationToken);

                if (waitingForApprovalStatus != null)
                {
                    var processingNoteBase = $"Đã tạo phản hồi: {request.ResponseContent}";
                    var processingNote = processingNoteBase.Length > 1000 ? processingNoteBase[..1000] : processingNoteBase;
                    var processing = new Data.ZaloMiniAppContext.Models.Feedback.FeedbackProcessing
                    {
                        FeedbackId = feedback.Id,
                        FromStatusId = feedback.CurrentStatusId,
                        ToStatusId = waitingForApprovalStatus.Id,
                        AssignedDepartmentId = feedback.AssignedDepartmentId,
                        AssignedByUserPublicId = Guid.NewGuid(),
                        AssignedAt = DateTime.UtcNow,
                        ProcessingNote = processingNote,
                        IsActive = true
                    };

                    _context.FeedbackProcessings.Add(processing);

                    // Update feedback status to "waiting_for_approval"
                    feedback.CurrentStatusId = waitingForApprovalStatus.Id;
                }

                // Save attachments and processing record
                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                return new ApiResult
                {
                    Success = true,
                    Message = "Tạo phản hồi thành công. Đang chờ duyệt."
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new ApiResult
                {
                    Success = false,
                    Message = $"Có lỗi xảy ra khi tạo phản hồi: {ex.Message}{(ex.InnerException != null ? $" | Chi tiết: {ex.InnerException.Message}" : string.Empty)}"
                };
            }
        }
    }
}
