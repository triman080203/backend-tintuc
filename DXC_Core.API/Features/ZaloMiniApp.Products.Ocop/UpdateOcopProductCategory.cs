using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class UpdateOcopProductCategory
{
    public class Command : IRequest<ApiResult<OcopProductCategoryDto>>
    {
        public required Guid PublicId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid? ImagePublicId { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;
        private readonly FileDbContext _fileContext;

        public Validator(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            _zaloContext = zaloContext;
            _fileContext = fileContext;

            RuleFor(x => x.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không được để trống");

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Tên danh mục không được để trống")
                .MaximumLength(255)
                .WithMessage("Tên danh mục không được vượt quá 255 ký tự");


            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự");

            RuleFor(x => x.ImagePublicId)
                .MustAsync(async (id, cancellation) =>
                {
                    if (id == null || id == Guid.Empty) return true;
                    return await _fileContext.Files
                        .AnyAsync(f => f.PublicId == id, cancellation);
                })
                .WithMessage("File ảnh không tồn tại hoặc PublicId không hợp lệ.");

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Thứ tự hiển thị phải lớn hơn hoặc bằng 0");
        }

        private async Task<bool> BeUniqueName(Command command, string name, CancellationToken cancellationToken)
        {
            return !await _zaloContext.OcopProductCategories
                .AnyAsync(c => c.Name == name && c.PublicId != command.PublicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<OcopProductCategoryDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;
        private readonly FileDbContext _fileContext;

        public Handler(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            _zaloContext = zaloContext;
            _fileContext = fileContext;
        }

        public async Task<ApiResult<OcopProductCategoryDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await _zaloContext.OcopProductCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.PublicId, cancellationToken);

            if (category == null)
            {
                return new ApiResult<OcopProductCategoryDto>
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục sản phẩm OCOP"
                };
            }

            category.Name = request.Name;
            category.Description = request.Description;
            category.DisplayOrder = request.DisplayOrder;
            category.IsActive = request.IsActive;
            category.UpdatedAt = DateTime.UtcNow;

            if (request.ImagePublicId.HasValue)
            {
                if (request.ImagePublicId == Guid.Empty)
                {
                    category.ImageUrl = null;
                    category.ImagePublicId = null;
                }
                else
                {
                    var imageFile = await _fileContext.Files
                        .FirstOrDefaultAsync(f => f.PublicId == request.ImagePublicId, cancellationToken);

                    if (imageFile != null)
                    {
                        category.ImageUrl = $"/api/files/{imageFile.PublicId}";
                        category.ImagePublicId = request.ImagePublicId;
                    }
                }
            }

            await _zaloContext.SaveChangesAsync(cancellationToken);

            var categoryDto = new OcopProductCategoryDto
            {
                PublicId = category.PublicId,
                Name = category.Name,
                Description = category.Description,
                ImageUrl = category.ImageUrl,
                ImagePublicId = category.ImagePublicId,
                DisplayOrder = category.DisplayOrder,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };

            return new ApiResult<OcopProductCategoryDto>
            {
                Success = true,
                Data = categoryDto,
                Message = "Cập nhật danh mục sản phẩm OCOP thành công"
            };
        }
    }
}