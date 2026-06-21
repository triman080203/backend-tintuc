using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.TinTuc;

public static class TinTucGetCategoryById
{
    public class Query : IRequest<ApiResult<TinTucCategoryDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<TinTucCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<TinTucCategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var category = await _context.TinTucCategories
                .Where(c => c.PublicId == request.PublicId)
                .Select(c => new TinTucCategoryDto
                {
                    Id = c.Id,
                    PublicId = c.PublicId,
                    Name = c.Name,
                    Slug = c.Slug,
                    Description = c.Description,
                    DisplayOrder = c.DisplayOrder,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (category == null)
            {
                return new ApiResult<TinTucCategoryDto>
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục"
                };
            }

            return new ApiResult<TinTucCategoryDto>
            {
                Success = true,
                Data = category
            };
        }
    }
}
