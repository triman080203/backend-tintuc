using DXC_Core.API.Shared.Contracts;
using DXC_Core.API.Shared.Services;
using FluentValidation;
using MediatR;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

public static class GetPhoneNumber
{
    public class Command : IRequest<ApiResult<GetPhoneNumberResponseDto>>
    {
        public required string Token { get; set; }
        public required string AccessToken { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.Token).NotEmpty().WithMessage("Token không được để trống");
            RuleFor(c => c.AccessToken).NotEmpty().WithMessage("Access token không được để trống");
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<GetPhoneNumberResponseDto>>
    {
        private readonly IZaloPhoneNumberService _zaloPhoneNumberService;

        public Handler(IZaloPhoneNumberService zaloPhoneNumberService)
        {
            _zaloPhoneNumberService = zaloPhoneNumberService;
        }

        public async Task<ApiResult<GetPhoneNumberResponseDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            try
            {
                // Gọi Zalo API để lấy số điện thoại
                var phoneNumber = await _zaloPhoneNumberService.GetPhoneNumberAsync(request.Token, request.AccessToken);

                // Format số điện thoại để hiển thị (chuyển từ 84xxxxxxxxx thành 0xxxxxxxxx)
                var displayPhoneNumber = phoneNumber.StartsWith("84")
                    ? "0" + phoneNumber.Substring(2)
                    : phoneNumber;

                var result = new GetPhoneNumberResponseDto
                {
                    PhoneNumber = phoneNumber,
                    DisplayPhoneNumber = displayPhoneNumber
                };

                return new ApiResult<GetPhoneNumberResponseDto>
                {
                    Success = true,
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResult<GetPhoneNumberResponseDto>
                {
                    Success = false,
                    Message = $"Không thể lấy thông tin số điện thoại: {ex.Message}"
                };
            }
        }
    }
}