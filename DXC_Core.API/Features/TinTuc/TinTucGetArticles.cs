using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class TinTucGetArticles
{
    public class Query : IRequest<PagedResult<TinTucArticleDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string? Keyword { get; set; }
        public int? CategoryId { get; set; }
        public int? CurrentStatusId { get; set; }
        public bool? IsPublic { get; set; }
        public bool? IsActive { get; set; }

        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<TinTucArticleDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<TinTucArticleDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.TinTucArticles
                .Include(a => a.CurrentStatus)
                .Include(a => a.Category)
                .AsQueryable();

            if (request.IsActive.HasValue)
            {
                query = query.Where(a => a.IsActive == request.IsActive.Value);
            }
            else
            {
                // Default to active
                query = query.Where(a => a.IsActive);
            }

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(a => a.Title.Contains(request.Keyword) || (a.Summary != null && a.Summary.Contains(request.Keyword)));
            }

            if (request.CategoryId.HasValue)
            {
                query = query.Where(a => a.CategoryId == request.CategoryId.Value);
            }

            if (request.CurrentStatusId.HasValue)
            {
                query = query.Where(a => a.CurrentStatusId == request.CurrentStatusId.Value);
            }

            if (request.IsPublic.HasValue)
            {
                query = query.Where(a => a.IsPublic == request.IsPublic.Value);
            }

            if (request.CreatedFrom.HasValue)
            {
                query = query.Where(a => a.CreatedAt >= request.CreatedFrom.Value);
            }

            if (request.CreatedTo.HasValue)
            {
                query = query.Where(a => a.CreatedAt <= request.CreatedTo.Value);
            }

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(a => new TinTucArticleDto
                {
                    Id = a.Id,
                    PublicId = a.PublicId,
                    Title = a.Title,
                    Summary = a.Summary,
                    ThumbnailUrl = a.ThumbnailUrl,
                    CategoryId = a.CategoryId,
                    CategoryName = a.Category!.Name,
                    CurrentStatusId = a.CurrentStatusId,
                    CurrentStatusCode = a.CurrentStatus!.Code,
                    CurrentStatusName = a.CurrentStatus!.Name,
                    CurrentStatusColor = a.CurrentStatus!.Color,
                    AuthorUserPublicId = a.AuthorUserPublicId,
                    AuthorName = a.AuthorName,
                    ViewCount = a.ViewCount,
                    IsPublic = a.IsPublic,
                    PublishedAt = a.PublishedAt,
                    IsActive = a.IsActive,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<TinTucArticleDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = $"Tìm thấy {total} tin bài"
            };
        }
    }
}
