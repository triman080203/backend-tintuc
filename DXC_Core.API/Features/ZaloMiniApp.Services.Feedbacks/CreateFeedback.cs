using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class CreateFeedback
{
    public class Command : IRequest<ApiResult<FeedbackAdminDto>>
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public required string FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public bool IsPublic { get; set; } = false;
        public List<Guid>? AttachmentPublicIds { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext context, FileDbContext fileContext)
        {
            RuleFor(c => c.Title)
                .NotEmpty()
                .MaximumLength(500);

            RuleFor(c => c.Content)
                .NotEmpty();

            RuleFor(c => c.FullName)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(c => c.PhoneNumber)
                .MaximumLength(20);

            RuleFor(c => c.Location)
                .MaximumLength(500);

            RuleFor(c => c.AttachmentPublicIds)
                .Must(ids => ids == null || ids.Count <= 10)
                .WithMessage("Không được phép tải lên quá 10 file đính kèm")
                .MustAsync(async (ids, cancellation) =>
                {
                    if (ids == null || !ids.Any()) return true;
                    var count = await fileContext.Files.CountAsync(f => ids.Contains(f.PublicId), cancellation);
                    return count == ids.Count;
                })
                .WithMessage("Một hoặc nhiều PublicId của file không hợp lệ.");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<FeedbackAdminDto>>
    {
        private readonly ZaloMiniAppDbContext _context;
        private readonly FileDbContext _fileContext;

        public Handler(ZaloMiniAppDbContext context, FileDbContext fileContext)
        {
            _context = context;
            _fileContext = fileContext;
        }

        public async Task<ApiResult<FeedbackAdminDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                // Get initial status (submitted)
                var initialStatus = await _context.FeedbackStatuses
                    .FirstOrDefaultAsync(s => s.Code == "submitted", cancellationToken);

                if (initialStatus == null)
                {
                    return new ApiResult<FeedbackAdminDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy trạng thái khởi tạo cho phản ánh"
                    };
                }

                // Create feedback
                var feedback = new Data.ZaloMiniAppContext.Models.Feedback.Feedback
                {
                    Title = request.Title,
                    Content = request.Content,
                    FullName = request.FullName,
                    PhoneNumber = request.PhoneNumber,
                    Location = request.Location,
                    IsPublic = request.IsPublic,
                    CurrentStatusId = initialStatus.Id,
                    IsActive = true
                };

                _context.Feedbacks.Add(feedback);
                await _context.SaveChangesAsync(cancellationToken);

                // Add attachments if provided
                if (request.AttachmentPublicIds != null && request.AttachmentPublicIds.Any())
                {
                    var attachmentFiles = await _fileContext.Files
                        .Where(f => request.AttachmentPublicIds.Contains(f.PublicId))
                        .ToListAsync(cancellationToken);

                    foreach (var file in attachmentFiles)
                    {
                        var feedbackAttachment = new Data.ZaloMiniAppContext.Models.Feedback.FeedbackAttachment
                        {
                            FeedbackId = feedback.Id,
                            FilePublicId = file.PublicId,
                            FileName = file.FileName,
                            FileSize = file.FileSize,
                            FileType = file.ContentType,
                            SortOrder = attachmentFiles.IndexOf(file),
                            IsActive = true
                        };

                        _context.FeedbackAttachments.Add(feedbackAttachment);
                    }

                    await _context.SaveChangesAsync(cancellationToken);
                }

                await transaction.CommitAsync(cancellationToken);

                // Return result
                var result = new FeedbackAdminDto
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
                    CurrentStatusCode = initialStatus.Code,
                    CurrentStatusName = initialStatus.Name,
                    CurrentStatusColor = initialStatus.Color,
                    IsActive = feedback.IsActive,
                    CreatedAt = feedback.CreatedAt,
                    UpdatedAt = feedback.UpdatedAt,
                    AttachmentCount = request.AttachmentPublicIds?.Count ?? 0
                };

                return new ApiResult<FeedbackAdminDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Tạo phản ánh thành công"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new ApiResult<FeedbackAdminDto>
                {
                    Success = false,
                    Message = $"Có lỗi xảy ra khi tạo phản ánh: {ex.Message}"
                };
            }
        }
    }
}