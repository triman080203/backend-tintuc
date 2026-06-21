using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

// Controller quản trị danh mục sản phẩm OCOP - dành cho Admin Dashboard
[ApiController]
[Route("api/zalo-mini-app/admin/ocop-categories")]
[Tags("ZaloMiniAppOcopCategoriesAdmin")]
[Authorize] // Chỉ admin mới được truy cập tất cả endpoints
public class OcopProductCategoriesAdminController : ControllerBase
{
    private readonly ISender _sender;

    public OcopProductCategoriesAdminController(ISender sender)
    {
        _sender = sender;
    }

    // Lấy danh sách danh mục sản phẩm OCOP với phân trang và filter (Admin)
    // query: Tham số tìm kiếm và phân trang
    // returns: Danh sách danh mục sản phẩm OCOP với thông tin đầy đủ
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<OcopProductCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProductCategories([FromQuery] GetOcopProductCategories.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy thông tin chi tiết danh mục sản phẩm theo ID (Admin)
    // publicId: PublicId của danh mục sản phẩm
    // returns: Thông tin chi tiết danh mục sản phẩm
    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<OcopProductCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProductCategoryById(Guid publicId)
    {
        var query = new GetOcopProductCategoryById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy danh sách danh mục sản phẩm dạng enum cho Select component (Admin)
    // returns: Danh sách danh mục sản phẩm với value (PublicId) và label (Name)
    [HttpGet("enum/all")]
    [ProducesResponseType(typeof(ApiResult<List<EnumResult<Guid>>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopProductCategoryEnum()
    {
        var query = new GetOcopProductCategoryEnum.Query();
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Tạo danh mục sản phẩm OCOP mới (Admin)
    // command: Thông tin danh mục sản phẩm mới
    // returns: Thông tin danh mục sản phẩm đã tạo
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<OcopProductCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateOcopProductCategory([FromBody] CreateOcopProductCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Cập nhật thông tin danh mục sản phẩm OCOP (Admin)
    // command: Thông tin cập nhật
    // returns: Kết quả cập nhật
    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<OcopProductCategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateOcopProductCategory([FromBody] UpdateOcopProductCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Xóa danh mục sản phẩm OCOP (Admin)
    // command: Thông tin xóa danh mục sản phẩm
    // returns: Kết quả xóa
    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteOcopProductCategory([FromBody] DeleteOcopProductCategory.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}