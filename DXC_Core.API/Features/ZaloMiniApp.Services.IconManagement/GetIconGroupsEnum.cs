using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class GetIconGroupsEnum
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
            var groups = await _context.IconGroups
                .Where(g => g.IsActive)
                .OrderBy(g => g.Name)
                .Select(g => new EnumResult<Guid>
                {
                    Value = g.PublicId,
                    Label = g.Name
                })
                .ToListAsync(cancellationToken);

            return new ApiResult<List<EnumResult<Guid>>>
            {
                Success = true,
                Data = groups,
                Message = $"Lấy thành công {groups.Count} nhóm icon"
            };
        }
    }
}
