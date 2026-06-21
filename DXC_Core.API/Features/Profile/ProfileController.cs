using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace DXC_Core.API.Features.Profile;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly ISender _sender;

    public ProfileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResult<UserProfileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<UserProfileDto>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyProfile()
    {
        var result = await _sender.Send(new GetMyProfile.Query());
        return Ok(result);
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateProfile([FromBody] CreateProfile.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<ProfileDto>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfile.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}

[ApiController]
[Route("api/admin/profiles")]
[Authorize(Roles = "admin")]
public class ProfileAdminController : ControllerBase
{
    private readonly ISender _sender;

    public ProfileAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("{publicId}")]
    [ProducesResponseType(typeof(ApiResult<UserProfileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<UserProfileDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfileById(Guid publicId)
    {
        var result = await _sender.Send(new GetProfileById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProfile([FromBody] DeleteProfile.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
