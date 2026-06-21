using DXC_Core.API.Features.ZaloMiniApp.Services.Banners;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Banners;

[ApiController]
[Route("api/zalo-mini-app/admin/banners")]
[Authorize]
public class BannersAdminController : ControllerBase
{
    private readonly ISender _sender;

    public BannersAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<BannerDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<BannerDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateBanner.Command command)
    {
        var result = await _sender.Send(command);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<BannerDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<BannerDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid publicId)
    {
        var result = await _sender.Send(new GetBannerById.Query { PublicId = publicId });
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<BannerDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetBanners.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<BannerDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<BannerDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<BannerDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] UpdateBanner.Command command)
    {
        var result = await _sender.Send(command);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete([FromBody] DeleteBanner.Command command)
    {
        var result = await _sender.Send(command);
        return result.Success ? Ok(result) : NotFound(result);
    }
}