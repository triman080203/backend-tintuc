using System.Security.Claims;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class AssignFeedback
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid FeedbackPublicId { get; set; }
        public required Guid DepartmentPublicId { get; set; }
        public required int ToStatusId { get; set; }
        public string? ProcessingNote { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.FeedbackPublicId)
                .NotEmpty();

            RuleFor(c => c.DepartmentPublicId)
                .NotEmpty();

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
        private readonly CoreDbContext _coreContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public Handler(ZaloMiniAppDbContext context, CoreDbContext coreContext, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _coreContext = coreContext;
            _httpContextAccessor = httpContextAccessor;
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

                // Validate department (from Common.Department in CoreContext)
                var department = await _coreContext.Departments
                    .FirstOrDefaultAsync(d => d.PublicId == request.DepartmentPublicId && d.IsActive, cancellationToken);

                if (department == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Phòng ban không hợp lệ"
                    };
                }

                // Validate status
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

                // Get current user's PublicId from JWT token
                var userIdString = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
                Guid? assignedByUserPublicId = null;

                if (!string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out var userId))
                {
                    // Get user's PublicId from database
                    assignedByUserPublicId = await _coreContext.Users
                        .AsNoTracking()
                        .Where(u => u.Id == userId)
                        .Select(u => u.PublicId)
                        .FirstOrDefaultAsync(cancellationToken);
                }

                // Create processing record
                var processing = new Data.ZaloMiniAppContext.Models.Feedback.FeedbackProcessing
                {
                    FeedbackId = feedback.Id,
                    FromStatusId = feedback.CurrentStatusId,
                    ToStatusId = request.ToStatusId,
                    AssignedDepartmentId = department.Id,
                    AssignedByUserPublicId = assignedByUserPublicId,
                    AssignedAt = DateTime.UtcNow,
                    ProcessingNote = request.ProcessingNote,
                    IsActive = true
                };

                _context.FeedbackProcessings.Add(processing);

                // Update feedback status and department
                feedback.CurrentStatusId = request.ToStatusId;
                feedback.AssignedDepartmentId = department.Id;

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                return new ApiResult
                {
                    Success = true,
                    Message = $"Đã điều phối phản ánh cho phòng ban {department.Name} thành công"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new ApiResult
                {
                    Success = false,
                    Message = $"Có lỗi xảy ra khi điều phối phản ánh: {ex.Message}"
                };
            }
        }
    }
}