using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class TinTucDeleteCategory
{
    public class Command : IRequest<ApiResult<bool>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, ApiResult<bool>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<bool>> Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await _context.TinTucCategories
                .Include(c => c.Articles)
                .FirstOrDefaultAsync(c => c.PublicId == request.PublicId, cancellationToken);

            if (category == null)
            {
                return new ApiResult<bool>
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục"
                };
            }

            if (category.Articles.Any())
            {
                return new ApiResult<bool>
                {
                    Success = false,
                    Message = "Không thể xóa danh mục đã có tin bài. Vui lòng chuyển các tin bài sang danh mục khác trước."
                };
            }

            _context.TinTucCategories.Remove(category);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<bool>
            {
                Success = true,
                Data = true,
                Message = "Xóa danh mục thành công"
            };
        }
    }
}
