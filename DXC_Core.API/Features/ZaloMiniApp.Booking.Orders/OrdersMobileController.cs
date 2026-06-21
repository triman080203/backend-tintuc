using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Booking.Orders;

[ApiController]
[Route("api/zalo-mini-app/mobile/orders")]
[Tags("ZaloMiniAppOrdersMobile")]
public class OrdersMobileController : ControllerBase
{
    private readonly ISender _sender;

    public OrdersMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<BookingOrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrder.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("cancel")]
    [ProducesResponseType(typeof(ApiResult<BookingOrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CancelOrder([FromBody] CancelOrder.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<BookingOrderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrderById(Guid publicId)
    {
        var result = await _sender.Send(new GetOrderById.Query { PublicId = publicId });
        return Ok(result);
    }
}
