using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Restaurants;

// Controller nhà hàng cho ứng dụng di động - dành cho người dùng cuối
[ApiController]
[Route("api/zalo-mini-app/mobile/restaurants")]
[Tags("ZaloMiniAppRestaurantsMobile")]
[Authorize] // Yêu cầu authentication cho tất cả endpoints mobile
public class RestaurantsMobileController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    // Lấy danh sách nhà hàng với phân trang (tối ưu cho mobile) - không cần authentication
    [HttpGet]
    [AllowAnonymous] // Cho phép truy cập không cần đăng nhập
    [ProducesResponseType(typeof(PagedResult<RestaurantDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurants([FromQuery] GetRestaurants.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy chi tiết nhà hàng theo ID - không cần authentication
    [HttpGet("{publicId:guid}")]
    [AllowAnonymous] // Cho phép truy cập không cần đăng nhập
    [ProducesResponseType(typeof(ApiResult<RestaurantDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurantById(Guid publicId)
    {
        var query = new GetRestaurantById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }
}