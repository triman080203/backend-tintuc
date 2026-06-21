using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class CheckResponseKhaoSat
{
    public class Command : IRequest<ApiResult>
    {
        public int SurveyId { get; set; }
        public long IDUser { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var exists = await _context.KhaoSatResponses.AnyAsync(r => r.SurveyId == request.SurveyId && r.IDUser == request.IDUser, cancellationToken);
            if (exists) return new ApiResult { Success = false, Message = "Người dùng đã tham gia khảo sát" };
            return new ApiResult { Success = true, Message = "Chưa tham gia khảo sát" };
        }
    }
}

public static class ResponseKhaoSat
{
    public class Command : IRequest<ApiResult>
    {
        public int SurveyId { get; set; }
        public long IDUser { get; set; }
        public required List<int> CauHoi { get; set; }
        public required List<int> DapAn { get; set; }
        public string? HoTen { get; set; }
        public string? DiaChi { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            if (request.CauHoi.Count != request.DapAn.Count) return new ApiResult { Success = false, Message = "Danh sách câu hỏi và đáp án không khớp" };
            var surveyExists = await _context.KhaoSats.AnyAsync(s => s.Id == request.SurveyId, cancellationToken);
            if (!surveyExists) return new ApiResult { Success = false, Message = "Khảo sát không tồn tại" };
            for (int i = 0; i < request.CauHoi.Count; i++)
            {
                var qId = request.CauHoi[i];
                var aId = request.DapAn[i];
                var response = new SurveyResponse
                {
                    SurveyId = request.SurveyId,
                    IDUser = request.IDUser,
                    QuestionId = qId,
                    AnswerId = aId,
                    HoTen = request.HoTen,
                    DiaChi = request.DiaChi,
                    CreatedAt = DateTime.UtcNow
                };
                _context.KhaoSatResponses.Add(response);
            }
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult { Success = true, Message = "Ghi nhận phản hồi khảo sát thành công" };
        }
    }
}

public static class SubmitEssayResponses
{
    public class EssayItem
    {
        public int EssayQuestionId { get; set; }
        public required string Content { get; set; }
    }

    public class Command : IRequest<ApiResult>
    {
        public int SurveyId { get; set; }
        public long IDUser { get; set; }
        public required List<EssayItem> Items { get; set; }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            if (request.Items == null || request.Items.Count == 0)
            {
                return new ApiResult { Success = false, Message = "Danh sách bài tự luận trống" };
            }

            var surveyExists = await _context.KhaoSats.AnyAsync(s => s.Id == request.SurveyId, cancellationToken);
            if (!surveyExists) return new ApiResult { Success = false, Message = "Khảo sát không tồn tại" };

            var questionIds = request.Items.Select(i => i.EssayQuestionId).ToList();
            var validQuestions = await _context.KhaoSatTuLuans
                .Where(q => q.SurveyId == request.SurveyId && questionIds.Contains(q.Id))
                .Select(q => q.Id)
                .ToListAsync(cancellationToken);
            var invalid = questionIds.Except(validQuestions).ToList();
            if (invalid.Count > 0)
            {
                return new ApiResult { Success = false, Message = "Câu hỏi tự luận không hợp lệ trong khảo sát" };
            }

            foreach (var item in request.Items)
            {
                _context.KhaoSatEssayResponses.Add(new EssayResponse
                {
                    SurveyId = request.SurveyId,
                    IDUser = request.IDUser,
                    EssayQuestionId = item.EssayQuestionId,
                    Content = item.Content,
                    CreatedAt = DateTime.UtcNow
                });
            }
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult { Success = true, Message = "Ghi nhận trả lời tự luận thành công" };
        }
    }
}
public static class ThongKeKhaoSat
{
    public class Query : IRequest<ApiResult<object>>
    {
        public int SurveyId { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, ApiResult<object>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<ApiResult<object>> Handle(Query request, CancellationToken cancellationToken)
        {
            var survey = await _context.KhaoSats
                .Include(s => s.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(s => s.Id == request.SurveyId, cancellationToken);
            if (survey == null) return new ApiResult<object> { Success = false, Message = "Khảo sát không tồn tại" };

            var stats = await _context.KhaoSatResponses
                .Where(r => r.SurveyId == request.SurveyId)
                .GroupBy(r => new { r.QuestionId, r.AnswerId })
                .Select(g => new { g.Key.QuestionId, g.Key.AnswerId, Count = g.Count() })
                .ToListAsync(cancellationToken);

            var result = survey.Questions.Select(q => new
            {
                idCauHoi = q.Id,
                content = q.NoiDung,
                idTraLoi = q.Answers.Select(a => a.Id).ToList(),
                DapAn = q.Answers.Select(a => a.TraLoi).ToList(),
                SoLuong = q.Answers.Select(a => stats.FirstOrDefault(s => s.QuestionId == q.Id && s.AnswerId == a.Id)?.Count ?? 0).ToList(),
                stt = q.STT ?? 0,
                totalCauHoi = survey.Questions.Count
            }).ToList();

            return new ApiResult<object> { Success = true, Data = result, Message = "Thống kê khảo sát thành công" };
        }
    }
}

public static class GetChiTietThongKeKhaoSat
{
    public class Query : IRequest<ApiResult<object>>
    {
        public int SurveyId { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, ApiResult<object>>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult<object>> Handle(Query request, CancellationToken cancellationToken)
        {
            var responses = await _context.KhaoSatResponses
                .Where(r => r.SurveyId == request.SurveyId)
                .Include(r => r.Question)
                .Include(r => r.Answer)
                .ToListAsync(cancellationToken);

            var grouped = responses
                .GroupBy(r => new { r.IDUser, r.HoTen, r.DiaChi })
                .Select(g => new
                {
                    IDUser = g.Key.IDUser,
                    HoTen = g.Key.HoTen,
                    DiaChi = g.Key.DiaChi,
                    CauTraLoi = g.Select(x => new
                    {
                        IDCauHoi = x.QuestionId,
                        CauHoi = x.Question!.NoiDung,
                        IDTraLoi = x.AnswerId,
                        TraLoi = x.Answer!.TraLoi
                    }).ToList()
                }).ToList();

            return new ApiResult<object> { Success = true, Data = grouped, Message = "Chi tiết thống kê khảo sát" };
        }
    }
}

public static class GetEssayResponsesByUser
{
    public class Query : IRequest<ApiResult<List<EssayResponseByUserDto>>>
    {
        public int SurveyId { get; set; }
        public long? IDUser { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, ApiResult<List<EssayResponseByUserDto>>>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult<List<EssayResponseByUserDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.KhaoSatEssayResponses.AsQueryable();
            query = query.Where(r => r.SurveyId == request.SurveyId);
            if (request.IDUser.HasValue)
            {
                var id = request.IDUser.Value;
                query = query.Where(r => r.IDUser == id);
            }
            var items = await query
                .Join(_context.KhaoSatTuLuans, r => r.EssayQuestionId, q => q.Id, (r, q) => new EssayResponseByUserDto
                {
                    IDUser = r.IDUser,
                    SurveyId = r.SurveyId,
                    EssayQuestionId = r.EssayQuestionId,
                    CauHoiTuLuan = q.CauHoiTuLuan,
                    Content = r.Content,
                    CreatedAt = r.CreatedAt
                })
                .OrderBy(x => x.IDUser)
                .ThenBy(x => x.EssayQuestionId)
                .ToListAsync(cancellationToken);
            return new ApiResult<List<EssayResponseByUserDto>>
            {
                Success = true,
                Data = items,
                Message = "Lấy danh sách trả lời tự luận thành công"
            };
        }
    }
}
