using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Data.ZaloMiniAppContext.Models.Products;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

public static class UpdateOcopEnterprise
{
    public class Command : IRequest<ApiResult<OcopEnterpriseDto>>
    {
        public required Guid PublicId { get; set; }
        public required string Name { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Representative { get; set; }
        public string? TaxCode { get; set; }
        public int? EstablishedYear { get; set; }
        public string? Address { get; set; }
        public string? OcopCertificateNumber { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Validator(ZaloMiniAppDbContext context)
        {
            _context = context;

            RuleFor(x => x.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không được để trống");

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Tên doanh nghiệp không được để trống")
                .MaximumLength(255)
                .WithMessage("Tên doanh nghiệp không được vượt quá 255 ký tự");

            RuleFor(x => x.PhoneNumber)
                .MaximumLength(20)
                .WithMessage("Số điện thoại không được vượt quá 20 ký tự")
                .Matches(@"^[0-9+\-\s()]*$")
                .WithMessage("Số điện thoại không đúng định dạng");

            RuleFor(x => x.Representative)
                .MaximumLength(255)
                .WithMessage("Tên người đại diện không được vượt quá 255 ký tự");

            RuleFor(x => x.TaxCode)
                .MaximumLength(20)
                .WithMessage("Mã số thuế không được vượt quá 20 ký tự")
                .MustAsync(BeUniqueTaxCode)
                .WithMessage("Mã số thuế đã tồn tại trong hệ thống");

            RuleFor(x => x.EstablishedYear)
                .InclusiveBetween(1900, DateTime.UtcNow.Year)
                .WithMessage($"Năm thành lập phải từ 1900 đến {DateTime.UtcNow.Year}");

            RuleFor(x => x.Address)
                .MaximumLength(500)
                .WithMessage("Địa chỉ không được vượt quá 500 ký tự");

            RuleFor(x => x.OcopCertificateNumber)
                .MaximumLength(100)
                .WithMessage("Số giấy chứng nhận OCOP không được vượt quá 100 ký tự");

            RuleFor(x => x.Latitude)
                .InclusiveBetween(-90, 90)
                .WithMessage("Vĩ độ phải trong khoảng -90 đến 90");

            RuleFor(x => x.Longitude)
                .InclusiveBetween(-180, 180)
                .WithMessage("Kinh độ phải trong khoảng -180 đến 180");
        }

        private async Task<bool> BeUniqueName(Command command, string name, CancellationToken cancellationToken)
        {
            return !await _context.OcopEnterprises
                .AnyAsync(e => e.Name == name && e.PublicId != command.PublicId, cancellationToken);
        }

        private async Task<bool> BeUniqueTaxCode(Command command, string taxCode, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(taxCode))
                return true;

            return !await _context.OcopEnterprises
                .AnyAsync(e => e.TaxCode == taxCode && e.PublicId != command.PublicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<OcopEnterpriseDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<OcopEnterpriseDto>> Handle(Command request, CancellationToken cancellationToken)
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

            enterprise.Name = request.Name;
            enterprise.PhoneNumber = request.PhoneNumber;
            enterprise.Representative = request.Representative;
            enterprise.TaxCode = request.TaxCode;
            enterprise.EstablishedYear = request.EstablishedYear;
            enterprise.Address = request.Address;
            enterprise.OcopCertificateNumber = request.OcopCertificateNumber;
            enterprise.Latitude = request.Latitude;
            enterprise.Longitude = request.Longitude;
            enterprise.IsActive = request.IsActive;
            enterprise.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

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
                Message = "Cập nhật doanh nghiệp OCOP thành công"
            };
        }
    }
}