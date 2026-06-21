using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using DXC_Core.API.Data.FileContext;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

    public static class CreateIconGroup
    {
        public class Command : IRequest<ApiResult<IconGroupDto>>
        {
            public required Guid IconCategoryPublicId { get; set; }
            public required string Name { get; set; }
            public string? Description { get; set; }
            public int DisplayOrder { get; set; } = 0;
            public int? ThuTu { get; set; }
            public Guid? ImagePublicId { get; set; }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator(ZaloMiniAppDbContext dbContext, FileDbContext fileContext)
            {
                RuleFor(c => c.IconCategoryPublicId)
                    .NotEmpty()
                    .MustAsync(async (publicId, cancellation) =>
                        await dbContext.IconCategories.AnyAsync(c => c.PublicId == publicId && c.IsActive, cancellation))
                    .WithMessage("Danh mục icon không tồn tại hoặc đã bị vô hiệu hóa");

            RuleFor(c => c.Name)
                .NotEmpty()
                .MaximumLength(100);
                // .MustAsync(async (command, name, cancellation) =>
                //     !await dbContext.IconGroups.AnyAsync(g =>
                //         g.IconCategory.PublicId == command.IconCategoryPublicId && g.Name == name, cancellation))
                // .WithMessage("Tên nhóm icon đã tồn tại trong danh mục này");

            RuleFor(c => c.Description)
                .MaximumLength(500);

                RuleFor(c => c.DisplayOrder)
                    .GreaterThanOrEqualTo(0);

                RuleFor(c => c.ImagePublicId)
                    .MustAsync(async (id, cancellation) =>
                    {
                        if (!id.HasValue || id.Value == Guid.Empty) return true;
                        return await fileContext.Files.AnyAsync(f => f.PublicId == id.Value, cancellation);
                    })
                    .WithMessage("File ảnh không tồn tại hoặc PublicId không hợp lệ.");
            }
        }

        public class Handler : IRequestHandler<Command, ApiResult<IconGroupDto>>
        {
            private readonly ZaloMiniAppDbContext _dbContext;
            private readonly FileDbContext _fileContext;

            public Handler(ZaloMiniAppDbContext dbContext, FileDbContext fileContext)
            {
                _dbContext = dbContext;
                _fileContext = fileContext;
            }

        public async Task<ApiResult<IconGroupDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            try
            {
                var iconCategory = await _dbContext.IconCategories
                    .FirstOrDefaultAsync(c => c.PublicId == request.IconCategoryPublicId && c.IsActive, cancellationToken);

                if (iconCategory == null)
                {
                    return new ApiResult<IconGroupDto>
                    {
                        Success = false,
                        Message = "Không tìm thấy danh mục icon hoặc danh mục đã bị vô hiệu hóa"
                    };
                }

                string? imageUrl = null;
                if (request.ImagePublicId.HasValue && request.ImagePublicId.Value != Guid.Empty)
                {
                    var imageFile = await _fileContext.Files
                        .FirstOrDefaultAsync(f => f.PublicId == request.ImagePublicId.Value, cancellationToken);
                    if (imageFile != null)
                    {
                        imageUrl = $"/api/files/{imageFile.PublicId}";
                    }
                }

                var iconGroup = new Data.ZaloMiniAppContext.Models.Services.IconManagement.IconGroup
                {
                    IconCategoryId = iconCategory.Id,
                    Name = request.Name,
                    Description = request.Description,
                    DisplayOrder = request.DisplayOrder,
                    ThuTu = request.ThuTu ?? request.DisplayOrder,
                    IsActive = true,
                    ImageUrl = imageUrl,
                    ImagePublicId = request.ImagePublicId
                };

                _dbContext.IconGroups.Add(iconGroup);
                await _dbContext.SaveChangesAsync(cancellationToken);

                var result = new IconGroupDto
                {
                    PublicId = iconGroup.PublicId,
                    IconCategoryPublicId = iconCategory.PublicId,
                    Name = iconGroup.Name,
                    Description = iconGroup.Description,
                    DisplayOrder = iconGroup.DisplayOrder,
                    ThuTu = iconGroup.ThuTu,
                    IsActive = iconGroup.IsActive,
                    CreatedAt = iconGroup.CreatedAt,
                    UpdatedAt = iconGroup.UpdatedAt,
                    ImageUrl = iconGroup.ImageUrl,
                    ImagePublicId = iconGroup.ImagePublicId,
                    IconCategoryName = iconCategory.Name,
                    TotalIcons = 0
                };

                return new ApiResult<IconGroupDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Tạo nhóm icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<IconGroupDto>
                {
                    Success = false,
                    Message = $"Lỗi tạo nhóm icon: {ex.Message}"
                };
            }
        }
    }
}
