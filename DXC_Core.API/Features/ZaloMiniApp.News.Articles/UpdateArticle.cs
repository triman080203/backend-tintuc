using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.News.Articles;

public static class UpdateArticle
{
    public class Command : IRequest<ApiResult<ArticleDto>>
    {
        public Guid PublicId { get; set; }
        public string Title { get; set; } = null!;
        public string? Slug { get; set; }
        public string? Summary { get; set; }
        public string? Content { get; set; }
        public string? CoverImagePublicId { get; set; }
        public string? AuthorName { get; set; }
        public DateTime? PublishedAt { get; set; }
        public int ThuTu { get; set; }
        public bool IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
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
            var article = await _context.Articles.FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);
            
            if (article == null)
            {
                return new ApiResult<ArticleDto> { Success = false, Message = "Không tìm thấy bài viết" };
            }

            article.Title = request.Title;
            article.Slug = request.Slug;
            article.Summary = request.Summary;
            article.Content = request.Content;
            article.CoverImagePublicId = request.CoverImagePublicId;
            article.AuthorName = request.AuthorName;
            article.PublishedAt = request.PublishedAt;
            article.ThuTu = request.ThuTu;
            article.IsActive = request.IsActive;
            article.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<ArticleDto>
            {
                Success = true,
                Message = "Cập nhật bài viết thành công"
            };
        }
    }
}
