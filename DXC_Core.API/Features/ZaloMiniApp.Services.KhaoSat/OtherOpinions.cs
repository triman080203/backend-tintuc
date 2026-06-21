using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class GetOtherOpinions
{
    public class Query : IRequest<PagedResult<OtherOpinionDto>>
    {
        public int SurveyId { get; set; }
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, PagedResult<OtherOpinionDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<PagedResult<OtherOpinionDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.KhaoSatYKienKhacs.Where(x => x.SurveyId == request.SurveyId);
            var total = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new OtherOpinionDto { Id = x.Id, UserID = x.UserID, YKienKhac = x.YKienKhac, CreatedAt = x.CreatedAt })
                .ToListAsync(cancellationToken);
            return new PagedResult<OtherOpinionDto> { Success = true, Data = items, Total = total, Current = request.Current, PageSize = request.PageSize, Message = "Lấy ý kiến khác thành công" };
        }
    }
}

public static class InsertOtherOpinion
{
    public class Command : IRequest<ApiResult<OtherOpinionDto>>
    {
        public int SurveyId { get; set; }
        public long UserID { get; set; }
        public required string YKienKhac { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<OtherOpinionDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult<OtherOpinionDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var exists = await _context.KhaoSats.AnyAsync(s => s.Id == request.SurveyId, cancellationToken);
            if (!exists) return new ApiResult<OtherOpinionDto> { Success = false, Message = "Khảo sát không tồn tại" };
            var y = new OtherOpinion { SurveyId = request.SurveyId, UserID = request.UserID.ToString(), YKienKhac = request.YKienKhac, CreatedAt = DateTime.UtcNow };
            _context.KhaoSatYKienKhacs.Add(y);
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult<OtherOpinionDto> { Success = true, Data = new OtherOpinionDto { Id = y.Id, UserID = y.UserID, YKienKhac = y.YKienKhac, CreatedAt = y.CreatedAt }, Message = "Ghi nhận ý kiến khác thành công" };
        }
    }
}
