using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class ProcessFeedback
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid FeedbackPublicId { get; set; }
        public required int FromStatusId { get; set; }
        public required int ToStatusId { get; set; }
        public string? ProcessingNote { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.FeedbackPublicId)
                .NotEmpty();

            RuleFor(c => c.FromStatusId)
                .GreaterThan(0);

            RuleFor(c => c.ToStatusId)
                .GreaterThan(0);

            RuleFor(c => c.ProcessingNote)
                .MaximumLength(1000)
                .When(c => c.ProcessingNote != null);
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
                    .Include(f => f.CurrentStatus)
                    .FirstOrDefaultAsync(f => f.PublicId == request.FeedbackPublicId && f.IsActive, cancellationToken);

                if (feedback == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không tìm thấy phản ánh với ID được cung cấp"
                    };
                }

                // Validate current status
                if (feedback.CurrentStatusId != request.FromStatusId)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Trạng thái hiện tại của phản ánh không khớp với trạng thái được yêu cầu"
                    };
                }

                // Validate new status
                var toStatus = await _context.FeedbackStatuses
                    .FirstOrDefaultAsync(s => s.Id == request.ToStatusId, cancellationToken);

                if (toStatus == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Trạng thái mới không hợp lệ"
                    };
                }

                // Create processing record
                var processing = new Data.ZaloMiniAppContext.Models.Feedback.FeedbackProcessing
                {
                    FeedbackId = feedback.Id,
                    FromStatusId = request.FromStatusId,
                    ToStatusId = request.ToStatusId,
                    AssignedDepartmentId = feedback.AssignedDepartmentId,
                    AssignedByUserPublicId = Guid.NewGuid(), // TODO: Get from current user
                    AssignedAt = DateTime.UtcNow,
                    ProcessingNote = request.ProcessingNote,
                    IsActive = true
                };

                _context.FeedbackProcessings.Add(processing);

                // Update feedback status
                feedback.CurrentStatusId = request.ToStatusId;
                
                // If returning to submitted, clear assigned department to allow re-dispatch
                if (toStatus.Code == "submitted")
                {
                    feedback.AssignedDepartmentId = null;
                }

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                return new ApiResult
                {
                    Success = true,
                    Message = $"Đã cập nhật trạng thái phản ánh thành '{toStatus.Name}' thành công"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new ApiResult
                {
                    Success = false,
                    Message = $"Có lỗi xảy ra khi xử lý phản ánh: {ex.Message}"
                };
            }
        }
    }
}
