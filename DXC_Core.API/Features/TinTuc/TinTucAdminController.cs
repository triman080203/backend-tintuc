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
    public async Task<ActionResult<PagedResult<ArticleDto>>> GetArticles([FromQuery] GetArticles.Query query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết tin bài theo PublicId
    /// </summary>
    [HttpGet("{publicId}")]
    public async Task<ActionResult<ApiResult<ArticleDetailDto>>> GetArticleById(Guid publicId)
    {
        var result = await _mediator.Send(new GetArticleById.Query { PublicId = publicId });
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới bản nháp tin bài
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResult<Guid>>> CreateArticle([FromBody] CreateArticle.Command command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Cập nhật tin bài (khi đang ở bản nháp hoặc bị trả lại)
    /// </summary>
    [HttpPut("{publicId}")]
    public async Task<ActionResult<ApiResult>> UpdateArticle(Guid publicId, [FromBody] UpdateArticle.Command command)
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
        var result = await _mediator.Send(new DeleteArticle.Command { PublicId = publicId });
        return Ok(result);
    }

    /// <summary>
    /// Xử lý luồng bài viết (Gửi duyệt, Phê duyệt, Trả lại, Xuất bản, Thu hồi)
    /// </summary>
    [HttpPost("{publicId}/workflow")]
    public async Task<ActionResult<ApiResult>> WorkflowArticle(Guid publicId, [FromBody] WorkflowArticle.Command command)
    {
        command.PublicId = publicId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
