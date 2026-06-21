using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.News.Articles;

public static class GetArticleById
{
    public class Query : IRequest<ApiResult<ArticleDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<ArticleDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<ArticleDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var article = await _context.Articles
                .Where(x => x.PublicId == request.PublicId)
                .Select(x => new ArticleDto
                {
                    PublicId = x.PublicId,
                    Title = x.Title,
                    Slug = x.Slug,
                    Summary = x.Summary,
                    Content = x.Content,
                    CoverImagePublicId = x.CoverImagePublicId,
                    CoverImageUrl = string.IsNullOrEmpty(x.CoverImagePublicId) ? null : $"/api/files/{x.CoverImagePublicId}",
                    AuthorName = x.AuthorName,
                    ViewCount = x.ViewCount,
                    PublishedAt = x.PublishedAt,
                    ThuTu = x.ThuTu,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (article == null)
            {
                return new ApiResult<ArticleDto> { Success = false, Message = "Không tìm thấy bài viết" };
            }

            return new ApiResult<ArticleDto> { Success = true, Data = article };
        }
    }
}
