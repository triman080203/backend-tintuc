using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Products.Ocop;

// Controller mobile cho doanh nghiệp OCOP - dành cho Zalo Mini App
[ApiController]
[Route("api/zalo-mini-app/mobile/ocop-enterprises")]
[Tags("ZaloMiniAppOcopEnterprisesMobile")]
public class OcopEnterprisesMobileController : ControllerBase
{
    private readonly ISender _sender;

    public OcopEnterprisesMobileController(ISender sender)
    {
        _sender = sender;
    }

    // Lấy danh sách doanh nghiệp OCOP cho mobile (công khai)
    // returns: Danh sách doanh nghiệp OCOP với thông tin cơ bản
    [HttpGet]
    [ProducesResponseType(typeof(ApiResult<List<OcopEnterpriseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOcopEnterprisesMobile()
    {
        var query = new GetOcopEnterprisesMobile.Query();
        var result = await _sender.Send(query);
        return Ok(result);
    }
}