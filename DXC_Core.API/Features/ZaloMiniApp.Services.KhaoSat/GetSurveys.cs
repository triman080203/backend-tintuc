using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class GetSurveys
{
    public class Query : IRequest<PagedResult<SurveyDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? TenKhaoSat { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, PagedResult<SurveyDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<PagedResult<SurveyDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.KhaoSats.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.TenKhaoSat))
            {
                query = query.Where(x => x.TenKhaoSat.Contains(request.TenKhaoSat));
            }

            if (request.From.HasValue) query = query.Where(x => x.ThoiGian >= request.From.Value);
            if (request.To.HasValue) query = query.Where(x => x.ThoiGian <= request.To.Value);
            if (request.IsActive.HasValue) query = query.Where(x => x.IsActive == request.IsActive.Value);

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(s => KhaoSatMappings.ToDto(s))
                .ToListAsync(cancellationToken);

            return new PagedResult<SurveyDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách khảo sát thành công"
            };
        }
    }
}
