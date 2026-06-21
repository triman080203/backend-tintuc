using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopEnterprises
{
    public class Query : IRequest<PagedResult<OcopEnterpriseDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? TaxCode { get; set; }
        public string? Representative { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<OcopEnterpriseDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<OcopEnterpriseDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.OcopEnterprises.AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                query = query.Where(e => e.Name.Contains(request.Name));
            }

            if (!string.IsNullOrWhiteSpace(request.TaxCode))
            {
                query = query.Where(e => e.TaxCode != null && e.TaxCode.Contains(request.TaxCode));
            }

            if (!string.IsNullOrWhiteSpace(request.Representative))
            {
                query = query.Where(e => e.Representative != null && e.Representative.Contains(request.Representative));
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(e => e.IsActive == request.IsActive.Value);
            }

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var enterprises = await query
                .OrderBy(e => e.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(e => new OcopEnterpriseDto
                {
                    PublicId = e.PublicId,
                    Name = e.Name,
                    PhoneNumber = e.PhoneNumber,
                    Representative = e.Representative,
                    TaxCode = e.TaxCode,
                    EstablishedYear = e.EstablishedYear,
                    Address = e.Address,
                    OcopCertificateNumber = e.OcopCertificateNumber,
                    Latitude = e.Latitude,
                    Longitude = e.Longitude,
                    IsActive = e.IsActive,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<OcopEnterpriseDto>
            {
                Success = true,
                Data = enterprises,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách doanh nghiệp OCOP thành công"
            };
        }
    }
}