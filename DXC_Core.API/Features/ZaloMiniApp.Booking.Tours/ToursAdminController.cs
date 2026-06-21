using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tours;

[ApiController]
[Route("api/zalo-mini-app/admin/tours")]
[Tags("ZaloMiniAppToursAdmin")]
[Authorize] // Admin only
public class ToursAdminController : ControllerBase
{
    private readonly ISender _sender;

    public ToursAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TourDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTours([FromQuery] GetTours.Query query)
    {
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

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<TourDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateTour([FromBody] CreateTour.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<TourDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateTour([FromBody] UpdateTour.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteTour([FromBody] DeleteTour.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
