using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

[ApiController]
[Route("api/zalo-mini-app/admin/services/support-groups")]
[Authorize]
public class SupportGroupsAdminController : ControllerBase
{
    private readonly ISender _sender;

    public SupportGroupsAdminController(ISender sender)
    {
        _sender = sender;
    }

    // SupportGroupCategory Endpoints
    [HttpPost("categories/create")]
    [ProducesResponseType(typeof(ApiResult<SupportGroupCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateCategory([FromBody] CreateSupportGroupCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("categories")]
    [ProducesResponseType(typeof(PagedResult<SupportGroupCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories([FromQuery] GetSupportGroupCategories.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("categories/{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<SupportGroupCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategoryById(Guid publicId)
    {
        var result = await _sender.Send(new GetSupportGroupCategoryById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("categories/update")]
    [ProducesResponseType(typeof(ApiResult<SupportGroupCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCategory([FromBody] UpdateSupportGroupCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("categories/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteCategory([FromBody] DeleteSupportGroupCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // SupportGroup Endpoints
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<SupportGroupDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateSupportGroup([FromBody] CreateSupportGroup.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<SupportGroupDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSupportGroups([FromQuery] GetSupportGroups.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<SupportGroupDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSupportGroupById(Guid publicId)
    {
        var result = await _sender.Send(new GetSupportGroupById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<SupportGroupDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateSupportGroup([FromBody] UpdateSupportGroup.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteSupportGroup([FromBody] DeleteSupportGroup.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}