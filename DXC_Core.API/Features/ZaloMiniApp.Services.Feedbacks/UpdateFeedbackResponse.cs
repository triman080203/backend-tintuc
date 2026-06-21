using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Feedback;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class UpdateFeedbackResponse
{
    public class Command : IRequest<ApiResult>
    {
        public required int ResponseId { get; set; }
        public string? ResponseContent { get; set; }
        public List<Guid>? FilePublicIds { get; set; } // List of uploaded file PublicIds
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly FileDbContext _fileContext;

        public Validator(FileDbContext fileContext)
        {
            _fileContext = fileContext;

            RuleFor(c => c.ResponseId)
                .GreaterThan(0);

            RuleFor(c => c.ResponseContent)
                .NotEmpty()
                .MaximumLength(5000)
                .When(c => c.ResponseContent != null);

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

        public Handler(ZaloMiniAppDbContext context, FileDbContext fileContext)
        {
            _context = context;
            _fileContext = fileContext;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                // Find response by ID
                var response = await _context.FeedbackResponses
                    .Include(r => r.Feedback)
                    .Include(r => r.Attachments)
                    .FirstOrDefaultAsync(r => r.Id == request.ResponseId && r.IsActive, cancellationToken);

                if (response == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không tìm thấy phản hồi với ID được cung cấp"
                    };
                }

                // Check if response is already approved
                if (response.IsApproved.HasValue)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không thể cập nhật phản hồi đã được duyệt"
                    };
                }

                // Update response fields
                if (!string.IsNullOrWhiteSpace(request.ResponseContent))
                    response.ResponseContent = request.ResponseContent;

                // Xử lý file attachments - Frontend đã upload file trước
                if (request.FilePublicIds != null)
                {
                    // Xóa các file attachments cũ
                    var existingAttachments = response.Attachments.ToList();
                    foreach (var attachment in existingAttachments)
                    {
                        _context.FeedbackResponseAttachments.Remove(attachment);
                    }

                    // Validate và thêm file attachments mới
                    if (request.FilePublicIds.Any())
                    {
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

                        // Tạo FeedbackResponseAttachment records mới
                        int sortOrder = 0;
                        foreach (var file in existingFiles.OrderBy(f => request.FilePublicIds.IndexOf(f.PublicId)))
                        {
                            var responseAttachment = new FeedbackResponseAttachment
                            {
                                PublicId = Guid.NewGuid(),
                                FeedbackResponseId = response.Id,
                                FilePublicId = file.PublicId,
                                FileName = file.FileName,
                                FileSize = file.FileSize,
                                FileType = file.ContentType,
                                SortOrder = sortOrder,
                                IsActive = true,
                                CreatedAt = DateTime.UtcNow
                            };
                            _context.FeedbackResponseAttachments.Add(responseAttachment);
                            sortOrder++;
                        }
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                return new ApiResult
                {
                    Success = true,
                    Message = "Cập nhật phản hồi thành công"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new ApiResult
                {
                    Success = false,
                    Message = $"Có lỗi xảy ra khi cập nhật phản hồi: {ex.Message}"
                };
            }
        }
    }
}