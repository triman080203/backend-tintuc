using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopProducts
{
    public class Query : IRequest<PagedResult<OcopProductDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public Guid? CategoryPublicId { get; set; }
        public Guid? EnterprisePublicId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<OcopProductDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<OcopProductDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.OcopProducts
                .Include(p => p.Category)
                .Include(p => p.Enterprise)
                .Include(p => p.Images)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(p => p.Name.Contains(request.Name));
            }

            if (request.CategoryPublicId.HasValue)
            {
                query = query.Where(p => p.Category != null && p.Category.PublicId == request.CategoryPublicId.Value);
            }

            if (request.EnterprisePublicId.HasValue)
            {
                query = query.Where(p => p.Enterprise != null && p.Enterprise.PublicId == request.EnterprisePublicId.Value);
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.ReferencePrice >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.ReferencePrice <= request.MaxPrice.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(p => p.IsActive == request.IsActive.Value);
            }

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var products = await query
                .OrderBy(p => p.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new OcopProductDto
                {
                    PublicId = p.PublicId,
                    Name = p.Name,
                    Description = p.Description,
                    ReferencePrice = p.ReferencePrice,
                    PromotionalPrice = p.PromotionalPrice,
                    ContactPhone = p.ContactPhone,
                    ContactAddress = p.ContactAddress,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    Category = p.Category != null ? new OcopProductCategoryDto
                    {
                        PublicId = p.Category.PublicId,
                        Name = p.Category.Name,
                        Description = p.Category.Description,
                        ImageUrl = p.Category.ImagePublicId.HasValue ? $"/api/files/{p.Category.ImagePublicId}" : p.Category.ImageUrl,
                        ImagePublicId = p.Category.ImagePublicId,
                        DisplayOrder = p.Category.DisplayOrder,
                        IsActive = p.Category.IsActive,
                        CreatedAt = p.Category.CreatedAt,
                        UpdatedAt = p.Category.UpdatedAt
                    } : null,
                    Enterprise = p.Enterprise != null ? new OcopEnterpriseDto
                    {
                        PublicId = p.Enterprise.PublicId,
                        Name = p.Enterprise.Name,
                        PhoneNumber = p.Enterprise.PhoneNumber,
                        Representative = p.Enterprise.Representative,
                        TaxCode = p.Enterprise.TaxCode,
                        EstablishedYear = p.Enterprise.EstablishedYear,
                        Address = p.Enterprise.Address,
                        OcopCertificateNumber = p.Enterprise.OcopCertificateNumber,
                        Latitude = p.Enterprise.Latitude,
                        Longitude = p.Enterprise.Longitude,
                        IsActive = p.Enterprise.IsActive,
                        CreatedAt = p.Enterprise.CreatedAt,
                        UpdatedAt = p.Enterprise.UpdatedAt
                    } : null,
                    Images = p.Images.Select(img => new OcopProductImageDto
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
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<OcopProductDto>
            {
                Success = true,
                Data = products,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách sản phẩm OCOP thành công"
            };
        }
    }
}
