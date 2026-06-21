using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopProductByIdMobile
{
    public class Query : IRequest<ApiResult<OcopProductMobileDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<OcopProductMobileDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<OcopProductMobileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var product = await _context.OcopProducts
                .Include(p => p.Category)
                .Include(p => p.Enterprise)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.PublicId == request.PublicId && p.IsActive, cancellationToken);

            if (product == null)
            {
                return new ApiResult<OcopProductMobileDto>
                {
                    Success = false,
                    Message = "Không tìm thấy sản phẩm OCOP"
                };
            }

            var productDto = new OcopProductMobileDto
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
                    ImageUrl = product.Category.ImageUrl,
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

            return new ApiResult<OcopProductMobileDto>
            {
                Success = true,
                Data = productDto,
                Message = "Lấy thông tin sản phẩm OCOP thành công"
            };
        }
    }
}
