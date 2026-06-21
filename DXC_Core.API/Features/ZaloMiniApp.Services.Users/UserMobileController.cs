using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

[ApiController]
[Route("api/zalo-mini-app/mobile/user")]
[AllowAnonymous]
public class UserMobileController : ControllerBase
{
    private readonly ISender _sender;

    public UserMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("total-users/create")]
    [Consumes("application/json")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateTotalUser([FromBody] CreateTotalUser.Command command)
    {
        command.PhanQuyen = null;
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("total-users")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(PagedResult<TotalUserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotalUsers([FromQuery] GetTotalUsers.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }
}
