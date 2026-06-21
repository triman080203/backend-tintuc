using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

// Controller mobile cho sản phẩm OCOP - dành cho Zalo Mini App
[ApiController]
[Route("api/zalo-mini-app/mobile/ocop-products")]
[Tags("ZaloMiniAppOcopProductsMobile")]
public class OcopProductsMobileController : ControllerBase
{
    private readonly ISender _sender;

    public OcopProductsMobileController(ISender sender)
    {
        _sender = sender;
    }

    // Lấy sản phẩm theo danh mục (Mobile)
    // categoryPublicId: PublicId của danh mục
    // query: Tham số phân trang
    // returns: Danh sách sản phẩm theo danh mục
    [HttpGet("by-category/{categoryPublicId:guid}")]
    [ProducesResponseType(typeof(PagedResult<OcopProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProductsByCategory(
        Guid categoryPublicId,
        [FromQuery] GetOcopProductsByCategory.Query query)
    {
        query.CategoryPublicId = categoryPublicId;
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy sản phẩm theo doanh nghiệp (Mobile)
    // enterprisePublicId: PublicId của doanh nghiệp
    // query: Tham số phân trang
    // returns: Danh sách sản phẩm theo doanh nghiệp
    [HttpGet("by-enterprise/{enterprisePublicId:guid}")]
    [ProducesResponseType(typeof(PagedResult<OcopProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProductsByEnterprise(
        Guid enterprisePublicId,
        [FromQuery] GetOcopProductsByEnterprise.Query query)
    {
        query.EnterprisePublicId = enterprisePublicId;
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy chi tiết sản phẩm (Mobile)
    // publicId: PublicId của sản phẩm
    // returns: Thông tin chi tiết sản phẩm
    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<OcopProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProductByIdMobile(Guid publicId)
    {
        var query = new GetOcopProductByIdMobile.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }
}