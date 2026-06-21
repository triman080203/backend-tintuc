using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

public static class DeleteTotalUser
{
    public class Command : IRequest<ApiResult>
    {
        public int Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _db;

        public Handler(ZaloMiniAppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var entity = await _db.TotalUsers.FindAsync([request.Id], cancellationToken);
            if (entity == null)
            {
                return new ApiResult { Success = false, Message = "Không tìm thấy" };
            }

            _db.TotalUsers.Remove(entity);
            await _db.SaveChangesAsync(cancellationToken);

            return new ApiResult { Success = true, Message = "Xóa TotalUser thành công" };
        }
    }
}
