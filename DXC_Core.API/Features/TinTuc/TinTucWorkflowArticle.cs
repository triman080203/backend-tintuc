using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.TinTuc;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class TinTucWorkflowArticle
{
    public class Command : IRequest<ApiResult>
    {
        public Guid PublicId { get; set; }
        public required string Action { get; set; } // submit, approve, return, publish, archive
        public string? Note { get; set; }
        public string? ActorName { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
            RuleFor(x => x.Action).NotEmpty()
                .Must(a => new[] { "submit", "approve", "return", "publish", "archive" }.Contains(a.ToLower()))
                .WithMessage("Action không hợp lệ. Chỉ chấp nhận: submit, approve, return, publish, archive");
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
            var article = await _context.TinTucArticles
                .Include(a => a.CurrentStatus)
                .Include(a => a.ProcessingHistories)
                .FirstOrDefaultAsync(a => a.PublicId == request.PublicId && a.IsActive, cancellationToken);

            if (article == null)
            {
                return new ApiResult { Success = false, Message = "Không tìm thấy bài viết" };
            }

            var statuses = await _context.TinTucStatuses.Where(s => s.IsActive).ToListAsync(cancellationToken);
            var currentStatusCode = article.CurrentStatus?.Code;
            string targetStatusCode = "";
            string actionName = request.Action.ToLower();

            // Validate business rules
            switch (actionName)
            {
                case "submit":
                    if (currentStatusCode != "draft" && currentStatusCode != "returned")
                        return new ApiResult { Success = false, Message = "Chỉ có thể Gửi duyệt khi ở trạng thái Bản nháp hoặc Bị trả lại" };
                    targetStatusCode = "pending_review";
                    break;
                case "approve":
                    if (currentStatusCode != "pending_review")
                        return new ApiResult { Success = false, Message = "Chỉ có thể Phê duyệt khi bài viết đang Chờ duyệt" };
                    targetStatusCode = "approved";
                    break;
                case "return":
                    if (currentStatusCode != "pending_review" && currentStatusCode != "approved")
                        return new ApiResult { Success = false, Message = "Chỉ có thể Trả lại khi bài viết đang Chờ duyệt hoặc Đã duyệt" };
                    if (string.IsNullOrWhiteSpace(request.Note))
                        return new ApiResult { Success = false, Message = "Vui lòng nhập lý do trả lại bài viết (Note)" };
                    targetStatusCode = "returned";
                    break;
                case "publish":
                    if (currentStatusCode != "approved")
                        return new ApiResult { Success = false, Message = "Chỉ có thể Xuất bản khi bài viết Đã duyệt" };
                    targetStatusCode = "published";
                    break;
                case "archive":
                    if (currentStatusCode != "published")
                        return new ApiResult { Success = false, Message = "Chỉ có thể Thu hồi khi bài viết Đã xuất bản" };
                    targetStatusCode = "archived";
                    break;
            }

            var targetStatus = statuses.FirstOrDefault(s => s.Code == targetStatusCode);
            if (targetStatus == null)
            {
                return new ApiResult { Success = false, Message = $"Lỗi hệ thống: Không tìm thấy trạng thái {targetStatusCode}" };
            }

            var oldStatusId = article.CurrentStatusId;

            // Apply state changes
            article.CurrentStatusId = targetStatus.Id;
            article.UpdatedAt = DateTime.UtcNow;

            // Special actions
            if (actionName == "publish")
            {
                article.IsPublic = true;
                article.PublishedAt = DateTime.UtcNow;
            }
            else if (actionName == "archive")
            {
                article.IsPublic = false;
            }
            else if (actionName == "return" || actionName == "draft")
            {
                article.IsPublic = false;
            }

            // Create history
            article.ProcessingHistories.Add(new ArticleProcessingHistory
            {
                PublicId = Guid.NewGuid(),
                FromStatusId = oldStatusId,
                ToStatusId = targetStatus.Id,
                Action = actionName,
                ActorName = request.ActorName,
                Note = request.Note,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            });

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xử lý thành công"
            };
        }
    }
}
