using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

[ApiController]
[Route("api/zalo-mini-app/admin/feedback")]
[Authorize] // Require authentication
public class FeedbackProcessingController : ControllerBase
{
    private readonly ISender _sender;

    public FeedbackProcessingController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Điều phối phản ánh cho phòng ban
    /// </summary>
    [HttpPost("assign")]
     [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AssignFeedback([FromBody] AssignFeedbackDto request)
    {
        var command = new AssignFeedback.Command
        {
            FeedbackPublicId = request.FeedbackPublicId,
            DepartmentPublicId = request.DepartmentPublicId,
            ToStatusId = request.ToStatusId,
            ProcessingNote = request.ProcessingNote
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Xử lý phản ánh (cập nhật trạng thái)
    /// </summary>
    [HttpPost("process")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ProcessFeedback([FromBody] ProcessFeedbackDto request)
    {
        var command = new ProcessFeedback.Command
        {
            FeedbackPublicId = request.FeedbackPublicId,
            FromStatusId = request.FromStatusId,
            ToStatusId = request.ToStatusId,
            ProcessingNote = request.ProcessingNote
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Tạo phản hồi cho phản ánh
    /// </summary>
    [HttpPost("{feedbackPublicId}/response")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateResponse(
        [FromRoute] Guid feedbackPublicId,
        [FromBody] CreateFeedbackResponseDto request)
    {
        var command = new CreateFeedbackResponse.Command
        {
            FeedbackPublicId = feedbackPublicId,
            ResponseContent = request.ResponseContent,
            FilePublicIds = request.FilePublicIds
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Cập nhật phản hồi
    /// </summary>
    [HttpPost("response/{responseId}/update")]
     [Authorize]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateResponse(
        [FromRoute] int responseId,
        [FromBody] UpdateFeedbackResponseDto request)
    {
        var command = new UpdateFeedbackResponse.Command
        {
            ResponseId = responseId,
            ResponseContent = request.ResponseContent,
            FilePublicIds = request.FilePublicIds
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }
}

public class CreateFeedbackResponseDto
{
    public required string ResponseContent { get; set; }
    public List<Guid>? FilePublicIds { get; set; } // List of uploaded file PublicIds
}

public class UpdateFeedbackResponseDto
{
    public string? ResponseContent { get; set; }
    public List<Guid>? FilePublicIds { get; set; } // List of uploaded file PublicIds
}