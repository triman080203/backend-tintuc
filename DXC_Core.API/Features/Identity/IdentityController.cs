using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using DXC_Core.API.Features.Users; // Added to resolve UserDto

namespace DXC_Core.API.Features.Identity;

[ApiController]
[Route("api/identity")]
[Tags("Identity")]
public class IdentityController : ControllerBase
{
    private readonly ISender _sender;

    public IdentityController(ISender sender)
    {
        _sender = sender;
    }

    // --- Public endpoints ---

    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResult<string>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Register([FromBody] Register.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

     [HttpPost("login")]
     [ProducesResponseType(typeof(ApiResult<Login.LoginResult>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] Login.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }
    
    // --- Authenticated endpoints ---

    [HttpGet("current-user")] 
    [Authorize]
    [ProducesResponseType(typeof(ApiResult<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentUser() 
    {
        // This needs to use the UserDto from the *Users* feature now.
        var result = await _sender.Send(new GetCurrentUser.Query()); 
        return Ok(result);
    }

    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePassword.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("reset-my-password")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> ResetMyPassword([FromBody] ResetMyPassword.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
