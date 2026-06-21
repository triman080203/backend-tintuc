using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public static class DeleteSupportGroup
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var supportGroup = await _zaloContext.SupportGroups
                .FirstOrDefaultAsync(sg => sg.PublicId == request.PublicId && sg.IsActive, cancellationToken);

            if (supportGroup == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy nhóm hỗ trợ"
                };
            }

            supportGroup.IsActive = false;
            supportGroup.UpdatedAt = DateTime.UtcNow;

            await _zaloContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa nhóm hỗ trợ thành công"
            };
        }
    }
}