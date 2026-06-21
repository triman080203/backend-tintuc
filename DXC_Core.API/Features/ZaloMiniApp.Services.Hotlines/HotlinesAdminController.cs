using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

[ApiController]
[Route("api/zalo-mini-app/admin/services/hotlines")]
[Authorize]
public class HotlinesAdminController : ControllerBase
{
    private readonly ISender _sender;

    public HotlinesAdminController(ISender sender)
    {
        _sender = sender;
    }

    // HotlineCategory Endpoints
    [HttpPost("categories/create")]
    [ProducesResponseType(typeof(ApiResult<HotlineCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateCategory([FromBody] CreateHotlineCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("categories")]
    [ProducesResponseType(typeof(PagedResult<HotlineCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories([FromQuery] GetHotlineCategories.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("categories/{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<HotlineCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategoryById(Guid publicId)
    {
        var result = await _sender.Send(new GetHotlineCategoryById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("categories/update")]
    [ProducesResponseType(typeof(ApiResult<HotlineCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCategory([FromBody] UpdateHotlineCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("categories/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteCategory([FromBody] DeleteHotlineCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Hotline Endpoints
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<HotlineDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateHotline([FromBody] CreateHotline.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<HotlineDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHotlines([FromQuery] GetHotlines.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<HotlineDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHotlineById(Guid publicId)
    {
        var result = await _sender.Send(new GetHotlineById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<HotlineDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateHotline([FromBody] UpdateHotline.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteHotline([FromBody] DeleteHotline.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("categories/{categoryPublicId:guid}/hotlines")]
    [ProducesResponseType(typeof(ApiResult<List<HotlineDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHotlinesByCategory(Guid categoryPublicId)
    {
        var result = await _sender.Send(new GetHotlinesByCategory.Query { CategoryPublicId = categoryPublicId });
        return Ok(result);
    }
}