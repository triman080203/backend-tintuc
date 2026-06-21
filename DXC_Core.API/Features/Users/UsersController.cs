using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.Users;

[ApiController]
[Route("api/users")]
[Tags("Users")]
[Authorize(Roles = "admin")] // Protect all endpoints in this controller, only Admin can access
public class UsersController : ControllerBase
{
    private readonly ISender _sender;

    public UsersController(ISender sender)
    {
        _sender = sender;
    }

    // --- User management endpoints (admin only) ---

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<string>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateUser([FromBody] CreateUser.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUser.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteUser([FromBody] DeleteUser.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("update-roles")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUserRoles([FromBody] UpdateUserRoles.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<UserWithRolesDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers([FromQuery] GetUsers.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // --- Role management endpoints (admin only) ---

    [HttpPost("roles/create")]
    [ProducesResponseType(typeof(ApiResult<int>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateRole([FromBody] CreateRole.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("roles")]
    [ProducesResponseType(typeof(PagedResult<RoleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoles([FromQuery] GetRoles.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("roles/{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<RoleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoleById(Guid publicId)
    {
        var result = await _sender.Send(new GetRoleById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("roles/update")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateRole([FromBody] UpdateRole.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("roles/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteRole([FromBody] DeleteRole.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // --- User detail endpoints ---

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserByPublicId([FromRoute] Guid publicId)
    {
        var result = await _sender.Send(new GetUserByPublicId.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetUserPassword.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
