using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class GetRespondedUsers
{
    public class Query : IRequest<PagedResult<long>>
    {
        public int SurveyId { get; set; }
        public int? QuestionId { get; set; }
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, PagedResult<long>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<PagedResult<long>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.KhaoSatResponses
                .Where(r => r.SurveyId == request.SurveyId);

            if (request.QuestionId.HasValue)
            {
                query = query.Where(r => r.QuestionId == request.QuestionId.Value);
            }

            var userQuery = query
                .GroupBy(r => r.IDUser)
                .Select(g => g.Key);

            var total = await userQuery.CountAsync(cancellationToken);

            var users = await userQuery
                .OrderBy(id => id)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PagedResult<long>
            {
                Success = true,
                Data = users,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách người dùng đã trả lời câu hỏi trắc nghiệm thành công"
            };
        }
    }
}
