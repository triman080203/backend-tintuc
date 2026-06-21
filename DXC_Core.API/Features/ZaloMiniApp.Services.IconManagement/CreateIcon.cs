using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

public static class CreateIcon
{
    public class Command : IRequest<ApiResult<IconDto>>
    {
        public Guid? IconCategoryPublicId { get; set; }
        public Guid? IconGroupPublicId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public string? IconImageUrl { get; set; } // For backward compatibility
        public Guid? ImagePublicId { get; set; } // New field for standard file upload pattern
        public required string IconType { get; set; } // 'native' hoặc 'web'
        public string? ScreenParams { get; set; } // Params cho native icon
        public string? WebLink { get; set; } // Link cho web icon
        public string? LinkAndroid { get; set; }
        public string? LinkIOS { get; set; }
        public int DisplayOrder { get; set; } = 0;
        public int? ThuTu { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext dbContext, FileDbContext fileContext)
        {
            RuleFor(c => c.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(c => c.Description)
                .MaximumLength(500);

            // Validation for either old pattern (IconImageUrl) or new pattern (ImagePublicId)
            RuleFor(c => c)
                .MustAsync(async (command, cancellation) =>
                {
                    if (!string.IsNullOrEmpty(command.IconImageUrl) && command.ImagePublicId.HasValue)
                        return false; // Không cho phép cung cấp cả hai trường ảnh
                    if (!string.IsNullOrEmpty(command.IconImageUrl))
                    {
                        // Chấp nhận URL tuyệt đối hoặc đường dẫn tương đối bắt đầu bằng /
                        return Uri.TryCreate(command.IconImageUrl, UriKind.Absolute, out _) ||
                               command.IconImageUrl.StartsWith("/");
                    }
                    if (command.ImagePublicId.HasValue)
                        return await fileContext.Files.AnyAsync(f => f.PublicId == command.ImagePublicId, cancellation);
                    // Cho phép không cung cấp ảnh khi tạo icon
                    return true;
                })
                .WithMessage("Không thể cung cấp cả IconImageUrl và ImagePublicId cùng lúc; nếu cung cấp phải hợp lệ");

            RuleFor(c => c.IconType)
                .NotEmpty()
                .Must(type => type == "native" || type == "web")
                .WithMessage("IconType phải là 'native' hoặc 'web'");

            RuleFor(c => c.ScreenParams)
                .MaximumLength(1000);

            RuleFor(c => c.WebLink)
                .MaximumLength(500)
                .Must((command, webLink) =>
                {
                    if (string.IsNullOrWhiteSpace(webLink)) return true;
                    return Uri.TryCreate(webLink, UriKind.Absolute, out _);
                })
                .WithMessage("WebLink phải là URL hợp lệ nếu được cung cấp");

            RuleFor(c => c.ScreenParams)
                .Must((command, screenParams) =>
                {
                    if (command.IconType == "native")
                        return !string.IsNullOrEmpty(screenParams);
                    return true;
                })
                .WithMessage("ScreenParams bắt buộc khi IconType là 'native'");

            RuleFor(c => c.IconCategoryPublicId)
                .NotNull()
                .WithMessage("Icon bắt buộc phải có Category");

            RuleFor(c => c.IconCategoryPublicId)
                .MustAsync(async (publicId, cancellation) =>
                {
                    if (!publicId.HasValue) return true;
                    return await dbContext.IconCategories.AnyAsync(c => c.PublicId == publicId && c.IsActive, cancellation);
                })
                .WithMessage("IconCategory không tồn tại hoặc đã bị vô hiệu hóa");

            RuleFor(c => c)
                .MustAsync(async (command, cancellation) =>
                {
                    if (!command.IconGroupPublicId.HasValue) return true;
                    var group = await dbContext.IconGroups.FirstOrDefaultAsync(g => g.PublicId == command.IconGroupPublicId && g.IsActive, cancellation);
                    if (group == null) return false;
                    var cat = await dbContext.IconCategories.FirstOrDefaultAsync(x => x.Id == group.IconCategoryId && x.IsActive, cancellation);
                    return command.IconCategoryPublicId.HasValue && cat != null && cat.PublicId == command.IconCategoryPublicId.Value;
                })
                .WithMessage("IconGroup phải thuộc về Category đã chọn");

            RuleFor(c => c.DisplayOrder)
                .GreaterThanOrEqualTo(0);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<IconDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;
        private readonly FileDbContext _fileContext;

        public Handler(ZaloMiniAppDbContext dbContext, FileDbContext fileContext)
        {
            _dbContext = dbContext;
            _fileContext = fileContext;
        }

        public async Task<ApiResult<IconDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            try
            {
                // Validate parent entities
                Data.ZaloMiniAppContext.Models.Services.IconManagement.IconCategory? iconCategory = null;
                Data.ZaloMiniAppContext.Models.Services.IconManagement.IconGroup? iconGroup = null;

                if (request.IconCategoryPublicId.HasValue)
                {
                    iconCategory = await _dbContext.IconCategories
                        .FirstOrDefaultAsync(c => c.PublicId == request.IconCategoryPublicId && c.IsActive, cancellationToken);

                    if (iconCategory == null)
                    {
                        return new ApiResult<IconDto>
                        {
                            Success = false,
                            Message = "Không tìm thấy danh mục icon hoặc danh mục đã bị vô hiệu hóa"
                        };
                    }
                }

                if (request.IconGroupPublicId.HasValue)
                {
                    iconGroup = await _dbContext.IconGroups
                        .FirstOrDefaultAsync(g => g.PublicId == request.IconGroupPublicId && g.IsActive, cancellationToken);

                    if (iconGroup == null)
                    {
                        return new ApiResult<IconDto>
                        {
                            Success = false,
                            Message = "Không tìm thấy nhóm icon hoặc nhóm đã bị vô hiệu hóa"
                        };
                    }
                }

                string? iconImageUrl = null;
                Guid? imagePublicId = null;

                // Handle file upload pattern
                if (request.ImagePublicId.HasValue)
                {
                    var imageFile = await _fileContext.Files
                        .FirstOrDefaultAsync(f => f.PublicId == request.ImagePublicId, cancellationToken);

                    if (imageFile != null)
                    {
                        iconImageUrl = $"/api/files/{imageFile.PublicId}";
                        imagePublicId = request.ImagePublicId;
                    }
                }
                else if (!string.IsNullOrEmpty(request.IconImageUrl))
                {
                    // Backward compatibility - use provided URL
                    iconImageUrl = request.IconImageUrl;
                }

                var icon = new Data.ZaloMiniAppContext.Models.Services.IconManagement.Icon
                {
                    IconCategoryId = iconCategory?.Id,
                    IconGroupId = iconGroup?.Id,
                    Name = request.Name,
                    Description = request.Description,
                    IconImageUrl = iconImageUrl,
                    ImagePublicId = imagePublicId,
                    IconType = request.IconType,
                    ScreenParams = request.ScreenParams,
                    WebLink = request.WebLink,
                    LinkAndroid = request.LinkAndroid,
                    LinkIOS = request.LinkIOS,
                    DisplayOrder = request.DisplayOrder,
                    ThuTu = request.ThuTu ?? request.DisplayOrder,
                    IsActive = true
                };

                _dbContext.Icons.Add(icon);
                await _dbContext.SaveChangesAsync(cancellationToken);

                var result = new IconDto
                {
                    PublicId = icon.PublicId,
                    IconCategoryPublicId = iconCategory?.PublicId,
                    IconGroupPublicId = iconGroup?.PublicId,
                    Name = icon.Name,
                    Description = icon.Description,
                    IconImageUrl = icon.IconImageUrl,
                    ImagePublicId = icon.ImagePublicId,
                    IconType = icon.IconType,
                    ScreenParams = icon.ScreenParams,
                    WebLink = icon.WebLink,
                    LinkAndroid = icon.LinkAndroid,
                    LinkIOS = icon.LinkIOS,
                    DisplayOrder = icon.DisplayOrder,
                    ThuTu = icon.ThuTu,
                    IsActive = icon.IsActive,
                    CreatedAt = icon.CreatedAt,
                    UpdatedAt = icon.UpdatedAt,
                    IconCategoryName = iconCategory?.Name,
                    IconGroupName = iconGroup?.Name
                };

                return new ApiResult<IconDto>
                {
                    Success = true,
                    Data = result,
                    Message = "Tạo icon thành công"
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<IconDto>
                {
                    Success = false,
                    Message = $"Lỗi tạo icon: {ex.Message}"
                };
            }
        }
    }

}
