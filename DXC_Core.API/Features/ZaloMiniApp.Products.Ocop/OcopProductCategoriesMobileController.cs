using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

// Controller mobile cho danh mục sản phẩm OCOP - dành cho Zalo Mini App
[ApiController]
[Route("api/zalo-mini-app/mobile/ocop-product-categories")]
[Tags("ZaloMiniAppOcopProductCategoriesMobile")]
public class OcopProductCategoriesMobileController : ControllerBase
{
    private readonly ISender _sender;

    public OcopProductCategoriesMobileController(ISender sender)
    {
        _sender = sender;
    }

    // Lấy danh sách danh mục sản phẩm OCOP cho mobile (công khai)
    // returns: Danh sách danh mục sản phẩm OCOP với hình ảnh đại diện
    [HttpGet]
    [ProducesResponseType(typeof(ApiResult<List<OcopProductCategoryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProductCategoriesMobile()
    {
        var query = new GetOcopProductCategoriesMobile.Query();
        var result = await _sender.Send(query);
        return Ok(result);
    }
}