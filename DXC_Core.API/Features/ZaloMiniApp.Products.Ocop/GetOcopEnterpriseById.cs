using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class GetOcopEnterpriseById
{
    public class Query : IRequest<ApiResult<OcopEnterpriseDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<OcopEnterpriseDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<OcopEnterpriseDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var enterprise = await _context.OcopEnterprises
                .FirstOrDefaultAsync(e => e.PublicId == request.PublicId, cancellationToken);

            if (enterprise == null)
            {
                return new ApiResult<OcopEnterpriseDto>
                {
                    Success = false,
                    Message = "Không tìm thấy doanh nghiệp OCOP"
                };
            }

            var enterpriseDto = new OcopEnterpriseDto
            {
                PublicId = enterprise.PublicId,
                Name = enterprise.Name,
                PhoneNumber = enterprise.PhoneNumber,
                Representative = enterprise.Representative,
                TaxCode = enterprise.TaxCode,
                EstablishedYear = enterprise.EstablishedYear,
                Address = enterprise.Address,
                OcopCertificateNumber = enterprise.OcopCertificateNumber,
                Latitude = enterprise.Latitude,
                Longitude = enterprise.Longitude,
                IsActive = enterprise.IsActive,
                CreatedAt = enterprise.CreatedAt,
                UpdatedAt = enterprise.UpdatedAt
            };

            return new ApiResult<OcopEnterpriseDto>
            {
                Success = true,
                Data = enterpriseDto,
                Message = "Lấy thông tin doanh nghiệp OCOP thành công"
            };
        }
    }
}