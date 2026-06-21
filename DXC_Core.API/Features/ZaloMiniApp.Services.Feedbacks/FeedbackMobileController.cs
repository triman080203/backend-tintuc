using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

[ApiController]
[Route("api/zalo-mini-app/mobile/feedback")]
[AllowAnonymous] // Mobile APIs are public
[EnableRateLimiting("fixed")]
public class FeedbackMobileController : ControllerBase
{
    private readonly ISender _sender;

    public FeedbackMobileController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Tạo phản ánh mới từ mobile app
    /// </summary>
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<FeedbackAdminDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<FeedbackAdminDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackMobileDto request)
    {
        var command = new CreateFeedback.Command
        {
            Title = request.Title,
            Content = request.Content,
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber,
            Location = request.Location,
            IsPublic = request.IsPublic,
            AttachmentPublicIds = request.AttachmentPublicIds
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách phản ánh công khai (có phân trang)
    /// </summary>
    [HttpGet("public")]
    [ProducesResponseType(typeof(PagedResult<FeedbackMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublicFeedbacks(
        [FromQuery] int current = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? title = null,
        [FromQuery] string? fullName = null,
        [FromQuery] string? location = null,
        [FromQuery] DateTime? createdFrom = null,
        [FromQuery] DateTime? createdTo = null)
    {
        var query = new GetPublicFeedbacks.Query
        {
            Current = current,
            PageSize = pageSize,
            Title = title,
            FullName = fullName,
            Location = location,
            CreatedFrom = createdFrom,
            CreatedTo = createdTo
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy lịch sử phản ánh của user theo số điện thoại
    /// </summary>
    [HttpGet("history")]
    [ProducesResponseType(typeof(PagedResult<FeedbackMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserFeedbacks(
        [FromQuery] string phoneNumber,
        [FromQuery] int current = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? title = null,
        [FromQuery] int? currentStatusId = null,
        [FromQuery] DateTime? createdFrom = null,
        [FromQuery] DateTime? createdTo = null)
    {
        var query = new GetUserFeedbacks.Query
        {
            PhoneNumber = phoneNumber,
            Current = current,
            PageSize = pageSize,
            Title = title,
            CurrentStatusId = currentStatusId,
            CreatedFrom = createdFrom,
            CreatedTo = createdTo
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết phản ánh (công khai hoặc của user)
    /// </summary>
    [HttpGet("{publicId}")]
    [ProducesResponseType(typeof(ApiResult<FeedbackDetailMobileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<FeedbackDetailMobileDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFeedbackDetail(
        [FromRoute] Guid publicId,
        [FromQuery] string? phoneNumber = null)
    {
        var query = new GetFeedbackDetailMobile.Query
        {
            PublicId = publicId,
            PhoneNumber = phoneNumber
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("status-counts")]
    [ProducesResponseType(typeof(ApiResult<FeedbackStatusCountsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFeedbackStatusCounts(
        [FromQuery] string? phoneNumber = null)
    {
        var query = new GetFeedbackStatusCountsMobile.Query
        {
            PhoneNumber = phoneNumber
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("by-status")]
    [ProducesResponseType(typeof(PagedResult<FeedbackMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFeedbacksByStatus(
        [FromQuery] string statusCode,
        [FromQuery] string? phoneNumber = null,
        [FromQuery] int current = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? title = null,
        [FromQuery] string? location = null,
        [FromQuery] DateTime? createdFrom = null,
        [FromQuery] DateTime? createdTo = null)
    {
        var query = new GetFeedbacksByStatus.Query
        {
            StatusCode = statusCode,
            PhoneNumber = phoneNumber,
            Current = current,
            PageSize = pageSize,
            Title = title,
            Location = location,
            CreatedFrom = createdFrom,
            CreatedTo = createdTo
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId}/by-status")]
    [ProducesResponseType(typeof(ApiResult<FeedbackDetailMobileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<FeedbackDetailMobileDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFeedbackDetailByStatus(
        [FromRoute] Guid publicId,
        [FromQuery] string statusCode,
        [FromQuery] string? phoneNumber = null)
    {
        var query = new GetFeedbackDetailByStatusMobile.Query
        {
            PublicId = publicId,
            StatusCode = statusCode,
            PhoneNumber = phoneNumber
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }
}
