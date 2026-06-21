using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class CreateOcopProduct
{
    public class Command : IRequest<ApiResult<OcopProductDto>>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public Guid CategoryPublicId { get; set; }
        public Guid EnterprisePublicId { get; set; }
        public decimal? ReferencePrice { get; set; }
        public decimal? PromotionalPrice { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactAddress { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public List<Guid>? ImagePublicIds { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;
        private readonly FileDbContext _fileContext;

        public Validator(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            _zaloContext = zaloContext;
            _fileContext = fileContext;

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Tên sản phẩm không được để trống")
                .MaximumLength(255)
                .WithMessage("Tên sản phẩm không được vượt quá 255 ký tự");

            RuleFor(x => x.Description)
                .MaximumLength(1000)
                .WithMessage("Mô tả sản phẩm không được vượt quá 1000 ký tự");

            RuleFor(x => x.CategoryPublicId)
                .NotEqual(Guid.Empty)
                .WithMessage("Danh mục sản phẩm không hợp lệ")
                .MustAsync(CategoryExists)
                .WithMessage("Danh mục sản phẩm không tồn tại");

            RuleFor(x => x.EnterprisePublicId)
                .NotEqual(Guid.Empty)
                .WithMessage("Doanh nghiệp không hợp lệ")
                .MustAsync(EnterpriseExists)
                .WithMessage("Doanh nghiệp không tồn tại");

            RuleFor(x => x.ReferencePrice)
                .GreaterThan(0)
                .WithMessage("Giá tham khảo phải lớn hơn 0")
                .When(x => x.ReferencePrice.HasValue);

            RuleFor(x => x.PromotionalPrice)
                .GreaterThan(0)
                .WithMessage("Giá khuyến mãi phải lớn hơn 0")
                .LessThanOrEqualTo(x => x.ReferencePrice ?? decimal.MaxValue)
                .WithMessage("Giá khuyến mãi không được lớn hơn giá tham khảo")
                .When(x => x.PromotionalPrice.HasValue);

            RuleFor(x => x.ContactPhone)
                .MaximumLength(20)
                .WithMessage("Số điện thoại liên hệ không được vượt quá 20 ký tự")
                .Matches(@"^[0-9+\-\s()]*$")
                .WithMessage("Số điện thoại liên hệ không đúng định dạng");

            RuleFor(x => x.ContactAddress)
                .MaximumLength(500)
                .WithMessage("Địa chỉ liên hệ không được vượt quá 500 ký tự");

            RuleFor(x => x.Latitude)
                .InclusiveBetween(-90, 90)
                .WithMessage("Vĩ độ phải trong khoảng -90 đến 90");

            RuleFor(x => x.Longitude)
                .InclusiveBetween(-180, 180)
                .WithMessage("Kinh độ phải trong khoảng -180 đến 180");

            RuleFor(x => x.ImagePublicIds)
                .MustAsync(async (ids, cancellation) =>
                {
                    if (ids == null || !ids.Any()) return true;
                    var count = await _fileContext.Files.CountAsync(f => ids.Contains(f.PublicId), cancellation);
                    return count == ids.Count;
                })
                .WithMessage("Một hoặc nhiều PublicId của hình ảnh không hợp lệ hoặc không tồn tại.")
                .When(x => x.ImagePublicIds != null && x.ImagePublicIds.Any());
        }

        private async Task<bool> BeUniqueName(Command command, string name, CancellationToken cancellationToken)
        {
            return !await _zaloContext.OcopProducts
                .AnyAsync(p => p.Name == name, cancellationToken);
        }

        private async Task<bool> CategoryExists(Guid categoryPublicId, CancellationToken cancellationToken)
        {
            return await _zaloContext.OcopProductCategories
                .AnyAsync(c => c.PublicId == categoryPublicId && c.IsActive, cancellationToken);
        }

        private async Task<bool> EnterpriseExists(Guid enterprisePublicId, CancellationToken cancellationToken)
        {
            return await _zaloContext.OcopEnterprises
                .AnyAsync(e => e.PublicId == enterprisePublicId && e.IsActive, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<OcopProductDto>>
    {
        private readonly ZaloMiniAppDbContext _zaloContext;
        private readonly FileDbContext _fileContext;

        public Handler(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext)
        {
            _zaloContext = zaloContext;
            _fileContext = fileContext;
        }

        public async Task<ApiResult<OcopProductDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var category = await _zaloContext.OcopProductCategories
                .FirstOrDefaultAsync(c => c.PublicId == request.CategoryPublicId, cancellationToken);

            var enterprise = await _zaloContext.OcopEnterprises
                .FirstOrDefaultAsync(e => e.PublicId == request.EnterprisePublicId, cancellationToken);

            var product = new OcopProduct
            {
                PublicId = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                CategoryId = category!.Id,
                EnterpriseId = enterprise!.Id,
                ReferencePrice = request.ReferencePrice,
                PromotionalPrice = request.PromotionalPrice,
                ContactPhone = request.ContactPhone,
                ContactAddress = request.ContactAddress,
                Latitude = request.Latitude,
                Longitude = request.Longitude
            };

            _zaloContext.OcopProducts.Add(product);

            // Xử lý liên kết hình ảnh
            if (request.ImagePublicIds != null && request.ImagePublicIds.Any())
            {
                var imageFiles = await _fileContext.Files
                    .Where(f => request.ImagePublicIds.Contains(f.PublicId))
                    .ToListAsync(cancellationToken);

                int displayOrder = 0;
                foreach (var file in imageFiles)
                {
                    var productImage = new OcopProductImage
                    {
                        PublicId = Guid.NewGuid(),
                        ProductId = product.Id,
                        ImageUrl = $"/api/files/{file.PublicId}",
                        ImagePublicId = file.PublicId,
                        DisplayOrder = displayOrder,
                        IsPrimary = (displayOrder == 0)
                    };
                    product.Images.Add(productImage);
                    displayOrder++;
                }
            }

            await _zaloContext.SaveChangesAsync(cancellationToken);

            // Load navigation properties for response
            await _zaloContext.Entry(product)
                .Reference(p => p.Category)
                .LoadAsync(cancellationToken);

            await _zaloContext.Entry(product)
                .Reference(p => p.Enterprise)
                .LoadAsync(cancellationToken);

            var productDto = new OcopProductDto
            {
                PublicId = product.PublicId,
                Name = product.Name,
                Description = product.Description,
                ReferencePrice = product.ReferencePrice,
                PromotionalPrice = product.PromotionalPrice,
                ContactPhone = product.ContactPhone,
                ContactAddress = product.ContactAddress,
                Latitude = product.Latitude,
                Longitude = product.Longitude,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                Category = product.Category != null ? new OcopProductCategoryDto
                {
                    PublicId = product.Category.PublicId,
                    Name = product.Category.Name,
                    Description = product.Category.Description,
                    ImageUrl = product.Category.ImagePublicId.HasValue ? $"/api/files/{product.Category.ImagePublicId}" : product.Category.ImageUrl,
                    ImagePublicId = product.Category.ImagePublicId,
                    DisplayOrder = product.Category.DisplayOrder,
                    IsActive = product.Category.IsActive,
                    CreatedAt = product.Category.CreatedAt,
                    UpdatedAt = product.Category.UpdatedAt
                } : null,
                Enterprise = product.Enterprise != null ? new OcopEnterpriseDto
                {
                    PublicId = product.Enterprise.PublicId,
                    Name = product.Enterprise.Name,
                    PhoneNumber = product.Enterprise.PhoneNumber,
                    Representative = product.Enterprise.Representative,
                    TaxCode = product.Enterprise.TaxCode,
                    EstablishedYear = product.Enterprise.EstablishedYear,
                    Address = product.Enterprise.Address,
                    OcopCertificateNumber = product.Enterprise.OcopCertificateNumber,
                    Latitude = product.Enterprise.Latitude,
                    Longitude = product.Enterprise.Longitude,
                    IsActive = product.Enterprise.IsActive,
                    CreatedAt = product.Enterprise.CreatedAt,
                    UpdatedAt = product.Enterprise.UpdatedAt
                } : null,
                Images = product.Images.Select(img => new OcopProductImageDto
                {
                    PublicId = img.PublicId,
                    ProductId = img.ProductId,
                    ImageUrl = img.ImageUrl,
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption,
                    CreatedAt = img.CreatedAt
                }).ToList()
            };

            return new ApiResult<OcopProductDto>
            {
                Success = true,
                Data = productDto,
                Message = "Tạo sản phẩm OCOP thành công"
            };
        }
    }
}
