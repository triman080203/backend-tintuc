using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Destinations;

[ApiController]
[Route("api/zalo-mini-app/admin/destinations")]
[Tags("ZaloMiniAppDestinationsAdmin")]
[Authorize] // Admin only
public class DestinationsAdminController : ControllerBase
{
    private readonly ISender _sender;

    public DestinationsAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<DestinationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDestinations([FromQuery] GetDestinations.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<DestinationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDestinationById(Guid publicId)
    {
        var result = await _sender.Send(new GetDestinationById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<DestinationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateDestination([FromBody] CreateDestination.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<DestinationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateDestination([FromBody] UpdateDestination.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteDestination([FromBody] DeleteDestination.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
