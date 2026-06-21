using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class TinTucUpdateCategory
{
    public class Command : IRequest<ApiResult<Guid>>
    {
        public Guid PublicId { get; set; }
        public required string Name { get; set; }
        public required string Slug { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
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
            var category = await _context.TinTucCategories.FirstOrDefaultAsync(c => c.PublicId == request.PublicId, cancellationToken);
            if (category == null)
            {
                return new ApiResult<Guid>
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục"
                };
            }

            var existingSlug = await _context.TinTucCategories.AnyAsync(c => c.Slug == request.Slug && c.PublicId != request.PublicId, cancellationToken);
            if (existingSlug)
            {
                return new ApiResult<Guid>
                {
                    Success = false,
                    Message = "Đường dẫn (Slug) đã tồn tại"
                };
            }

            category.Name = request.Name;
            category.Slug = request.Slug;
            category.Description = request.Description;
            category.DisplayOrder = request.DisplayOrder;
            category.IsActive = request.IsActive;
            category.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<Guid>
            {
                Success = true,
                Data = category.PublicId,
                Message = "Cập nhật danh mục thành công"
            };
        }
    }
}
