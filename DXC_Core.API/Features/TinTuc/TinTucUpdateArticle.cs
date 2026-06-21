using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.TinTuc;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class TinTucUpdateArticle
{
    public class Command : IRequest<ApiResult>
    {
        public Guid PublicId { get; set; }
        public required string Title { get; set; }
        public string? Summary { get; set; }
        public required string Content { get; set; }
        public string? ThumbnailUrl { get; set; }
        public int CategoryId { get; set; }
        public string? Tags { get; set; }
        public string? AuthorName { get; set; }
        
        public List<AttachmentInput>? Attachments { get; set; }
    }

    public class AttachmentInput
    {
        public Guid FilePublicId { get; set; }
        public required string FileName { get; set; }
        public long FileSize { get; set; }
        public string? FileType { get; set; }
        public int SortOrder { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
            RuleFor(x => x.Title).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Content).NotEmpty();
            RuleFor(x => x.CategoryId).GreaterThan(0);
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
                .Include(a => a.Attachments)
                .FirstOrDefaultAsync(a => a.PublicId == request.PublicId && a.IsActive, cancellationToken);

            if (article == null)
            {
                return new ApiResult { Success = false, Message = "Không tìm thấy bài viết" };
            }

            // Only allow update if draft or returned
            if (article.CurrentStatus?.Code != "draft" && article.CurrentStatus?.Code != "returned")
            {
                return new ApiResult { Success = false, Message = "Chỉ được phép cập nhật bài viết ở trạng thái Bản nháp hoặc Bị trả lại" };
            }

            var categoryExists = await _context.TinTucCategories.AnyAsync(c => c.Id == request.CategoryId && c.IsActive, cancellationToken);
            if (!categoryExists)
            {
                return new ApiResult { Success = false, Message = "Danh mục không tồn tại hoặc đã bị vô hiệu hóa" };
            }

            article.Title = request.Title;
            article.Summary = request.Summary;
            article.Content = request.Content;
            article.ThumbnailUrl = request.ThumbnailUrl;
            article.CategoryId = request.CategoryId;
            article.Tags = request.Tags;
            article.AuthorName = request.AuthorName;
            article.UpdatedAt = DateTime.UtcNow;

            // Handle Attachments
            // Deactivate all old attachments
            foreach (var existing in article.Attachments)
            {
                existing.IsActive = false;
            }

            // Add new attachments
            if (request.Attachments != null && request.Attachments.Any())
            {
                foreach (var a in request.Attachments)
                {
                    article.Attachments.Add(new ArticleAttachment
                    {
                        PublicId = Guid.NewGuid(),
                        FilePublicId = a.FilePublicId,
                        FileName = a.FileName,
                        FileSize = a.FileSize,
                        FileType = a.FileType,
                        SortOrder = a.SortOrder,
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true
                    });
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Cập nhật bài viết thành công"
            };
        }
    }
}
