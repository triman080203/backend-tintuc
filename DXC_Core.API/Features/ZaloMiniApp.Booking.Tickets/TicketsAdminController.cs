using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Tickets;

[ApiController]
[Route("api/zalo-mini-app/admin/tickets")]
[Tags("ZaloMiniAppTicketsAdmin")]
[Authorize] // Admin only
public class TicketsAdminController : ControllerBase
{
    private readonly ISender _sender;

    public TicketsAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<TicketDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTickets([FromQuery] GetTickets.Query query)
    {
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

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<TicketDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateTicket([FromBody] CreateTicket.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<TicketDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateTicket([FromBody] UpdateTicket.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteTicket([FromBody] DeleteTicket.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
