using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.TinTuc;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class CreateArticle
{
    public class Command : IRequest<ApiResult<Guid>>
    {
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
            RuleFor(x => x.Title).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Content).NotEmpty();
            RuleFor(x => x.CategoryId).GreaterThan(0);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<Guid>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<Guid>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Verify Category
            var categoryExists = await _context.TinTucCategories.AnyAsync(c => c.Id == request.CategoryId && c.IsActive, cancellationToken);
            if (!categoryExists)
            {
                return new ApiResult<Guid> { Success = false, Message = "Danh mục không tồn tại hoặc đã bị vô hiệu hóa" };
            }

            // Get Draft Status (Code = 'draft')
            var draftStatus = await _context.TinTucStatuses.FirstOrDefaultAsync(s => s.Code == "draft", cancellationToken);
            if (draftStatus == null)
            {
                return new ApiResult<Guid> { Success = false, Message = "Lỗi hệ thống: Không tìm thấy trạng thái Bản nháp" };
            }

            var article = new Article
            {
                PublicId = Guid.NewGuid(),
                Title = request.Title,
                Summary = request.Summary,
                Content = request.Content,
                ThumbnailUrl = request.ThumbnailUrl,
                CategoryId = request.CategoryId,
                Tags = request.Tags,
                AuthorName = request.AuthorName,
                CurrentStatusId = draftStatus.Id,
                Slug = request.Title.ToLower().Replace(" ", "-"),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            // Add Attachments if any
            if (request.Attachments != null && request.Attachments.Any())
            {
                article.Attachments = request.Attachments.Select(a => new ArticleAttachment
                {
                    PublicId = Guid.NewGuid(),
                    FilePublicId = a.FilePublicId,
                    FileName = a.FileName,
                    FileSize = a.FileSize,
                    FileType = a.FileType,
                    SortOrder = a.SortOrder,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                }).ToList();
            }

            // Add Processing History for Creation
            article.ProcessingHistories = new List<ArticleProcessingHistory>
            {
                new ArticleProcessingHistory
                {
                    PublicId = Guid.NewGuid(),
                    FromStatusId = draftStatus.Id,
                    ToStatusId = draftStatus.Id,
                    Action = "create",
                    ActorName = request.AuthorName, // Or get from Context User
                    Note = "Tạo mới bản nháp",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                }
            };

            _context.TinTucArticles.Add(article);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<Guid>
            {
                Success = true,
                Message = "Tạo bản nháp thành công",
                Data = article.PublicId
            };
        }
    }
}
