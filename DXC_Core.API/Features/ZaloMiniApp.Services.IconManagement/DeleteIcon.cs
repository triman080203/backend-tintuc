using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class DeleteIcon
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            try
            {
                var icon = await _dbContext.Icons
                    .FirstOrDefaultAsync(i => i.PublicId == request.PublicId, cancellationToken);

                if (icon == null)
                {
                    return new ApiResult
                    {
                        Success = false,
                        Message = "Không tìm thấy icon"
                    };
                }

                // Soft delete
                icon.IsActive = false;
                icon.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync(cancellationToken);

                return new ApiResult
                {
                    Success = true,
                    Message = "Xóa icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = $"Lỗi xóa icon: {ex.Message}"
                };
            }
        }
    }
}