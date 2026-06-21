using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

public static class CreateHotlineCategory
{
    public class Command : IRequest<ApiResult<HotlineCategoryDto>>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public int ThuTu { get; set; } = 0;
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
            // .MustAsync(async (name, cancellation) =>
            //     !await zaloContext.HotlineCategories.AnyAsync(c => c.Name == name, cancellation))
            // .WithMessage("Tên lĩnh vực đã tồn tại");

            RuleFor(c => c.Description)
                .MaximumLength(1000)
                .WithMessage("Mô tả không được vượt quá 1000 ký tự");
            RuleFor(c => c.ThuTu)
                .GreaterThanOrEqualTo(0)
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
            var category = new Data.ZaloMiniAppContext.Models.Services.HotlineCategory
            {
                PublicId = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                ThuTu = request.ThuTu
            };

            _zaloContext.HotlineCategories.Add(category);
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
                HotlinesCount = 0
            };

            return new ApiResult<HotlineCategoryDto>
            {
                Success = true,
                Data = categoryDto,
                Message = "Tạo lĩnh vực đường dây nóng thành công"
            };
        }
    }
}
