using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Feedback;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class ApproveFeedbackResponse
{
    public class Command : IRequest<ApiResult>
    {
        public required int ResponseId { get; set; }
        public required bool IsApproved { get; set; }
        public string? ApprovalNote { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.ResponseId)
                .GreaterThan(0);

            RuleFor(c => c.ApprovalNote)
                .MaximumLength(500)
                .When(c => c.ApprovalNote != null);
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
                // Find response by ID
                var response = await _context.FeedbackResponses
                    .Include(r => r.Feedback)
                    .ThenInclude(f => f.CurrentStatus)
                    .FirstOrDefaultAsync(r => r.Id == request.ResponseId && r.IsActive, cancellationToken);

                if (response == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không tìm thấy phản hồi với ID được cung cấp"
                    };
                }

                // // Check if response is already processed
                // if (response.IsApproved.HasValue)
                // {
                //     return new ApiResult
                //     {
                //         Success = false,
                //         Message = "Phản hồi này đã được xử lý trước đó"
                //     };
                // }

                // Update response approval status
                response.IsApproved = request.IsApproved;
                response.ApprovedByUserPublicId = Guid.NewGuid(); // TODO: Get from current user
                response.ApprovedAt = DateTime.UtcNow;
                response.ApprovalNote = request.ApprovalNote;

                // Determine feedback status based on approval result
                var finalStatus = await _context.FeedbackStatuses
                    .FirstOrDefaultAsync(s => s.Code == (request.IsApproved ? "completed" : "in_progress"), cancellationToken);
                var processingNote = request.IsApproved 
                    ? $"Phản hồi được duyệt: {request.ApprovalNote}"
                    : $"Phản hồi bị từ chối: {request.ApprovalNote}. Phòng ban cần cập nhật lại nội dung.";
                
                if (finalStatus != null)
                {
                    // Create processing record to track approval status change
                    var processing = new Data.ZaloMiniAppContext.Models.Feedback.FeedbackProcessing
                    {
                        FeedbackId = response.Feedback.Id,
                        FromStatusId = response.Feedback.CurrentStatusId, // Current status before approval
                        ToStatusId = finalStatus.Id, // Final status after approval
                        AssignedDepartmentId = response.Feedback.AssignedDepartmentId,
                        AssignedByUserPublicId = Guid.NewGuid(), // TODO: Get from current user
                        AssignedAt = DateTime.UtcNow,
                        ProcessingNote = processingNote,
                        IsActive = true
                    };

                    _context.FeedbackProcessings.Add(processing);

                    // Update feedback status
                    response.Feedback.CurrentStatusId = finalStatus.Id;
                }

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                var statusText = request.IsApproved ? "duyệt. Phản ánh đã hoàn thành xử lý." : "từ chối. Phản ánh cần phòng ban xử lý lại.";
                return new ApiResult
                {
                    Success = true,
                    Message = $"Đã {statusText}"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new ApiResult
                {
                    Success = false,
                    Message = $"Có lỗi xảy ra khi xử lý phản hồi: {ex.Message}"
                };
            }
        }
    }
}