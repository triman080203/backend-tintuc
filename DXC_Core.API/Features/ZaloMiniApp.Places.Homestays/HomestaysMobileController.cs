using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Homestays;

[ApiController]
[Route("api/zalo-mini-app/mobile/homestays")]
[AllowAnonymous] // Mobile API thường không cần authentication
public class HomestaysMobileController : ControllerBase
{
    private readonly ISender _sender;

    public HomestaysMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<HomestayMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHomestays([FromQuery] GetHomestays.Query query)
    {
        // Override query để chỉ lấy homestay đang active
        query.IsActive = true;

        var result = await _sender.Send(query);

        // Chuyển đổi sang MobileDto
        var mobileResult = new PagedResult<HomestayMobileDto>
        {
            Success = result.Success,
            Data = result.Data.Select(h => new HomestayMobileDto
            {
                PublicId = h.PublicId,
                Name = h.Name,
                Address = h.Address,
                Description = h.Description,
                PhoneNumber = h.PhoneNumber,
                AveragePrice = h.AveragePrice,
                Latitude = h.Latitude,
                Longitude = h.Longitude,
                Website = h.Website,
                LinkVitri = h.LinkVitri,
                Images = h.Images.Select(img => new HomestayImageDto
                {
                    PublicId = img.PublicId,
                    ImageUrl = img.ImageUrl,
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption
                }).ToList()
            }).ToList(),
            Total = result.Total,
            Current = result.Current,
            PageSize = result.PageSize,
            Message = result.Message
        };

        return Ok(mobileResult);
    }

    [HttpGet("{publicId}")]
    [ProducesResponseType(typeof(ApiResult<HomestayMobileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<HomestayMobileDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHomestayById(Guid publicId)
    {
        var query = new GetHomestayById.Query { PublicId = publicId };
        var result = await _sender.Send(query);

        if (!result.Success)
        {
            return NotFound(result);
        }

        // Chuyển đổi sang MobileDto
        var mobileResult = new ApiResult<HomestayMobileDto>
        {
            Success = result.Success,
            Data = result.Data != null ? new HomestayMobileDto
            {
                PublicId = result.Data.PublicId,
                Name = result.Data.Name,
                Address = result.Data.Address,
                Description = result.Data.Description,
                PhoneNumber = result.Data.PhoneNumber,
                AveragePrice = result.Data.AveragePrice,
                Latitude = result.Data.Latitude,
                Longitude = result.Data.Longitude,
                Website = result.Data.Website,
                LinkVitri = result.Data.LinkVitri,
                Images = result.Data.Images.Select(img => new HomestayImageDto
                {
                    PublicId = img.PublicId,
                    ImageUrl = img.ImageUrl,
                    ImagePublicId = img.ImagePublicId,
                    DisplayOrder = img.DisplayOrder,
                    IsPrimary = img.IsPrimary,
                    Caption = img.Caption
                }).ToList()
            } : null,
            Message = result.Message
        };

        return Ok(mobileResult);
    }
}