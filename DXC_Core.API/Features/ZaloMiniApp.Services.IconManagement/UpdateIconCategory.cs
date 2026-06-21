using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class UpdateIconCategory
{
    public class Command : IRequest<ApiResult<IconCategoryDto>>
    {
        public required Guid PublicId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext dbContext)
        {
            RuleFor(c => c.Name)
                .NotEmpty()
                .MaximumLength(100)
                .MustAsync(async (command, name, cancellation) =>
                    !await dbContext.IconCategories
                        .AnyAsync(c => c.Name == name && c.PublicId != command.PublicId, cancellation))
                .WithMessage("Tên danh mục đã tồn tại");

            RuleFor(c => c.Description)
                .MaximumLength(500);

            RuleFor(c => c.DisplayOrder)
                .GreaterThanOrEqualTo(0);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<IconCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<IconCategoryDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            try
            {
                var iconCategory = await _dbContext.IconCategories
                    .FirstOrDefaultAsync(c => c.PublicId == request.PublicId, cancellationToken);

                if (iconCategory == null)
                {
                    return new ApiResult<IconCategoryDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy danh mục icon"
                    };
                }

                iconCategory.Name = request.Name;
                iconCategory.Description = request.Description;
                iconCategory.DisplayOrder = request.DisplayOrder;
                iconCategory.IsActive = request.IsActive;
                iconCategory.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync(cancellationToken);

                var result = new IconCategoryDto
                {
                    PublicId = iconCategory.PublicId,
                    Name = iconCategory.Name,
                    Description = iconCategory.Description,
                    DisplayOrder = iconCategory.DisplayOrder,
                    IsActive = iconCategory.IsActive,
                    CreatedAt = iconCategory.CreatedAt,
                    UpdatedAt = iconCategory.UpdatedAt,
                    TotalIconGroups = iconCategory.IconGroups.Count(g => g.IsActive),
                    TotalIcons = iconCategory.Icons.Count(i => i.IsActive)
                };

                return new ApiResult<IconCategoryDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Cập nhật danh mục icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<IconCategoryDto>
                {
                    Success = false,
                    Message = $"Lỗi cập nhật danh mục icon: {ex.Message}"
                };
            }
        }
    }
}