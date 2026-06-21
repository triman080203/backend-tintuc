using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class InsertQuestion
{
    public class Command : IRequest<ApiResult<QuestionDto>>
    {
        public int SurveyId { get; set; }
        public required string NoiDung { get; set; }
        public string? CauHoiTuLuan { get; set; }
        public int? STT { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.SurveyId).GreaterThan(0);
            RuleFor(x => x.NoiDung).NotEmpty();
        }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<QuestionDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<ApiResult<QuestionDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var exists = await _context.KhaoSats.AnyAsync(s => s.Id == request.SurveyId, cancellationToken);
            if (!exists) return new ApiResult<QuestionDto> { Success = false, Message = "Khảo sát không tồn tại" };

            var q = new Question
            {
                SurveyId = request.SurveyId,
                NoiDung = request.NoiDung,
                CauHoiTuLuan = request.CauHoiTuLuan,
                STT = request.STT
            };
            _context.KhaoSatCauHois.Add(q);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<QuestionDto>
            {
                Success = true,
                Data = new QuestionDto { Id = q.Id, NoiDung = q.NoiDung, CauHoiTuLuan = q.CauHoiTuLuan, STT = q.STT, Answers = new() },
                Message = "Thêm câu hỏi thành công"
            };
        }
    }
}

public static class UpdateQuestion
{
    public class Command : IRequest<ApiResult<QuestionDto>>
    {
        public int Id { get; set; }
        public required string NoiDung { get; set; }
        public int? STT { get; set; }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<QuestionDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<ApiResult<QuestionDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var q = await _context.KhaoSatCauHois.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (q == null) return new ApiResult<QuestionDto> { Success = false, Message = "Câu hỏi không tồn tại" };
            q.NoiDung = request.NoiDung;
            q.STT = request.STT;
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult<QuestionDto> { Success = true, Data = new QuestionDto { Id = q.Id, NoiDung = q.NoiDung, CauHoiTuLuan = q.CauHoiTuLuan, STT = q.STT }, Message = "Cập nhật câu hỏi thành công" };
        }
    }
}

public static class DeleteQuestion
{
    public class Command : IRequest<ApiResult>
    {
        public int Id { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var q = await _context.KhaoSatCauHois.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (q == null) return new ApiResult { Success = false, Message = "Câu hỏi không tồn tại" };
            _context.KhaoSatCauHois.Remove(q);
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult { Success = true, Message = "Xóa câu hỏi thành công" };
        }
    }
}

public static class InsertAnswer
{
    public class Command : IRequest<ApiResult<AnswerDto>>
    {
        public int QuestionId { get; set; }
        public required string TraLoi { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<AnswerDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult<AnswerDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var exists = await _context.KhaoSatCauHois.AnyAsync(q => q.Id == request.QuestionId, cancellationToken);
            if (!exists) return new ApiResult<AnswerDto> { Success = false, Message = "Câu hỏi không tồn tại" };
            var a = new Answer { QuestionId = request.QuestionId, TraLoi = request.TraLoi };
            _context.KhaoSatTraLois.Add(a);
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult<AnswerDto> { Success = true, Data = new AnswerDto { Id = a.Id, TraLoi = a.TraLoi }, Message = "Thêm trả lời thành công" };
        }
    }
}

public static class UpdateAnswer
{
    public class Command : IRequest<ApiResult<AnswerDto>>
    {
        public int Id { get; set; }
        public required string TraLoi { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<AnswerDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult<AnswerDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var a = await _context.KhaoSatTraLois.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (a == null) return new ApiResult<AnswerDto> { Success = false, Message = "Trả lời không tồn tại" };
            a.TraLoi = request.TraLoi;
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult<AnswerDto> { Success = true, Data = new AnswerDto { Id = a.Id, TraLoi = a.TraLoi }, Message = "Cập nhật trả lời thành công" };
        }
    }
}

public static class DeleteAnswer
{
    public class Command : IRequest<ApiResult>
    {
        public int Id { get; set; }
    }
    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var a = await _context.KhaoSatTraLois.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (a == null) return new ApiResult { Success = false, Message = "Trả lời không tồn tại" };
            _context.KhaoSatTraLois.Remove(a);
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult { Success = true, Message = "Xóa trả lời thành công" };
        }
    }
}
