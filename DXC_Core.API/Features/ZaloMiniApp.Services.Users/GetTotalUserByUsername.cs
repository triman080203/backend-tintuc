using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

public static class GetTotalUserByUsername
{
    public class Query : IRequest<ApiResult<TotalUserDto>>
    {
        public required string Username { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<TotalUserDto>>
    {
        private readonly ZaloMiniAppDbContext _db;

        public Handler(ZaloMiniAppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResult<TotalUserDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var keyword = request.Username?.Trim();
            if (string.IsNullOrEmpty(keyword))
            {
                return new ApiResult<TotalUserDto> { Success = false, Message = "Từ khóa tìm kiếm không hợp lệ" };
            }

            var entity = await _db.TotalUsers.AsNoTracking()
                .FirstOrDefaultAsync(x => EF.Functions.Like(x.Username, "%" + keyword + "%"), cancellationToken);

            if (entity == null)
            {
                return new ApiResult<TotalUserDto> { Success = false, Message = "Không tìm thấy" };
            }

            return new ApiResult<TotalUserDto>
            {
                Success = true,
                Data = new TotalUserDto
                {
                    Id = entity.Id,
                    UserId = entity.UserId,
                    Username = entity.Username,
                    Avatar = entity.Avatar,
                    PhanQuyen = entity.PhanQuyen,
                    PhoneNumber = entity.PhoneNumber,
                }
            };
        }
    }
}
