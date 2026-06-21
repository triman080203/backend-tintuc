using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

[ApiController]
[Route("api/zalo-mini-app/admin/services")]
[Authorize]
public class IconManagementAdminController : ControllerBase
{
    private readonly ISender _sender;

    public IconManagementAdminController(ISender sender)
    {
        _sender = sender;
    }

    // Icon Categories Endpoints
    [HttpPost("icon-categories/create")]
    [ProducesResponseType(typeof(ApiResult<IconCategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconCategoryDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateIconCategory([FromBody] CreateIconCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("icon-categories")]
    [ProducesResponseType(typeof(PagedResult<IconCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIconCategories([FromQuery] GetIconCategories.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("icon-categories/{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<IconCategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconCategoryDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIconCategoryById([FromRoute] Guid publicId)
    {
        var result = await _sender.Send(new GetIconCategoryById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("icon-categories/update")]
    [ProducesResponseType(typeof(ApiResult<IconCategoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconCategoryDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<IconCategoryDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateIconCategory([FromBody] UpdateIconCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("icon-categories/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteIconCategory([FromBody] DeleteIconCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("icon-categories/enum/all")]
    [ProducesResponseType(typeof(ApiResult<List<EnumResult<Guid>>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIconCategoriesEnum()
    {
        var query = new GetIconCategoriesEnum.Query();
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Icon Groups Endpoints
    [HttpPost("icon-groups/create")]
    [ProducesResponseType(typeof(ApiResult<IconGroupDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconGroupDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateIconGroup([FromBody] CreateIconGroup.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("icon-groups")]
    [ProducesResponseType(typeof(PagedResult<IconGroupDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIconGroups([FromQuery] GetIconGroups.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("icon-groups/{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<IconGroupDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconGroupDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIconGroupById([FromRoute] Guid publicId)
    {
        var result = await _sender.Send(new GetIconGroupById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("icon-groups/update")]
    [ProducesResponseType(typeof(ApiResult<IconGroupDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconGroupDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<IconGroupDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateIconGroup([FromBody] UpdateIconGroup.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("icon-groups/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteIconGroup([FromBody] DeleteIconGroup.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("icon-groups/enum/all")]
    [ProducesResponseType(typeof(ApiResult<List<EnumResult<Guid>>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIconGroupsEnum()
    {
        var query = new GetIconGroupsEnum.Query();
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Icons Endpoints
    [HttpPost("icons/create")]
    [ProducesResponseType(typeof(ApiResult<IconDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateIcon([FromBody] CreateIcon.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("icons")]
    [ProducesResponseType(typeof(PagedResult<IconDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIcons([FromQuery] GetIcons.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("icons/{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<IconDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIconById([FromRoute] Guid publicId)
    {
        var result = await _sender.Send(new GetIconById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("icons/update")]
    [ProducesResponseType(typeof(ApiResult<IconDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<IconDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<IconDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateIcon([FromBody] UpdateIcon.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("icons/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteIcon([FromBody] DeleteIcon.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}