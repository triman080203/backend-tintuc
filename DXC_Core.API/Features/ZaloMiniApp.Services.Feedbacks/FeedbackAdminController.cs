using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using static DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks.GetFeedbackStatuses;
using static DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks.GetFeedbackStatusById;
using static DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks.GetActiveFeedbackStatuses;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

[ApiController]
[Route("api/zalo-mini-app/admin/feedback")]
[Authorize] // Require authentication for admin endpoints
public class FeedbackAdminController : ControllerBase
{
    private readonly ISender _sender;

    public FeedbackAdminController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách phản ánh (có phân trang và filtering)
    /// </summary>
    [HttpGet("list")]
     [Authorize]
    [ProducesResponseType(typeof(PagedResult<FeedbackAdminDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFeedbacks(
        [FromQuery] int current = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? title = null,
        [FromQuery] string? fullName = null,
        [FromQuery] string? phoneNumber = null,
        [FromQuery] string? location = null,
        [FromQuery] int? currentStatusId = null,
        [FromQuery] Guid? assignedDepartmentPublicId = null,
        [FromQuery] bool? isPublic = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] DateTime? createdFrom = null,
        [FromQuery] DateTime? createdTo = null)
    {
        var query = new GetFeedbacks.Query
        {
            Current = current,
            PageSize = pageSize,
            Title = title,
            FullName = fullName,
            PhoneNumber = phoneNumber,
            Location = location,
            CurrentStatusId = currentStatusId,
            AssignedDepartmentPublicId = assignedDepartmentPublicId,
            IsPublic = isPublic,
            IsActive = isActive,
            CreatedFrom = createdFrom,
            CreatedTo = createdTo
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết phản ánh theo ID
    /// </summary>
    [HttpGet("{publicId}")]
     [Authorize]
    [ProducesResponseType(typeof(ApiResult<FeedbackDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<FeedbackDetailDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFeedbackById([FromRoute] Guid publicId)
    {
        var query = new GetFeedbackById.Query
        {
            PublicId = publicId
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Tạo phản ánh mới (từ admin)
    /// </summary>
    [HttpPost("create")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResult<FeedbackAdminDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<FeedbackAdminDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackDto request)
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
    /// Cập nhật thông tin phản ánh
    /// </summary>
    [HttpPost("update")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResult<FeedbackAdminDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<FeedbackAdminDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<FeedbackAdminDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateFeedback([FromBody] UpdateFeedbackDto request)
    {
        var command = new UpdateFeedback.Command
        {
            PublicId = request.PublicId,
            Title = request.Title,
            Content = request.Content,
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber,
            Location = request.Location,
            IsPublic = request.IsPublic,
            CurrentStatusId = request.CurrentStatusId,
            AssignedDepartmentPublicId = request.AssignedDepartmentPublicId
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Xóa phản ánh (soft delete)
    /// </summary>
    [HttpPost("delete")]
     [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteFeedback([FromBody] DeleteFeedback.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // NOTE: Department endpoints have been moved to Common feature
    // Use: GET /api/admin/common/departments
    //      GET /api/admin/common/departments/{id}
    //      GET /api/admin/common/departments?isActive=true

    // --- Feedback Status Management Endpoints ---

    /// <summary>
    /// Lấy danh sách trạng thái phản ánh (có phân trang và filtering)
    /// </summary>
    [HttpGet("statuses")]
    [Authorize]
    [ProducesResponseType(typeof(PagedResult<FeedbackStatusDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFeedbackStatuses(
        [FromQuery] int current = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? name = null,
        [FromQuery] string? code = null,
        [FromQuery] bool? isActive = null)
    {
        var query = new GetFeedbackStatuses.Query
        {
            Current = current,
            PageSize = pageSize,
            Name = name,
            Code = code,
            IsActive = isActive
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết trạng thái phản ánh theo ID
    /// </summary>
    [HttpGet("statuses/{publicId}")]
     [Authorize]
    [ProducesResponseType(typeof(ApiResult<FeedbackStatusDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<FeedbackStatusDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetFeedbackStatusById([FromRoute] Guid publicId)
    {
        var query = new GetFeedbackStatusById.Query
        {
            PublicId = publicId
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách trạng thái phản ánh đang hoạt động (dùng cho dropdown/selection)
    /// </summary>
    [HttpGet("statuses/active")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResult<List<FeedbackStatusDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveFeedbackStatuses()
    {
        var query = new GetActiveFeedbackStatuses.Query();

        var result = await _sender.Send(query);
        return Ok(result);
    }
}