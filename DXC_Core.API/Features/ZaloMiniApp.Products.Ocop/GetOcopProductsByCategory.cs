using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopProductsByCategory
{
    public class Query : IRequest<PagedResult<OcopProductDto>>
    {
        public Guid CategoryPublicId { get; set; } = Guid.Empty;
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.CategoryPublicId).NotEqual(Guid.Empty).WithMessage("CategoryPublicId là bắt buộc");
            RuleFor(x => x.Current).GreaterThan(0).WithMessage("Current phải lớn hơn 0");
            RuleFor(x => x.PageSize).GreaterThan(0).LessThanOrEqualTo(100).WithMessage("PageSize phải từ 1 đến 100");
            RuleFor(x => x.MinPrice).GreaterThanOrEqualTo(0).When(x => x.MinPrice.HasValue).WithMessage("MinPrice phải lớn hơn hoặc bằng 0");
            RuleFor(x => x.MaxPrice).GreaterThanOrEqualTo(0).When(x => x.MaxPrice.HasValue).WithMessage("MaxPrice phải lớn hơn hoặc bằng 0");
            RuleFor(x => x).Must(x => !x.MinPrice.HasValue || !x.MaxPrice.HasValue || x.MinPrice <= x.MaxPrice)
                .WithMessage("MinPrice phải nhỏ hơn hoặc bằng MaxPrice");
        }
    }

    public class Handler(ZaloMiniAppDbContext dbContext) : IRequestHandler<Query, PagedResult<OcopProductDto>>
    {
        public async Task<PagedResult<OcopProductDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = dbContext.OcopProducts
                .Include(p => p.Category)
                .Include(p => p.Enterprise)
                .Include(p => p.Images.Where(i => i.IsActive))
                .Where(p => p.IsActive && p.Category.IsActive)
                .Where(p => p.Category.PublicId == request.CategoryPublicId);

            // Áp dụng các filter
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(p => p.Name.Contains(request.Name));
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.ReferencePrice >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.ReferencePrice <= request.MaxPrice.Value);
            }

            var total = await query.CountAsync(cancellationToken);

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
                        ImageUrl = p.Category.ImageUrl,
                        DisplayOrder = p.Category.DisplayOrder,
                        IsActive = p.Category.IsActive
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
                        IsActive = p.Enterprise.IsActive
                    } : null,
                    Images = p.Images.Select(i => new OcopProductImageDto
                    {
                        PublicId = i.PublicId,
                        ImageUrl = i.ImageUrl,
                        DisplayOrder = i.DisplayOrder,
                        IsPrimary = i.IsPrimary,
                        IsActive = i.IsActive
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
                Message = $"Lấy thành công {products.Count} sản phẩm của danh mục"
            };
        }
    }
}