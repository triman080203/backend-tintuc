using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class UpdateHotline
{
    public class Command : IRequest<ApiResult<HotlineDto>>
    {
        public required Guid PublicId { get; set; }
        public required string PhoneNumber { get; set; }
        public required string ContactName { get; set; }
        public string? Description { get; set; }
        public int? ThuTu { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext zaloContext)
        {
            RuleFor(c => c.PhoneNumber)
                .NotEmpty()
                .WithMessage("Số điện thoại không được để trống")
                .MaximumLength(20)
                .WithMessage("Số điện thoại không được vượt quá 20 ký tự")
                .Matches(@"^[\d\s\-\+\(\)\.]+$")
                .WithMessage("Số điện thoại không đúng định dạng");

            RuleFor(c => c.ContactName)
                .NotEmpty()
                .WithMessage("Tên người/bộ phận không được để trống")
                .MaximumLength(255)
                .WithMessage("Tên người/bộ phận không được vượt quá 255 ký tự");

            RuleFor(c => c.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự");
            RuleFor(c => c.ThuTu)
                .GreaterThanOrEqualTo(0)
                .When(c => c.ThuTu.HasValue)
                .WithMessage("Thứ tự phải >= 0");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<HotlineDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<HotlineDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var hotline = await _zaloContext.Hotlines
                .Include(h => h.Category)
                .FirstOrDefaultAsync(h => h.PublicId == request.PublicId && h.IsActive, cancellationToken);

            if (hotline == null)
            {
                return new ApiResult<HotlineDto>
                {
                    Success = false,
                    Message = "Không tìm thấy đường dây nóng"
                };
            }

            hotline.PhoneNumber = request.PhoneNumber;
            hotline.ContactName = request.ContactName;
            hotline.Description = request.Description;
            if (request.ThuTu.HasValue)
            {
                hotline.ThuTu = request.ThuTu.Value;
            }
            hotline.UpdatedAt = DateTime.UtcNow;

            await _zaloContext.SaveChangesAsync(cancellationToken);

            var hotlineDto = new HotlineDto
            {
                PublicId = hotline.PublicId,
                CategoryPublicId = hotline.Category.PublicId,
                CategoryName = hotline.Category.Name,
                PhoneNumber = hotline.PhoneNumber,
                ContactName = hotline.ContactName,
                Description = hotline.Description,
                ThuTu = hotline.ThuTu,
                IsActive = hotline.IsActive,
                CreatedAt = hotline.CreatedAt,
                UpdatedAt = hotline.UpdatedAt
            };

            return new ApiResult<HotlineDto>
            {
                Success = true,
                Data = hotlineDto,
                Message = "Cập nhật đường dây nóng thành công"
            };
        }
    }
}
