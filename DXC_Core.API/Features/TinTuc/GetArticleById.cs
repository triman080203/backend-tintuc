using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class GetArticleById
{
    public class Query : IRequest<ApiResult<ArticleDetailDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<ArticleDetailDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<ArticleDetailDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var article = await _context.TinTucArticles
                .Include(a => a.CurrentStatus)
                .Include(a => a.Category)
                .Include(a => a.Attachments.Where(at => at.IsActive))
                .Include(a => a.ProcessingHistories.Where(p => p.IsActive))
                    .ThenInclude(p => p.FromStatus)
                .Include(a => a.ProcessingHistories.Where(p => p.IsActive))
                    .ThenInclude(p => p.ToStatus)
                .FirstOrDefaultAsync(a => a.PublicId == request.PublicId && a.IsActive, cancellationToken);

            if (article == null)
            {
                return new ApiResult<ArticleDetailDto>
                {
                    Success = false,
                    Message = "Không tìm thấy bài viết"
                };
            }

            var dto = new ArticleDetailDto
            {
                Id = article.Id,
                PublicId = article.PublicId,
                Title = article.Title,
                Summary = article.Summary,
                Content = article.Content,
                ThumbnailUrl = article.ThumbnailUrl,
                CategoryId = article.CategoryId,
                CategoryName = article.Category?.Name,
                CurrentStatusId = article.CurrentStatusId,
                CurrentStatusCode = article.CurrentStatus?.Code,
                CurrentStatusName = article.CurrentStatus?.Name,
                CurrentStatusColor = article.CurrentStatus?.Color,
                AuthorUserPublicId = article.AuthorUserPublicId,
                AuthorName = article.AuthorName,
                EditorUserPublicId = article.EditorUserPublicId,
                Tags = article.Tags,
                Slug = article.Slug,
                ViewCount = article.ViewCount,
                IsPublic = article.IsPublic,
                PublishedAt = article.PublishedAt,
                IsActive = article.IsActive,
                CreatedAt = article.CreatedAt,
                UpdatedAt = article.UpdatedAt,
                Attachments = article.Attachments.OrderBy(a => a.SortOrder).Select(a => new ArticleAttachmentDto
                {
                    Id = a.Id,
                    PublicId = a.PublicId,
                    FilePublicId = a.FilePublicId,
                    FileName = a.FileName,
                    FileSize = a.FileSize,
                    FileType = a.FileType,
                    SortOrder = a.SortOrder,
                    CreatedAt = a.CreatedAt
                }).ToList(),
                ProcessingHistories = article.ProcessingHistories.OrderByDescending(p => p.CreatedAt).Select(p => new ArticleProcessingHistoryDto
                {
                    Id = p.Id,
                    PublicId = p.PublicId,
                    FromStatusId = p.FromStatusId,
                    FromStatusCode = p.FromStatus?.Code,
                    FromStatusName = p.FromStatus?.Name,
                    ToStatusId = p.ToStatusId,
                    ToStatusCode = p.ToStatus?.Code,
                    ToStatusName = p.ToStatus?.Name,
                    Action = p.Action,
                    ActorUserPublicId = p.ActorUserPublicId,
                    ActorName = p.ActorName,
                    Note = p.Note,
                    CreatedAt = p.CreatedAt
                }).ToList()
            };

            return new ApiResult<ArticleDetailDto>
            {
                Success = true,
                Data = dto
            };
        }
    }
}
