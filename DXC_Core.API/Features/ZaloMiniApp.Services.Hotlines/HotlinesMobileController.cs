using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Hotlines;

[ApiController]
[Route("api/zalo-mini-app/mobile/services/hotlines")]
[AllowAnonymous] // Public API cho mobile
public class HotlinesMobileController : ControllerBase
{
    private readonly ISender _sender;

    public HotlinesMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("all")]
    [ProducesResponseType(typeof(ApiResult<List<HotlineCategoryMobileDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllHotlines()
    {
        var result = await _sender.Send(new GetAllHotlines.Query());
        return Ok(result);
    }

    [HttpGet("categories/{categoryPublicId}/hotlines")]
    [ProducesResponseType(typeof(ApiResult<List<HotlineDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHotlinesByCategory(Guid categoryPublicId)
    {
        var result = await _sender.Send(new GetHotlinesByCategory.Query { CategoryPublicId = categoryPublicId });
        return Ok(result);
    }
}