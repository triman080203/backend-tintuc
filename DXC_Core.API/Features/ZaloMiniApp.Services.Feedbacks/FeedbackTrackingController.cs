using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

[ApiController]
[Route("api/zalo-mini-app/admin/feedback-tracking")]
[Authorize]
public class FeedbackTrackingController : ControllerBase
{
    private readonly ISender _sender;

    public FeedbackTrackingController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách phản ánh với khả năng theo dõi xử lý
    /// Có thể lọc theo trạng thái, tiêu đề, số điện thoại
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<FeedbackTrackingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFeedbackTrackingList(
        [FromQuery] int current = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? title = null,
        [FromQuery] string? phoneNumber = null,
        [FromQuery] int? currentStatusId = null,
        [FromQuery] string? currentStatusCode = null,
        [FromQuery] Guid? assignedDepartmentPublicId = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] DateTime? createdFrom = null,
        [FromQuery] DateTime? createdTo = null)
    {
        var query = new GetFeedbackTrackingList.Query
        {
            Current = current,
            PageSize = pageSize,
            Title = title,
            PhoneNumber = phoneNumber,
            CurrentStatusId = currentStatusId,
            CurrentStatusCode = currentStatusCode,
            AssignedDepartmentPublicId = assignedDepartmentPublicId,
            IsActive = isActive,
            CreatedFrom = createdFrom,
            CreatedTo = createdTo
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết phản ánh theo dõi xử lý theo ID
    /// </summary>
    [HttpPost("{publicId}/get")] // Using POST to allow [FromRoute] parameter
    [ProducesResponseType(typeof(ApiResult<FeedbackTrackingDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<FeedbackTrackingDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFeedbackTrackingById([FromRoute] Guid publicId)
    {
        var query = new GetFeedbackTrackingById.Query
        {
            PublicId = publicId
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }
}
