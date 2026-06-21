using DXC_Core.API.Features.ZaloMiniApp.Services.Banners;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

[ApiController]
[Route("api/zalo-mini-app/mobile/banners")]
public class BannersMobileController : ControllerBase
{
    private readonly ISender _sender;

    public BannersMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResult<List<BannerMobileDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBanners()
    {
        var result = await _sender.Send(new GetBannersMobile.Query());
        return Ok(result);
    }
}
