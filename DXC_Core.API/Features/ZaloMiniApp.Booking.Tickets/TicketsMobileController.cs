using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tickets;

[ApiController]
[Route("api/zalo-mini-app/mobile/tickets")]
[Tags("ZaloMiniAppTicketsMobile")]
public class TicketsMobileController : ControllerBase
{
    private readonly ISender _sender;

    public TicketsMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TicketDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTickets([FromQuery] GetTickets.Query query)
    {
        query.IsActive = true;
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<TicketDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTicketById(Guid publicId)
    {
        var result = await _sender.Send(new GetTicketById.Query { PublicId = publicId });
        return Ok(result);
    }
}
