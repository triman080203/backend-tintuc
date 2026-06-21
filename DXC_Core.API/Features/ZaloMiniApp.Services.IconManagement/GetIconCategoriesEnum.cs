using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIconCategoriesEnum
{
    public class Query : IRequest<ApiResult<List<EnumResult<Guid>>>>
    {
    }

    public class Handler : IRequestHandler<Query, ApiResult<List<EnumResult<Guid>>>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<List<EnumResult<Guid>>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var categories = await _context.IconCategories
                .Where(c => c.IsActive)
                .OrderBy(c => c.Name)
                .Select(c => new EnumResult<Guid>
                {
                    Value = c.PublicId,
                    Label = c.Name
                })
                .ToListAsync(cancellationToken);

            return new ApiResult<List<EnumResult<Guid>>>
            {
                Success = true,
                Data = categories,
                Message = $"Lấy thành công {categories.Count} danh mục icon"
            };
        }
    }
}
