using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class CreateIconCategory
{
    public class Command : IRequest<ApiResult<IconCategoryDto>>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; } = 0;
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext dbContext)
        {
            RuleFor(c => c.Name)
                .NotEmpty()
                .MaximumLength(100)
                .MustAsync(async (name, cancellation) =>
                    !await dbContext.IconCategories.AnyAsync(c => c.Name == name, cancellation))
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
                var iconCategory = new Data.ZaloMiniAppContext.Models.Services.IconManagement.IconCategory
                {
                    Name = request.Name,
                    Description = request.Description,
                    DisplayOrder = request.DisplayOrder,
                    IsActive = true
                };

                _dbContext.IconCategories.Add(iconCategory);
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
                    TotalIconGroups = 0,
                    TotalIcons = 0
                };

                return new ApiResult<IconCategoryDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Tạo danh mục icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<IconCategoryDto>
                {
                    Success = false,
                    Message = $"Lỗi tạo danh mục icon: {ex.Message}"
                };
            }
        }
    }
}