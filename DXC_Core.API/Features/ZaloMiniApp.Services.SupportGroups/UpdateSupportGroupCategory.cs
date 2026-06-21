using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public static class UpdateSupportGroupCategory
{
    public class Command : IRequest<ApiResult<SupportGroupCategoryDto>>
    {
        public required Guid PublicId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext zaloContext)
        {
            RuleFor(c => c.Name)
                .NotEmpty()
                .WithMessage("Tên danh mục không được để trống")
                .MaximumLength(255)
                .WithMessage("Tên danh mục không được vượt quá 255 ký tự")
                .MustAsync(async (command, name, cancellation) =>
                    !await zaloContext.SupportGroupCategories
                        .AnyAsync(c => c.Name == name && c.PublicId != command.PublicId && c.IsActive, cancellation))
                .WithMessage("Tên danh mục đã tồn tại");

            RuleFor(c => c.Description)
                .MaximumLength(1000)
                .WithMessage("Mô tả không được vượt quá 1000 ký tự");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<SupportGroupCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<SupportGroupCategoryDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await _zaloContext.SupportGroupCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.PublicId && c.IsActive, cancellationToken);

            if (category == null)
            {
                return new ApiResult<SupportGroupCategoryDto>
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục nhóm hỗ trợ"
                };
            }

            category.Name = request.Name;
            category.Description = request.Description;
            category.UpdatedAt = DateTime.UtcNow;

            await _zaloContext.SaveChangesAsync(cancellationToken);

            var categoryDto = new SupportGroupCategoryDto
            {
                PublicId = category.PublicId,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };

            return new ApiResult<SupportGroupCategoryDto>
            {
                Success = true,
                Data = categoryDto,
                Message = "Cập nhật danh mục nhóm hỗ trợ thành công"
            };
        }
    }
}