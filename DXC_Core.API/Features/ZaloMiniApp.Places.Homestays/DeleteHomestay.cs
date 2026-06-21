using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;

public static class DeleteHomestay
{
    public class Command : IRequest<ApiResult<bool>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.PublicId)
                .NotEmpty().WithMessage("PublicId không được để trống");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<bool>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<bool>> Handle(Command request, CancellationToken cancellationToken)
        {
            // Tìm homestay cần xóa
            var homestay = await _context.Homestays
                .FirstOrDefaultAsync(h => h.PublicId == request.PublicId, cancellationToken);

            if (homestay == null)
            {
                return new ApiResult<bool>
                {
                    Success = false,
                    Data = false,
                    Message = "Không tìm thấy homestay với PublicId được cung cấp"
                };
            }

            if (!homestay.IsActive)
            {
                return new ApiResult<bool>
                {
                    Success = false,
                    Data = false,
                    Message = "Homestay đã được xóa trước đó"
                };
            }

            // Soft delete - chỉ set IsActive = false
            homestay.IsActive = false;

            // Lưu thay đổi
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult<bool>
            {
                Success = true,
                Data = true,
                Message = "Xóa homestay thành công"
            };
        }
    }
}