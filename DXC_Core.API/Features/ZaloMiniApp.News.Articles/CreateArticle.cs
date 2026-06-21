using FluentValidation;
using MediatR;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.News;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.News.Articles;

public static class CreateArticle
{
    public class Command : IRequest<ApiResult<ArticleDto>>
    {
        public string Title { get; set; } = null!;
        public string? Slug { get; set; }
        public string? Summary { get; set; }
        public string? Content { get; set; }
        public string? CoverImagePublicId { get; set; }
        public string? AuthorName { get; set; }
        public DateTime? PublishedAt { get; set; }
        public int ThuTu { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Title).NotEmpty().MaximumLength(500);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<ArticleDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<ArticleDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var article = new Article
            {
                Title = request.Title,
                Slug = request.Slug ?? request.Title.ToLower().Replace(" ", "-"),
                Summary = request.Summary,
                Content = request.Content,
                CoverImagePublicId = request.CoverImagePublicId,
                AuthorName = request.AuthorName,
                PublishedAt = request.PublishedAt ?? DateTime.UtcNow,
                ThuTu = request.ThuTu,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Articles.Add(article);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<ArticleDto>
            {
                Success = true,
                Message = "Tạo bài viết thành công",
                Data = new ArticleDto { PublicId = article.PublicId, Title = article.Title }
            };
        }
    }
}
