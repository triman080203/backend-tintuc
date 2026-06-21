using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

public static class GetTotalUsers
{
    public class Query : IRequest<PagedResult<TotalUserDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<TotalUserDto>>
    {
        private readonly ZaloMiniAppDbContext _db;

        public Handler(ZaloMiniAppDbContext db)
        {
            _db = db;
        }

        public async Task<PagedResult<TotalUserDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _db.TotalUsers.AsNoTracking().AsQueryable();
            
            // Apply search filters
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var s = request.Search.Trim();
                query = query.Where(x => x.Username.Contains(s) || x.UserId.Contains(s));
            }
            
            // Filter by phone number if provided
            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                var phone = request.PhoneNumber.Trim();
                query = query.Where(x => x.PhoneNumber != null && x.PhoneNumber.Contains(phone));
            }

            var total = await query.LongCountAsync(cancellationToken);
            var items = await query
                .OrderBy(x => x.Id)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new TotalUserDto
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    Username = x.Username,
                    Avatar = x.Avatar,
                    PhanQuyen = x.PhanQuyen,
                    PhoneNumber = x.PhoneNumber,
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<TotalUserDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
            };
        }
    }
}
