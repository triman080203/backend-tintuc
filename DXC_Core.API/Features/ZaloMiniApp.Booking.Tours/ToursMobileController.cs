using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tours;

[ApiController]
[Route("api/zalo-mini-app/mobile/tours")]
[Tags("ZaloMiniAppToursMobile")]
public class ToursMobileController : ControllerBase
{
    private readonly ISender _sender;

    public ToursMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TourDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTours([FromQuery] GetTours.Query query)
    {
        query.IsActive = true;
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<TourDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTourById(Guid publicId)
    {
        var result = await _sender.Send(new GetTourById.Query { PublicId = publicId });
        return Ok(result);
    }
}
