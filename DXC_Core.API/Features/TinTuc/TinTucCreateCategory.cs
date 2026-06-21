using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.TinTuc;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class TinTucCreateCategory
{
    public class Command : IRequest<ApiResult<Guid>>
    {
        public required string Name { get; set; }
        public required string Slug { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;
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
            var existingSlug = await _context.TinTucCategories.AnyAsync(c => c.Slug == request.Slug, cancellationToken);
            if (existingSlug)
            {
                return new ApiResult<Guid>
                {
                    Success = false,
                    Message = "Đường dẫn (Slug) đã tồn tại"
                };
            }

            var category = new ArticleCategory
            {
                Name = request.Name,
                Slug = request.Slug,
                Description = request.Description,
                DisplayOrder = request.DisplayOrder,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.TinTucCategories.Add(category);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<Guid>
            {
                Success = true,
                Data = category.PublicId,
                Message = "Tạo danh mục thành công"
            };
        }
    }
}
