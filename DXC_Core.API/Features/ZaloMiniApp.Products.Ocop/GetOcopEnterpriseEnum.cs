using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopEnterpriseEnum
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
            var enterprises = await _context.OcopEnterprises
                .Where(e => e.IsActive)
                .OrderBy(e => e.Name)
                .Select(e => new EnumResult<Guid>
                {
                    Value = e.PublicId,
                    Label = e.Name
                })
                .ToListAsync(cancellationToken);

            return new ApiResult<List<EnumResult<Guid>>>
            {
                Success = true,
                Data = enterprises,
                Message = $"Lấy thành công {enterprises.Count} doanh nghiệp OCOP"
            };
        }
    }
}
