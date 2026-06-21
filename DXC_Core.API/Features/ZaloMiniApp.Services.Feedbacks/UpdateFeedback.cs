using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class UpdateFeedback
{
    public class Command : IRequest<ApiResult<FeedbackAdminDto>>
    {
        public required Guid PublicId { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Location { get; set; }
        public bool? IsPublic { get; set; }

        // Admin only fields
        public int? CurrentStatusId { get; set; }
        public Guid? AssignedDepartmentPublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.PublicId)
                .NotEmpty();

            RuleFor(c => c.Title)
                .MaximumLength(500)
                .When(c => c.Title != null);

            RuleFor(c => c.Content)
                .NotEmpty()
                .When(c => c.Content != null);

            RuleFor(c => c.FullName)
                .MaximumLength(200)
                .When(c => c.FullName != null);

            RuleFor(c => c.PhoneNumber)
                .MaximumLength(20)
                .When(c => c.PhoneNumber != null);

            RuleFor(c => c.Location)
                .MaximumLength(500)
                .When(c => c.Location != null);

            RuleFor(c => c.CurrentStatusId)
                .GreaterThan(0)
                .When(c => c.CurrentStatusId.HasValue);

            RuleFor(c => c.AssignedDepartmentPublicId)
                .NotEmpty()
                .When(c => c.AssignedDepartmentPublicId.HasValue);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<FeedbackAdminDto>>
    {
        private readonly ZaloMiniAppDbContext _context;
        private readonly CoreDbContext _coreContext;

        public Handler(ZaloMiniAppDbContext context, CoreDbContext coreContext)
        {
            _context = context;
            _coreContext = coreContext;
        }

        public async Task<ApiResult<FeedbackAdminDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

            try
            {
                // Find feedback by PublicId
                var feedback = await _context.Feedbacks
                    .Include(f => f.CurrentStatus)
                    .FirstOrDefaultAsync(f => f.PublicId == request.PublicId && f.IsActive, cancellationToken);

                if (feedback == null)
                {
                    return new ApiResult<FeedbackAdminDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy phản ánh với ID được cung cấp"
                    };
                }

                // Validate status change if provided
                if (request.CurrentStatusId.HasValue && request.CurrentStatusId.Value != feedback.CurrentStatusId)
                {
                    var newStatus = await _context.FeedbackStatuses
                        .FirstOrDefaultAsync(s => s.Id == request.CurrentStatusId.Value, cancellationToken);

                    if (newStatus == null)
                    {
                        return new ApiResult<FeedbackAdminDto>
                        {
                            Success = false,
                            Message = "Trạng thái mới không hợp lệ"
                        };
                    }
                }

                // Validate department change if provided (from Common.Department in CoreContext)
                if (request.AssignedDepartmentPublicId.HasValue)
                {
                    var newDepartment = await _coreContext.Departments
                        .FirstOrDefaultAsync(d => d.PublicId == request.AssignedDepartmentPublicId.Value && d.IsActive, cancellationToken);

                    if (newDepartment == null)
                    {
                        return new ApiResult<FeedbackAdminDto>
                        {
                            Success = false,
                            Message = "Phòng ban mới không hợp lệ"
                        };
                    }
                }

                // Update feedback fields
                if (!string.IsNullOrWhiteSpace(request.Title))
                    feedback.Title = request.Title;

                if (!string.IsNullOrWhiteSpace(request.Content))
                    feedback.Content = request.Content;

                if (!string.IsNullOrWhiteSpace(request.FullName))
                    feedback.FullName = request.FullName;

                if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
                    feedback.PhoneNumber = request.PhoneNumber;

                if (!string.IsNullOrWhiteSpace(request.Location))
                    feedback.Location = request.Location;

                if (request.IsPublic.HasValue)
                    feedback.IsPublic = request.IsPublic.Value;

                if (request.CurrentStatusId.HasValue)
                    feedback.CurrentStatusId = request.CurrentStatusId.Value;

                if (request.AssignedDepartmentPublicId.HasValue)
                {
                    // Look up the department from Common.Department in CoreContext
                    var department = await _coreContext.Departments
                        .FirstOrDefaultAsync(d => d.PublicId == request.AssignedDepartmentPublicId.Value && d.IsActive, cancellationToken);
                    
                    if (department != null)
                        feedback.AssignedDepartmentId = department.Id;
                }

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                // Return updated feedback
                var assignedDept = feedback.AssignedDepartmentId.HasValue
                    ? await _coreContext.Departments.FirstOrDefaultAsync(d => d.Id == feedback.AssignedDepartmentId.Value, cancellationToken)
                    : null;

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
                    CurrentStatusCode = feedback.CurrentStatus.Code,
                    CurrentStatusName = feedback.CurrentStatus.Name,
                    CurrentStatusColor = feedback.CurrentStatus.Color,
                    AssignedDepartmentId = feedback.AssignedDepartmentId,
                    AssignedDepartmentPublicId = assignedDept?.PublicId,
                    AssignedDepartmentCode = assignedDept?.Code,
                    AssignedDepartmentName = assignedDept?.Name,
                    IsActive = feedback.IsActive,
                    CreatedAt = feedback.CreatedAt,
                    UpdatedAt = feedback.UpdatedAt,
                    AttachmentCount = await _context.FeedbackAttachments.CountAsync(a => a.FeedbackId == feedback.Id && a.IsActive, cancellationToken),
                    ProcessingCount = await _context.FeedbackProcessings.CountAsync(p => p.FeedbackId == feedback.Id && p.IsActive, cancellationToken),
                    ResponseCount = await _context.FeedbackResponses.CountAsync(r => r.FeedbackId == feedback.Id && r.IsActive, cancellationToken)
                };

                return new ApiResult<FeedbackAdminDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Cập nhật phản ánh thành công"
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                return new ApiResult<FeedbackAdminDto>
                {
                    Success = false,
                    Message = $"Có lỗi xảy ra khi cập nhật phản ánh: {ex.Message}"
                };
            }
        }
    }
}