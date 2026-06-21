using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

public static class CreateTotalUser
{
    public class Command : IRequest<ApiResult<TotalUserDto>>
    {
        public required string UserId { get; set; }
        public required string Username { get; set; }
        public string? Avatar { get; set; }
        public string? PhanQuyen { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext db)
        {
            RuleFor(x => x.UserId).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Username).NotEmpty().MaximumLength(255);
            RuleFor(x => x.Avatar).MaximumLength(500);
            RuleFor(x => x.PhanQuyen).MaximumLength(100);
            RuleFor(x => x.PhoneNumber).MaximumLength(20);
            RuleFor(x => x.UserId)
                .MustAsync(async (userId, ct) => !await db.TotalUsers.AnyAsync(t => t.UserId == userId, ct))
                .WithMessage("UserId đã tồn tại");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<TotalUserDto>>
    {
        private readonly ZaloMiniAppDbContext _db;

        public Handler(ZaloMiniAppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResult<TotalUserDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            try
            {
                var entity = new Data.ZaloMiniAppContext.Models.Services.TotalUser
                {
                    UserId = request.UserId,
                    Username = request.Username,
                    Avatar = request.Avatar,
                    PhanQuyen = request.PhanQuyen,
                    PhoneNumber = request.PhoneNumber,
                };

                _db.TotalUsers.Add(entity);
                await _db.SaveChangesAsync(cancellationToken);

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
                    },
                    Message = "Tạo TotalUser thành công",
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<TotalUserDto>
                {
                    Success = false,
                    Message = ex.Message,
                };
            }
        }
    }
}
