using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

// Controller khách sạn cho ứng dụng di động - dành cho người dùng cuối
[ApiController]
[Route("api/zalo-mini-app/mobile/hotels")]
[Tags("ZaloMiniAppHotelsMobile")]
[Authorize] // Yêu cầu authentication cho tất cả endpoints mobile
public class HotelsMobileController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    // Lấy danh sách khách sạn với phân trang (tối ưu cho mobile) - không cần authentication
    [HttpGet]
    [AllowAnonymous] // Cho phép truy cập không cần đăng nhập
    [ProducesResponseType(typeof(PagedResult<HotelWithImagesDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHotels([FromQuery] GetHotels.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    // Lấy chi tiết khách sạn theo ID - không cần authentication
    [HttpGet("{publicId:guid}")]
    [AllowAnonymous] // Cho phép truy cập không cần đăng nhập
    [ProducesResponseType(typeof(ApiResult<HotelWithImagesDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHotelById(Guid publicId)
    {
        var query = new GetHotelById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }







}