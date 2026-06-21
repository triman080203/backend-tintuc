using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Destinations;

[ApiController]
[Route("api/zalo-mini-app/mobile/destinations")]
[Tags("ZaloMiniAppDestinationsMobile")]
public class DestinationsMobileController : ControllerBase
{
    private readonly ISender _sender;

    public DestinationsMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<DestinationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDestinations([FromQuery] GetDestinations.Query query)
    {
        query.IsActive = true;
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
}
