using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Restaurants;

// Controller quản trị nhà hàng - dành cho Admin Dashboard
[ApiController]
[Route("api/zalo-mini-app/admin/restaurants")]
[Tags("ZaloMiniAppRestaurantsAdmin")]
[Authorize] // Chỉ admin mới được truy cập tất cả endpoints
public class RestaurantsAdminController : ControllerBase
{
    private readonly ISender _sender;

    public RestaurantsAdminController(ISender sender)
    {
        _sender = sender;
    }

    // Lấy danh sách nhà hàng với phân trang và filter (Admin)
    // query: Tham số tìm kiếm và phân trang
    // returns: Danh sách nhà hàng với thông tin đầy đủ
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<RestaurantDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurants([FromQuery] GetRestaurants.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy thông tin chi tiết nhà hàng theo ID (Admin)
    // publicId: ID nhà hàng
    // returns: Thông tin chi tiết nhà hàng
    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<RestaurantDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurantById(Guid publicId)
    {
        var query = new GetRestaurantById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Tạo nhà hàng mới (Admin)
    // command: Thông tin nhà hàng mới
    // returns: Thông tin nhà hàng đã tạo
    [HttpPost("create")]
    [Authorize] // Chỉ Admin và RestaurantManager mới được tạo
    [ProducesResponseType(typeof(ApiResult<RestaurantDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateRestaurant([FromBody] CreateRestaurant.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Cập nhật thông tin nhà hàng (Admin)
    // command: Thông tin cập nhật
    // returns: Kết quả cập nhật
    [HttpPost("update")]
    [Authorize] // Chỉ Admin và RestaurantManager mới được cập nhật
    [ProducesResponseType(typeof(ApiResult<RestaurantDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateRestaurant([FromBody] UpdateRestaurant.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Xóa nhà hàng (Admin)
    // command: Thông tin xóa nhà hàng
    // returns: Kết quả xóa
    [HttpPost("delete")]
    [Authorize] // Chỉ Admin mới được xóa
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteRestaurant([FromBody] DeleteRestaurant.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}