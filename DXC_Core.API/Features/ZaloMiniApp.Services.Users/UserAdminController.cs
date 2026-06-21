using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Users;

[ApiController]
[Route("api/zalo-mini-app/admin/user")]
[Produces("application/json")]
[Tags("Zalo Mini App - User Admin")]
public class UserAdminController : ControllerBase
{
    private readonly ISender _sender;

    public UserAdminController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy thông tin số điện thoại của người dùng từ Zalo (Admin)
    /// </summary>
    /// <param name="request">Request chứa token và access token</param>
    /// <returns>Thông tin số điện thoại</returns>
    [HttpPost("get-phone-number")]
    [ProducesResponseType(typeof(ApiResult<GetPhoneNumberResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<GetPhoneNumberResponseDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<GetPhoneNumberResponseDto>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPhoneNumber([FromBody] GetPhoneNumberRequestDto request)
    {
        var command = new GetPhoneNumber.Command
        {
            Token = request.Token,
            AccessToken = request.AccessToken
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("total-users/create")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTotalUser([FromBody] CreateTotalUser.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("total-users")]
    [ProducesResponseType(typeof(PagedResult<TotalUserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTotalUsers([FromQuery] GetTotalUsers.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("total-users/{id:int}")]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTotalUserById([FromRoute] int id)
    {
        var result = await _sender.Send(new GetTotalUserById.Query { Id = id });
        return Ok(result);
    }

    [HttpGet("total-users/by-username/{username}")]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTotalUserByUsername([FromRoute] string username)
    {
        var result = await _sender.Send(new GetTotalUserByUsername.Query { Username = username });
        return Ok(result);
    }

    [HttpGet("total-users/by-user-id/{userId}")]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTotalUserByUserId([FromRoute] string userId)
    {
        var result = await _sender.Send(new GetTotalUserByUserId.Query { UserId = userId });
        return Ok(result);
    }


    [HttpPost("total-users/update")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<TotalUserDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateTotalUser([FromBody] UpdateTotalUser.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("total-users/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTotalUser([FromBody] DeleteTotalUser.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
