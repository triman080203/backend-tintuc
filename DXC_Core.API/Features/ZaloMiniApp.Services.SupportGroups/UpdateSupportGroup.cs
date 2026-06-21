using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

public static class UpdateSupportGroup
{
    public class Command : IRequest<ApiResult<SupportGroupDto>>
    {
        public required Guid PublicId { get; set; }
        public required Guid CategoryPublicId { get; set; }
        public required string GroupName { get; set; }
        public required string GroupLink { get; set; }
        public required string GroupType { get; set; }
        public string? Description { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext zaloContext)
        {
            RuleFor(c => c.GroupName)
                .NotEmpty()
                .WithMessage("Tên nhóm không được để trống")
                .MaximumLength(255)
                .WithMessage("Tên nhóm không được vượt quá 255 ký tự");

            RuleFor(c => c.GroupLink)
                .NotEmpty()
                .WithMessage("Link nhóm không được để trống")
                .MaximumLength(500)
                .WithMessage("Link nhóm không được vượt quá 500 ký tự")
                .Must(link => Uri.TryCreate(link, UriKind.Absolute, out _))
                .WithMessage("Link nhóm không đúng định dạng URL");

            RuleFor(c => c.GroupType)
                .NotEmpty()
                .WithMessage("Loại nhóm không được để trống")
                .MaximumLength(50)
                .WithMessage("Loại nhóm không được vượt quá 50 ký tự")
                .Must(type => new[] { "Zalo", "Facebook", "Telegram", "Discord", "Slack" }.Contains(type))
                .WithMessage("Loại nhóm không hợp lệ");

            RuleFor(c => c.CategoryPublicId)
                .MustAsync(async (categoryPublicId, cancellation) =>
                    await zaloContext.SupportGroupCategories
                        .AnyAsync(c => c.PublicId == categoryPublicId && c.IsActive, cancellation))
                .WithMessage("Danh mục không tồn tại hoặc đã bị vô hiệu hóa");

            RuleFor(c => c.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<SupportGroupDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;

        public Handler(ZaloMiniAppDbContext zaloContext)
        {
            _zaloContext = zaloContext;
        }

        public async Task<ApiResult<SupportGroupDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var supportGroup = await _zaloContext.SupportGroups
                .FirstOrDefaultAsync(sg => sg.PublicId == request.PublicId && sg.IsActive, cancellationToken);

            if (supportGroup == null)
            {
                return new ApiResult<SupportGroupDto>
                {
                    Success = false,
                    Message = "Không tìm thấy nhóm hỗ trợ"
                };
            }

            var category = await _zaloContext.SupportGroupCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.CategoryPublicId && c.IsActive, cancellationToken);

            if (category == null)
            {
                return new ApiResult<SupportGroupDto>
                {
                    Success = false,
                    Message = "Không tìm thấy danh mục nhóm hỗ trợ"
                };
            }

            supportGroup.CategoryId = category.Id;
            supportGroup.GroupName = request.GroupName;
            supportGroup.GroupLink = request.GroupLink;
            supportGroup.GroupType = request.GroupType;
            supportGroup.Description = request.Description;
            supportGroup.UpdatedAt = DateTime.UtcNow;

            await _zaloContext.SaveChangesAsync(cancellationToken);

            var supportGroupDto = new SupportGroupDto
            {
                PublicId = supportGroup.PublicId,
                CategoryPublicId = category.PublicId,
                CategoryName = category.Name,
                GroupName = supportGroup.GroupName,
                GroupLink = supportGroup.GroupLink,
                GroupType = supportGroup.GroupType,
                Description = supportGroup.Description,
                IsActive = supportGroup.IsActive,
                CreatedAt = supportGroup.CreatedAt,
                UpdatedAt = supportGroup.UpdatedAt
            };

            return new ApiResult<SupportGroupDto>
            {
                Success = true,
                Data = supportGroupDto,
                Message = "Cập nhật nhóm hỗ trợ thành công"
            };
        }
    }
}