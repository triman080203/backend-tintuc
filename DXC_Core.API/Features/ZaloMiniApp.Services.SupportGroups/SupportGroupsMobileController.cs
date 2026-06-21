using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.SupportGroups;

[ApiController]
[Route("api/zalo-mini-app/mobile/services/support-groups")]
public class SupportGroupsMobileController : ControllerBase
{
    private readonly ISender _sender;

    public SupportGroupsMobileController(ISender sender)
    {
        _sender = sender;
    }

    // SupportGroupCategory Endpoints for Mobile (Public access)
    [HttpGet("categories")]
    [ProducesResponseType(typeof(PagedResult<SupportGroupCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories([FromQuery] GetSupportGroupCategories.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("categories/{publicId}")]
    [ProducesResponseType(typeof(ApiResult<SupportGroupCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategoryById(Guid publicId)
    {
        var result = await _sender.Send(new GetSupportGroupCategoryById.Query { PublicId = publicId });
        return Ok(result);
    }

    // SupportGroup Endpoints for Mobile (Public access)
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<SupportGroupMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSupportGroups([FromQuery] GetSupportGroups.Query query)
    {
        var result = await _sender.Send(query);

        // Convert SupportGroupDto to SupportGroupMobileDto
        var mobileResult = new PagedResult<SupportGroupMobileDto>
        {
            Success = result.Success,
            Data = result.Data.Select(sg => new SupportGroupMobileDto
            {
                PublicId = sg.PublicId,
                GroupName = sg.GroupName,
                GroupLink = sg.GroupLink,
                GroupType = sg.GroupType,
                Description = sg.Description
            }),
            Total = result.Total,
            Current = result.Current,
            PageSize = result.PageSize,
            Message = result.Message
        };

        return Ok(mobileResult);
    }

    [HttpGet("{publicId}")]
    [ProducesResponseType(typeof(ApiResult<SupportGroupMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSupportGroupById(Guid publicId)
    {
        var result = await _sender.Send(new GetSupportGroupById.Query { PublicId = publicId });

        if (!result.Success || result.Data == null)
        {
            return Ok(result);
        }

        // Convert SupportGroupDto to SupportGroupMobileDto
        var mobileResult = new ApiResult<SupportGroupMobileDto>
        {
            Success = result.Success,
            Data = new SupportGroupMobileDto
            {
                PublicId = result.Data.PublicId,
                GroupName = result.Data.GroupName,
                GroupLink = result.Data.GroupLink,
                GroupType = result.Data.GroupType,
                Description = result.Data.Description
            },
            Message = result.Message
        };

        return Ok(mobileResult);
    }
}