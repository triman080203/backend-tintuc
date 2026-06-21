using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.News.Articles;

[ApiController]
[Route("api/zalo-mini-app/mobile/articles")]
[Tags("ZaloMiniAppArticlesMobile")]
public class ArticlesMobileController : ControllerBase
{
    private readonly ISender _sender;

    public ArticlesMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<ArticleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetArticles([FromQuery] GetArticles.Query query)
    {
        // Mobile chỉ xem bài viết đang active
        query.IsActive = true;
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
}
