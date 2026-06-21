using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public static class DeleteSurvey
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
            var survey = await _context.KhaoSats.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
            if (survey == null)
            {
                return new ApiResult { Success = false, Message = "Khảo sát không tồn tại" };
            }

            _context.KhaoSats.Remove(survey);
            await _context.SaveChangesAsync(cancellationToken);
            return new ApiResult { Success = true, Message = "Xóa khảo sát thành công" };
        }
    }
}
