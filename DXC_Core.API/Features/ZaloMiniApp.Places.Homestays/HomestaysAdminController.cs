using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;

[ApiController]
[Route("api/zalo-mini-app/admin/homestays")]
[Authorize]
public class HomestaysAdminController : ControllerBase
{
    private readonly ISender _sender;

    public HomestaysAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<HomestayDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHomestays([FromQuery] GetHomestays.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<HomestayDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<HomestayDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHomestayById(Guid publicId)
    {
        var query = new GetHomestayById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<HomestayDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<HomestayDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateHomestay([FromBody] CreateHomestay.Command command)
    {
        var result = await _sender.Send(command);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<HomestayDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<HomestayDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<HomestayDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateHomestay([FromBody] UpdateHomestay.Command command)
    {
        var result = await _sender.Send(command);
        return result.Success ? Ok(result) : (result.Message != null && result.Message.Contains("không tìm thấy") ? NotFound(result) : BadRequest(result));
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<bool>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteHomestay([FromBody] DeleteHomestay.Command command)
    {
        var result = await _sender.Send(command);
        return result.Success ? Ok(result) : (result.Message != null && result.Message.Contains("không tìm thấy") ? NotFound(result) : BadRequest(result));
    }

}