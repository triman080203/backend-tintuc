using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

public static class CreateBanner
{
    public class Command : IRequest<ApiResult<BannerDto>>
    {
        public required string Title { get; set; }
        public required Guid ImagePublicId { get; set; }
        public required string Position { get; set; }
        public required string BannerType { get; set; }
        public string? NativeParams { get; set; }
        public string? WebLink { get; set; }
        public int? ThuTu { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator(ZaloMiniAppDbContext context, FileDbContext fileContext)
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tiêu đề không được để trống")
                .MaximumLength(200).WithMessage("Tiêu đề không được vượt quá 200 ký tự");

            RuleFor(x => x.ImagePublicId)
                .NotEmpty().WithMessage("ImagePublicId không được để trống")
                .MustAsync(async (id, cancellation) =>
                    await fileContext.Files.AnyAsync(f => f.PublicId == id, cancellation))
                .WithMessage("ImagePublicId không tồn tại");

            RuleFor(x => x.Position)
                .Must(x => new[] { "top", "middle", "bottom" }.Contains(x))
                .WithMessage("Vị trí phải là: top, middle, hoặc bottom");

            RuleFor(x => x.BannerType)
                .Must(x => new[] { "native", "web" }.Contains(x))
                .WithMessage("Loại banner phải là: native hoặc web");

            RuleFor(x => x.NativeParams)
                .MaximumLength(500).WithMessage("NativeParams không được vượt quá 500 ký tự")
                .When(x => x.BannerType == "native");

            RuleFor(x => x.WebLink)
                .MaximumLength(500).WithMessage("WebLink không được vượt quá 500 ký tự")
                .Must(x => Uri.TryCreate(x, UriKind.Absolute, out _))
                .WithMessage("WebLink phải là URL hợp lệ")
                .When(x => x.BannerType == "web");
        }
    }

    public class Handler(ZaloMiniAppDbContext context) : IRequestHandler<Command, ApiResult<BannerDto>>
    {
        public async Task<ApiResult<BannerDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var maxOrder = await context.Banners.MaxAsync(b => (int?)b.ThuTu, cancellationToken) ?? -1;
            var nextOrder = (request.ThuTu.HasValue && request.ThuTu.Value >= 0) ? request.ThuTu.Value : maxOrder + 1;
            var banner = new Data.ZaloMiniAppContext.Models.Services.Banner
            {
                Title = request.Title,
                ImagePublicId = request.ImagePublicId,
                Position = request.Position,
                BannerType = request.BannerType,
                NativeParams = request.NativeParams,
                WebLink = request.WebLink,
                ThuTu = nextOrder
            };

            context.Banners.Add(banner);
            await context.SaveChangesAsync(cancellationToken);

            var bannerDto = new BannerDto
            {
                Id = banner.Id,
                PublicId = banner.PublicId,
                Title = banner.Title,
                ImagePublicId = banner.ImagePublicId,
                Position = banner.Position,
                BannerType = banner.BannerType,
                NativeParams = banner.NativeParams,
                WebLink = banner.WebLink,
                ThuTu = banner.ThuTu,
                IsActive = banner.IsActive,
                CreatedAt = banner.CreatedAt,
                UpdatedAt = banner.UpdatedAt
            };

            return new ApiResult<BannerDto> { Success = true, Data = bannerDto };
        }
    }
}
