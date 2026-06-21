using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

[ApiController]
[Route("api/zalo-mini-app/admin/feedback")]
[Authorize] // Require authentication
public class FeedbackApprovalController : ControllerBase
{
    private readonly ISender _sender;

    public FeedbackApprovalController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Duyệt phản hồi của phòng ban
    /// </summary>
    [HttpPost("responses/{responseId}/approve")]
     [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ApproveResponse(
        [FromRoute] int responseId,
        [FromBody] ApproveFeedbackResponseDto request)
    {
        var command = new ApproveFeedbackResponse.Command
        {
            ResponseId = responseId,
            IsApproved = true,
            ApprovalNote = request.ApprovalNote
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Từ chối phản hồi của phòng ban
    /// </summary>
    [HttpPost("responses/{responseId}/reject")]
     [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RejectResponse(
        [FromRoute] int responseId,
        [FromBody] RejectFeedbackResponseDto request)
    {
        var command = new ApproveFeedbackResponse.Command
        {
            ResponseId = responseId,
            IsApproved = false,
            ApprovalNote = request.RejectionNote
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách phản hồi cần duyệt
    /// </summary>
    [HttpGet("responses/pending-approval")]
     [Authorize]
    [ProducesResponseType(typeof(PagedResult<FeedbackResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingApprovalResponses(
        [FromQuery] int current = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? departmentId = null,
        [FromQuery] DateTime? createdFrom = null,
        [FromQuery] DateTime? createdTo = null)
    {
        var query = new GetPendingApprovalResponses.Query
        {
            Current = current,
            PageSize = pageSize,
            DepartmentId = departmentId,
            CreatedFrom = createdFrom,
            CreatedTo = createdTo
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách phản hồi đã duyệt
    /// </summary>
    [HttpGet("responses/approved")]
    [Authorize]
    [ProducesResponseType(typeof(PagedResult<FeedbackResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetApprovedResponses(
        [FromQuery] int current = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? departmentId = null,
        [FromQuery] DateTime? approvedFrom = null,
        [FromQuery] DateTime? approvedTo = null)
    {
        var query = new GetApprovedResponses.Query
        {
            Current = current,
            PageSize = pageSize,
            DepartmentId = departmentId,
            ApprovedFrom = approvedFrom,
            ApprovedTo = approvedTo
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }
}

public class RejectFeedbackResponseDto
{
    [MaxLength(500)]
    public string? RejectionNote { get; set; }
}