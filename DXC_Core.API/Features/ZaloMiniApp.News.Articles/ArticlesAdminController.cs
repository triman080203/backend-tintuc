using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DXC_Core.API.Features.ZaloMiniApp.News.Articles;

[ApiController]
[Route("api/zalo-mini-app/admin/articles")]
[Tags("ZaloMiniAppArticlesAdmin")]
[Authorize] // Admin only
public class ArticlesAdminController : ControllerBase
{
    private readonly ISender _sender;

    public ArticlesAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ArticleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetArticles([FromQuery] GetArticles.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<ArticleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetArticleById(Guid publicId)
    {
        var result = await _sender.Send(new GetArticleById.Query { PublicId = publicId });
        return Ok(result);
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<ArticleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateArticle([FromBody] CreateArticle.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<ArticleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateArticle([FromBody] UpdateArticle.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteArticle([FromBody] DeleteArticle.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
