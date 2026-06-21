using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class GetEssayQuestions
{
    public class Query : IRequest<PagedResult<EssayQuestionDto>>
    {
        public int SurveyId { get; set; }
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Query, PagedResult<EssayQuestionDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<PagedResult<EssayQuestionDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.KhaoSatTuLuans.Where(x => x.SurveyId == request.SurveyId);
            var total = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderBy(x => x.Id)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new EssayQuestionDto { Id = x.Id, SurveyId = x.SurveyId, CauHoiTuLuan = x.CauHoiTuLuan })
                .ToListAsync(cancellationToken);
            return new PagedResult<EssayQuestionDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách câu hỏi tự luận thành công"
            };
        }
    }
}

public static class CreateEssayQuestion
{
    public class Command : IRequest<ApiResult<EssayQuestionDto>>
    {
        public int SurveyId { get; set; }
        public required string CauHoiTuLuan { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.SurveyId).GreaterThan(0);
            RuleFor(x => x.CauHoiTuLuan).NotEmpty();
        }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<EssayQuestionDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;

        public async Task<ApiResult<EssayQuestionDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var exists = await _context.KhaoSats.AnyAsync(s => s.Id == request.SurveyId, cancellationToken);
            if (!exists) return new ApiResult<EssayQuestionDto> { Success = false, Message = "Khảo sát không tồn tại" };

            var entity = new EssayQuestion
            {
                SurveyId = request.SurveyId,
                CauHoiTuLuan = request.CauHoiTuLuan
            };
            _context.KhaoSatTuLuans.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult<EssayQuestionDto>
            {
                Success = true,
                Data = new EssayQuestionDto { Id = entity.Id, SurveyId = entity.SurveyId, CauHoiTuLuan = entity.CauHoiTuLuan },
                Message = "Tạo câu hỏi tự luận thành công"
            };
        }
    }
}

public static class UpdateEssayQuestion
{
    public class Command : IRequest<ApiResult<EssayQuestionDto>>
    {
        public int Id { get; set; }
        public required string CauHoiTuLuan { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
            RuleFor(x => x.CauHoiTuLuan).NotEmpty();
        }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<EssayQuestionDto>>
    {
        private readonly ZaloMiniAppDbContext _context = context;
        public async Task<ApiResult<EssayQuestionDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var entity = await _context.KhaoSatTuLuans.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (entity == null) return new ApiResult<EssayQuestionDto> { Success = false, Message = "Câu hỏi tự luận không tồn tại" };
            entity.CauHoiTuLuan = request.CauHoiTuLuan;
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult<EssayQuestionDto> { Success = true, Data = new EssayQuestionDto { Id = entity.Id, SurveyId = entity.SurveyId, CauHoiTuLuan = entity.CauHoiTuLuan }, Message = "Cập nhật câu hỏi tự luận thành công" };
        }
    }
}

public static class DeleteEssayQuestion
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
            var entity = await _context.KhaoSatTuLuans.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (entity == null) return new ApiResult { Success = false, Message = "Câu hỏi tự luận không tồn tại" };
            var relatedResponses = await _context.KhaoSatEssayResponses
                .Where(r => r.EssayQuestionId == request.Id)
                .ToListAsync(cancellationToken);
            if (relatedResponses.Count > 0)
            {
                _context.KhaoSatEssayResponses.RemoveRange(relatedResponses);
            }
            _context.KhaoSatTuLuans.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult { Success = true, Message = "Xóa câu hỏi tự luận thành công" };
        }
    }
}
