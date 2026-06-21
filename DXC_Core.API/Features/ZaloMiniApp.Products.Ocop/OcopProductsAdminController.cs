using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

// Controller quản trị sản phẩm OCOP - dành cho Admin Dashboard
[ApiController]
[Route("api/zalo-mini-app/admin/ocop-products")]
[Tags("ZaloMiniAppOcopProductsAdmin")]
[Authorize] // Chỉ admin mới được truy cập tất cả endpoints
public class OcopProductsAdminController : ControllerBase
{
    private readonly ISender _sender;

    public OcopProductsAdminController(ISender sender)
    {
        _sender = sender;
    }

    // Lấy danh sách sản phẩm OCOP với phân trang và filter (Admin)
    // query: Tham số tìm kiếm và phân trang
    // returns: Danh sách sản phẩm OCOP với thông tin đầy đủ
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<OcopProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProducts([FromQuery] GetOcopProducts.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy thông tin chi tiết sản phẩm theo ID (Admin)
    // publicId: PublicId của sản phẩm
    // returns: Thông tin chi tiết sản phẩm
    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<OcopProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProductById(Guid publicId)
    {
        var query = new GetOcopProductById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Tạo sản phẩm OCOP mới (Admin)
    // command: Thông tin sản phẩm mới
    // returns: Thông tin sản phẩm đã tạo
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<OcopProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateOcopProduct([FromBody] CreateOcopProduct.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Cập nhật thông tin sản phẩm OCOP (Admin)
    // command: Thông tin cập nhật
    // returns: Kết quả cập nhật
    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<OcopProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateOcopProduct([FromBody] UpdateOcopProduct.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Xóa sản phẩm OCOP (Admin)
    // command: Thông tin xóa sản phẩm
    // returns: Kết quả xóa
    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteOcopProduct([FromBody] DeleteOcopProduct.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}