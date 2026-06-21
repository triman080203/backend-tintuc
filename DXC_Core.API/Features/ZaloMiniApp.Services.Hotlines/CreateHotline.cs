using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class CreateHotline
{
    public class Command : IRequest<ApiResult<HotlineDto>>
    {
        public required Guid CategoryPublicId { get; set; }
        public required string PhoneNumber { get; set; }
        public required string ContactName { get; set; }
        public string? Description { get; set; }
        public int ThuTu { get; set; } = 0;
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

            RuleFor(c => c.CategoryPublicId)
                .MustAsync(async (categoryPublicId, cancellation) =>
                    await zaloContext.HotlineCategories
                        .AnyAsync(c => c.PublicId == categoryPublicId && c.IsActive, cancellation))
                .WithMessage("Lĩnh vực không tồn tại hoặc đã bị vô hiệu hóa");

            RuleFor(c => c.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự");
            RuleFor(c => c.ThuTu)
                .GreaterThanOrEqualTo(0)
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
            var category = await _zaloContext.HotlineCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.CategoryPublicId && c.IsActive, cancellationToken);

            if (category == null)
            {
                return new ApiResult<HotlineDto>
                {
                    Success = false,
                    Message = "Không tìm thấy lĩnh vực đường dây nóng"
                };
            }

            var hotline = new Data.ZaloMiniAppContext.Models.Services.Hotline
            {
                PublicId = Guid.NewGuid(),
                CategoryId = category.Id,
                PhoneNumber = request.PhoneNumber,
                ContactName = request.ContactName,
                Description = request.Description,
                ThuTu = request.ThuTu
            };

            _zaloContext.Hotlines.Add(hotline);
            await _zaloContext.SaveChangesAsync(cancellationToken);

            var hotlineDto = new HotlineDto
            {
                PublicId = hotline.PublicId,
                CategoryPublicId = category.PublicId,
                CategoryName = category.Name,
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
                Message = "Tạo đường dây nóng thành công"
            };
        }
    }
}
