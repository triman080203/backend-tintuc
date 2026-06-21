using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class UpdateHotlineCategory
{
    public class Command : IRequest<ApiResult<HotlineCategoryDto>>
    {
        public required Guid PublicId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public int? ThuTu { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext zaloContext)
        {
            RuleFor(c => c.Name)
                .NotEmpty()
                .WithMessage("Tên lĩnh vực không được để trống")
                .MaximumLength(255)
                .WithMessage("Tên lĩnh vực không được vượt quá 255 ký tự");
            // .MustAsync(async (command, name, cancellation) =>
            //     !await zaloContext.HotlineCategories
            //         .AnyAsync(c => c.Name == name && c.PublicId != command.PublicId, cancellation))
            // .WithMessage("Tên lĩnh vực đã tồn tại");

            RuleFor(c => c.Description)
                .MaximumLength(1000)
                .WithMessage("Mô tả không được vượt quá 1000 ký tự");
            RuleFor(c => c.ThuTu)
                .GreaterThanOrEqualTo(0)
                .When(c => c.ThuTu.HasValue)
                .WithMessage("Thứ tự phải >= 0");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<HotlineCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<HotlineCategoryDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await _zaloContext.HotlineCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.PublicId, cancellationToken);

            if (category == null)
            {
                return new ApiResult<HotlineCategoryDto>
                {
                    Success = false,
                    Message = "Không tìm thấy lĩnh vực đường dây nóng"
                };
            }

            category.Name = request.Name;
            category.Description = request.Description;
            if (request.ThuTu.HasValue)
            {
                category.ThuTu = request.ThuTu.Value;
            }
            category.UpdatedAt = DateTime.UtcNow;

            await _zaloContext.SaveChangesAsync(cancellationToken);

            var categoryDto = new HotlineCategoryDto
            {
                PublicId = category.PublicId,
                Name = category.Name,
                Description = category.Description,
                ThuTu = category.ThuTu,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt,
                HotlinesCount = category.Hotlines.Count(h => h.IsActive)
            };

            return new ApiResult<HotlineCategoryDto>
            {
                Success = true,
                Data = categoryDto,
                Message = "Cập nhật lĩnh vực đường dây nóng thành công"
            };
        }
    }
}
