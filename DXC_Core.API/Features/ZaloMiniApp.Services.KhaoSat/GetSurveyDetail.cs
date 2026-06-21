using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class GetSurveyDetail
{
    public class Query : IRequest<ApiResult<SurveyDetailDto>>
    {
        public int Id { get; set; }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, ApiResult<SurveyDetailDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<ApiResult<SurveyDetailDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var survey = await _context.KhaoSats
                .Include(s => s.Questions)
                .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

            if (survey == null)
            {
                return new ApiResult<SurveyDetailDto> { Success = false, Message = "Không tìm thấy khảo sát" };
            }

            var dto = new SurveyDetailDto
            {
                Id = survey.Id,
                TenKhaoSat = survey.TenKhaoSat,
                ThoiGian = survey.ThoiGian,
                DisplayWebsite = survey.DisplayWebsite,
                Header = survey.Header,
                Footer = survey.Footer,
                VeViec = survey.VeViec,
                IsActive = survey.IsActive,
                CreatedAt = survey.CreatedAt,
                UpdatedAt = survey.UpdatedAt,
                Questions = survey.Questions
                    .OrderBy(q => q.STT ?? int.MaxValue)
                    .Select(q => new QuestionDto
                    {
                        Id = q.Id,
                        NoiDung = q.NoiDung,
                        CauHoiTuLuan = q.CauHoiTuLuan,
                        STT = q.STT,
                        Answers = q.Answers.Select(a => new AnswerDto
                        {
                            Id = a.Id,
                            TraLoi = a.TraLoi
                        }).ToList()
                    }).ToList()
            };

            return new ApiResult<SurveyDetailDto> { Success = true, Data = dto, Message = "Lấy chi tiết khảo sát thành công" };
        }
    }
}
