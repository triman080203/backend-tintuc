using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopEnterprisesMobile
{
    public class Query : IRequest<ApiResult<List<OcopEnterpriseMobileDto>>>
    {
    }

    public class Handler : IRequestHandler<Query, ApiResult<List<OcopEnterpriseMobileDto>>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<List<OcopEnterpriseMobileDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var enterprises = await _context.OcopEnterprises
                .Where(e => e.IsActive)
                .OrderBy(e => e.Name)
                .Select(e => new OcopEnterpriseMobileDto
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

            return new ApiResult<List<OcopEnterpriseMobileDto>>
            {
                Success = true,
                Data = enterprises,
                Message = "Lấy danh sách doanh nghiệp OCOP thành công"
            };
        }
    }
}