using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

// Controller quản trị doanh nghiệp OCOP - dành cho Admin Dashboard
[ApiController]
[Route("api/zalo-mini-app/admin/ocop-enterprises")]
[Tags("ZaloMiniAppOcopEnterprisesAdmin")]
[Authorize] // Chỉ admin mới được truy cập tất cả endpoints
public class OcopEnterprisesAdminController : ControllerBase
{
    private readonly ISender _sender;

    public OcopEnterprisesAdminController(ISender sender)
    {
        _sender = sender;
    }

    // Lấy danh sách doanh nghiệp OCOP với phân trang và filter (Admin)
    // query: Tham số tìm kiếm và phân trang
    // returns: Danh sách doanh nghiệp OCOP với thông tin đầy đủ
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<OcopEnterpriseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopEnterprises([FromQuery] GetOcopEnterprises.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy thông tin chi tiết doanh nghiệp theo ID (Admin)
    // publicId: PublicId của doanh nghiệp
    // returns: Thông tin chi tiết doanh nghiệp
    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<OcopEnterpriseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopEnterpriseById(Guid publicId)
    {
        var query = new GetOcopEnterpriseById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy danh sách doanh nghiệp dạng enum cho Select component (Admin)
    // returns: Danh sách doanh nghiệp với value (PublicId) và label (Name)
    [HttpGet("enum/all")]
    [ProducesResponseType(typeof(ApiResult<List<EnumResult<Guid>>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopEnterpriseEnum()
    {
        var query = new GetOcopEnterpriseEnum.Query();
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Tạo doanh nghiệp OCOP mới (Admin)
    // command: Thông tin doanh nghiệp mới
    // returns: Thông tin doanh nghiệp đã tạo
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<OcopEnterpriseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateOcopEnterprise([FromBody] CreateOcopEnterprise.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Cập nhật thông tin doanh nghiệp OCOP (Admin)
    // command: Thông tin cập nhật
    // returns: Kết quả cập nhật
    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<OcopEnterpriseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateOcopEnterprise([FromBody] UpdateOcopEnterprise.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Xóa doanh nghiệp OCOP (Admin)
    // command: Thông tin xóa doanh nghiệp
    // returns: Kết quả xóa
    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteOcopEnterprise([FromBody] DeleteOcopEnterprise.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}