using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.TinTuc;

[Route("api/admin/tintuc")]
[ApiController]
public class TinTucAdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public TinTucAdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lấy danh sách tin bài (phân trang, lọc)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<TinTucArticleDto>>> GetArticles([FromQuery] TinTucGetArticles.Query query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết tin bài theo PublicId
    /// </summary>
    [HttpGet("{publicId}")]
    public async Task<ActionResult<ApiResult<TinTucArticleDetailDto>>> GetArticleById(Guid publicId)
    {
        var result = await _mediator.Send(new TinTucGetArticleById.Query { PublicId = publicId });
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới bản nháp tin bài
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResult<Guid>>> CreateArticle([FromBody] TinTucCreateArticle.Command command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Cập nhật tin bài (khi đang ở bản nháp hoặc bị trả lại)
    /// </summary>
    [HttpPut("{publicId}")]
    public async Task<ActionResult<ApiResult>> UpdateArticle(Guid publicId, [FromBody] TinTucUpdateArticle.Command command)
    {
        command.PublicId = publicId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Xóa bài viết
    /// </summary>
    [HttpDelete("{publicId}")]
    public async Task<ActionResult<ApiResult>> DeleteArticle(Guid publicId)
    {
        var result = await _mediator.Send(new TinTucDeleteArticle.Command { PublicId = publicId });
        return Ok(result);
    }

    /// <summary>
    /// Xử lý luồng bài viết (Gửi duyệt, Phê duyệt, Trả lại, Xuất bản, Thu hồi)
    /// </summary>
    [HttpPost("{publicId}/workflow")]
    public async Task<ActionResult<ApiResult<Guid>>> WorkflowArticle(Guid publicId, [FromBody] TinTucWorkflowArticle.Command command)
    {
        if (publicId != command.PublicId)
        {
            command.PublicId = publicId;
        }
        var result = await _mediator.Send(command);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    #region Categories

    [HttpGet("categories")]
    public async Task<ActionResult<PagedResult<TinTucCategoryDto>>> GetCategories([FromQuery] TinTucGetCategories.Query query)
    {
        return Ok(await _mediator.Send(query));
    }

    [HttpGet("categories/{publicId}")]
    public async Task<ActionResult<ApiResult<TinTucCategoryDto>>> GetCategoryById(Guid publicId)
    {
        var result = await _mediator.Send(new TinTucGetCategoryById.Query { PublicId = publicId });
        if (!result.Success) return NotFound(result);
        return Ok(result);
    }

    [HttpPost("categories")]
    public async Task<ActionResult<ApiResult<Guid>>> CreateCategory([FromBody] TinTucCreateCategory.Command command)
    {
        var result = await _mediator.Send(command);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpPut("categories/{publicId}")]
    public async Task<ActionResult<ApiResult<Guid>>> UpdateCategory(Guid publicId, [FromBody] TinTucUpdateCategory.Command command)
    {
        if (publicId != command.PublicId)
        {
            command.PublicId = publicId;
        }
        var result = await _mediator.Send(command);
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    [HttpDelete("categories/{publicId}")]
    public async Task<ActionResult<ApiResult<bool>>> DeleteCategory(Guid publicId)
    {
        var result = await _mediator.Send(new TinTucDeleteCategory.Command { PublicId = publicId });
        if (!result.Success) return BadRequest(result);
        return Ok(result);
    }

    #endregion
}
