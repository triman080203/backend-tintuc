using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Orders;

[ApiController]
[Route("api/zalo-mini-app/admin/orders")]
[Tags("ZaloMiniAppOrdersAdmin")]
[Authorize] // Admin only
public class OrdersAdminController : ControllerBase
{
    private readonly ISender _sender;

    public OrdersAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<BookingOrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrders([FromQuery] GetOrders.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<BookingOrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrderById(Guid publicId)
    {
        var result = await _sender.Send(new GetOrderById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<BookingOrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateOrder([FromBody] UpdateOrder.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteOrder([FromBody] DeleteOrder.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
