using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.News.Articles;

public static class GetArticles
{
    public class Query : IRequest<PagedResult<ArticleDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current).GreaterThan(0);
            RuleFor(x => x.PageSize).GreaterThan(0).LessThanOrEqualTo(100);
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<ArticleDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ArticleDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Articles.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x => x.Title.Contains(request.Keyword) || (x.Summary != null && x.Summary.Contains(request.Keyword)));
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == request.IsActive.Value);
            }

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(x => x.ThuTu)
                .ThenByDescending(x => x.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
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
                .ToListAsync(cancellationToken);

            return new PagedResult<ArticleDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách thành công"
            };
        }
    }
}
