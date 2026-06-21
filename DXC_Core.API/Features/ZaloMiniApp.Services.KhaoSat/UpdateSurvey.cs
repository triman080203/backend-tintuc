using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class UpdateSurvey
{
    public class Command : IRequest<ApiResult<SurveyDto>>
    {
        public int Id { get; set; }
        public required string TenKhaoSat { get; set; }
        public DateTime ThoiGian { get; set; }
        public string? DisplayWebsite { get; set; }
        public string? Header { get; set; }
        public string? Footer { get; set; }
        public string? VeViec { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
            RuleFor(x => x.TenKhaoSat).NotEmpty().MaximumLength(255);
        }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<SurveyDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<ApiResult<SurveyDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var survey = await _context.KhaoSats.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
            if (survey == null)
            {
                return new ApiResult<SurveyDto> { Success = false, Message = "Khảo sát không tồn tại" };
            }

            survey.TenKhaoSat = request.TenKhaoSat;
            survey.ThoiGian = request.ThoiGian;
            survey.DisplayWebsite = request.DisplayWebsite;
            survey.Header = request.Header;
            survey.Footer = request.Footer;
            survey.VeViec = request.VeViec;
            if (request.IsActive.HasValue) survey.IsActive = request.IsActive.Value;
            survey.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<SurveyDto> { Success = true, Data = KhaoSatMappings.ToDto(survey), Message = "Cập nhật khảo sát thành công" };
        }
    }
}
