using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class DeleteFeedback
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.PublicId)
                .NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                // Find feedback by PublicId
                var feedback = await _context.Feedbacks
                    .FirstOrDefaultAsync(f => f.PublicId == request.PublicId && f.IsActive, cancellationToken);

                if (feedback == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không tìm thấy phản ánh với ID được cung cấp"
                    };
                }

                // Check if feedback can be deleted (only if it's in initial status)
                var initialStatus = await _context.FeedbackStatuses
                    .FirstOrDefaultAsync(s => s.Code == "submitted", cancellationToken);

                if (feedback.CurrentStatusId != initialStatus?.Id)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không thể xóa phản ánh đã được xử lý. Chỉ có thể xóa phản ánh ở trạng thái khởi tạo."
                    };
                }

                // Soft delete feedback and related data
                feedback.IsActive = false;

                // Soft delete attachments
                var attachments = await _context.FeedbackAttachments
                    .Where(a => a.FeedbackId == feedback.Id && a.IsActive)
                    .ToListAsync(cancellationToken);

                foreach (var attachment in attachments)
                {
                    attachment.IsActive = false;
                }

                // Soft delete processing records
                var processings = await _context.FeedbackProcessings
                    .Where(p => p.FeedbackId == feedback.Id && p.IsActive)
                    .ToListAsync(cancellationToken);

                foreach (var processing in processings)
                {
                    processing.IsActive = false;
                }

                // Soft delete responses
                var responses = await _context.FeedbackResponses
                    .Where(r => r.FeedbackId == feedback.Id && r.IsActive)
                    .ToListAsync(cancellationToken);

                foreach (var response in responses)
                {
                    response.IsActive = false;
                }

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                return new ApiResult
                {
                    Success = true,
                    Message = "Xóa phản ánh thành công"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new ApiResult
                {
                    Success = false,
                    Message = $"Có lỗi xảy ra khi xóa phản ánh: {ex.Message}"
                };
            }
        }
    }
}