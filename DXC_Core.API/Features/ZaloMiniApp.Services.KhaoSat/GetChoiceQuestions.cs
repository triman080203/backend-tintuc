using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class GetChoiceQuestions
{
    public class Query : IRequest<ApiResult<List<QuestionDto>>>
    {
        public int SurveyId { get; set; }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, ApiResult<List<QuestionDto>>>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult<List<QuestionDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var exists = await _context.KhaoSats.AnyAsync(s => s.Id == request.SurveyId, cancellationToken);
            if (!exists) return new ApiResult<List<QuestionDto>> { Success = false, Message = "Khảo sát không tồn tại" };

            var items = await _context.KhaoSatCauHois
                .Where(q => q.SurveyId == request.SurveyId)
                .Include(q => q.Answers)
                .OrderBy(q => q.STT ?? int.MaxValue)
                .Select(q => new QuestionDto
                {
                    Id = q.Id,
                    NoiDung = q.NoiDung,
                    CauHoiTuLuan = q.CauHoiTuLuan,
                    STT = q.STT,
                    Answers = q.Answers
                        .OrderBy(a => a.Id)
                        .Select(a => new AnswerDto { Id = a.Id, TraLoi = a.TraLoi })
                        .ToList()
                })
                .ToListAsync(cancellationToken);

            // Chỉ giữ câu hỏi có đáp án (trắc nghiệm)
            items = items.Where(i => (i.Answers?.Count ?? 0) > 0).ToList();

            return new ApiResult<List<QuestionDto>> { Success = true, Data = items, Message = "Lấy câu hỏi trắc nghiệm thành công" };
        }
    }
}
