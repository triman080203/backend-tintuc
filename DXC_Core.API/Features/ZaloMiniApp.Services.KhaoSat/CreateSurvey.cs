using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class CreateSurvey
{
    public class Command : IRequest<ApiResult<SurveyDto>>
    {
        public required string TenKhaoSat { get; set; }
        public DateTime ThoiGian { get; set; }
        public string? DisplayWebsite { get; set; }
        public string? Header { get; set; }
        public string? Footer { get; set; }
        public string? VeViec { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.TenKhaoSat).NotEmpty().MaximumLength(255);
            RuleFor(x => x.DisplayWebsite).MaximumLength(500);
            RuleFor(x => x.Header).MaximumLength(1000);
            RuleFor(x => x.Footer).MaximumLength(1000);
            RuleFor(x => x.VeViec).MaximumLength(1000);
        }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<SurveyDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<ApiResult<SurveyDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var survey = new Survey
            {
                TenKhaoSat = request.TenKhaoSat,
                ThoiGian = request.ThoiGian,
                DisplayWebsite = request.DisplayWebsite,
                Header = request.Header,
                Footer = request.Footer,
                VeViec = request.VeViec
            };
            _context.KhaoSats.Add(survey);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<SurveyDto>
            {
                Success = true,
                Data = KhaoSatMappings.ToDto(survey),
                Message = "Tạo khảo sát thành công"
            };
        }
    }
}
