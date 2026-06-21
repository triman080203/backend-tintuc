# 🎮 BƯỚC 4B: TẠO API CONTROLLER - Admin + Mobile

**Trường hợp:** Feature có cả Admin API (full CRUD) và Mobile API (read-only)

**Ví dụ:** Hotels, Restaurants, Products, Hotlines, Banners

---

## 📋 **Checklist BƯỚC 4B**

```
□ BƯỚC 4B.1: Tạo Admin Controller
□ BƯỚC 4B.2: Tạo Mobile Controller (read-only)
□ BƯỚC 4B.3: Thêm [ProducesResponseType] Attributes cho cả 2
```

---

## 1️⃣ **BƯỚC 4B.1: Tạo Admin Controller**

### **Vị Trí File**

`DXC_Core.API/Features/{Domain}/{FeatureName}/{EntityNames}AdminController.cs`

### **Admin Controller Template**

```csharp
// File: DXC_Core.API/Features/ZaloMiniApp.Places.Hotels/HotelsAdminController.cs

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

/// <summary>
/// Admin API cho quản lý Hotels
/// Hỗ trợ đầy đủ CRUD operations
/// </summary>
[ApiController]
[Route("api/zalo-mini-app/admin/hotels")]
[Authorize(Roles = "admin")]
public class HotelsAdminController : ControllerBase
{
    private readonly ISender _sender;

    public HotelsAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<HotelDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateHotel.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<HotelDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetList([FromQuery] GetHotels.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("{publicId}/get")]
    [ProducesResponseType(typeof(ApiResult<HotelDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById([FromRoute] Guid publicId)
    {
        var query = new GetHotelById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<HotelDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromBody] UpdateHotel.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("{publicId}/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete([FromRoute] Guid publicId)
    {
        var command = new DeleteHotel.Command { PublicId = publicId };
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
```

---

## 2️⃣ **BƯỚC 4B.2: Tạo Mobile Controller (Read-Only)**

### **Vị Trí File**

`DXC_Core.API/Features/{Domain}/{FeatureName}/{EntityNames}MobileController.cs`

### **Mobile Controller Template**

```csharp
// File: DXC_Core.API/Features/ZaloMiniApp.Places.Hotels/HotelsMobileController.cs

using MediatR;
using Microsoft.AspNetCore.Mvc;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

/// <summary>
/// Mobile API cho Hotels
/// Chỉ hỗ trợ READ operations (không có CRUD modify)
/// </summary>
[ApiController]
[Route("api/zalo-mini-app/mobile/hotels")]
[AllowAnonymous]  // Mobile APIs công khai (không cần auth)
public class HotelsMobileController : ControllerBase
{
    private readonly ISender _sender;

    public HotelsMobileController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách Hotels (mobile version)
    /// </summary>
    /// <remarks>
    /// Trả về dữ liệu tối giản cho mobile app
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<HotelMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetList([FromQuery] GetHotelsMobile.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết Hotel (mobile version)
    /// </summary>
    /// <param name="publicId">PublicId của Hotel</param>
    [HttpGet("{publicId}")]
    [ProducesResponseType(typeof(ApiResult<HotelMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById([FromRoute] Guid publicId)
    {
        var query = new GetHotelByIdMobile.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }
}
```

---

## 📋 **Controller Routing Pattern**

### **Admin Controller Routes:**

```
POST   /api/zalo-mini-app/admin/hotels/create         → CreateHotel
GET    /api/zalo-mini-app/admin/hotels                → GetHotels (list)
POST   /api/zalo-mini-app/admin/hotels/{id}/get       → GetHotelById
POST   /api/zalo-mini-app/admin/hotels/update         → UpdateHotel
POST   /api/zalo-mini-app/admin/hotels/{id}/delete    → DeleteHotel
```

### **Mobile Controller Routes (Read-only):**

```
GET    /api/zalo-mini-app/mobile/hotels               → GetHotelsMobile (list)
GET    /api/zalo-mini-app/mobile/hotels/{id}          → GetHotelByIdMobile
```

### **Routing Convention:**

**Admin:**
```
[Route("api/zalo-mini-app/admin/{entity-name-plural}")]
[Authorize(Roles = "admin")]
```

**Mobile:**
```
[Route("api/zalo-mini-app/mobile/{entity-name-plural}")]
[AllowAnonymous]
```

---

## 🔀 **Differences: Admin vs Mobile**

| Aspect | Admin Controller | Mobile Controller |
|--------|------------------|-------------------|
| Route | `/api/zalo-mini-app/admin/{entity}/` | `/api/zalo-mini-app/mobile/{entity}/` |
| Authorization | `[Authorize(Roles = "admin")]` | `[AllowAnonymous]` |
| HTTP Methods | POST for create/update/delete | GET for list and single |
| DTOs | `{Entity}Dto` (Admin) | `{Entity}MobileDto` (Mobile) |
| Endpoints | Create, Read, Update, Delete | Read only (List, By ID) |
| Payload | Full data + audit fields | Minimal data |

---

## 📋 **Feature Files for Mobile Support**

When adding mobile support, create mobile-specific features:

```
Features/ZaloMiniApp.Places.Hotels/
├── CreateHotel.cs
├── GetHotels.cs
├── GetHotelById.cs
├── UpdateHotel.cs
├── DeleteHotel.cs
├── GetHotelsMobile.cs              ← Mobile feature (new)
├── GetHotelByIdMobile.cs           ← Mobile feature (new)
├── HotelDto.cs
├── HotelMobileDto.cs               ← Mobile DTO
├── HotelImageDto.cs
├── HotelsAdminController.cs        ← Admin controller
└── HotelsMobileController.cs       ← Mobile controller (new)
```

---

## 📝 **Mobile Feature Template (GetHotelsMobile)**

```csharp
// File: GetHotelsMobile.cs

using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

public static class GetHotelsMobile
{
    public class Query : IRequest<PagedResult<HotelMobileDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public int? StarRating { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current).GreaterThan(0);
            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .LessThanOrEqualTo(100);
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<HotelMobileDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<HotelMobileDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            var query = _dbContext.Hotels
                .Where(h => h.IsActive);  // Only active hotels

            if (!string.IsNullOrEmpty(request.Name))
            {
                query = query.Where(h => h.Name.Contains(request.Name));
            }

            if (request.StarRating.HasValue)
            {
                query = query.Where(h => h.StarRating == request.StarRating.Value);
            }

            var totalCount = await query.CountAsync(cancellationToken);

            var hotels = await query
                .OrderBy(h => h.Name)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(h => new HotelMobileDto
                {
                    PublicId = h.PublicId,
                    Name = h.Name,
                    ThumbnailImage = h.ThumbnailImage,
                    StarRating = h.StarRating
                })
                .ToListAsync(cancellationToken);

            return new PagedResult<HotelMobileDto>
            {
                Success = true,
                Data = hotels,
                Total = totalCount,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
```

---

## ✅ **Checklist Hoàn Thành BƯỚC 4B**

```
Admin Controller:
□ {EntityNames}AdminController.cs
□ [Route("api/zalo-mini-app/admin/{entity}")]
□ [Authorize(Roles = "admin")]
□ 5 endpoints: Create, GetList, GetById, Update, Delete
□ [ProducesResponseType] cho tất cả endpoints

Mobile Controller:
□ {EntityNames}MobileController.cs
□ [Route("api/zalo-mini-app/mobile/{entity}")]
□ [AllowAnonymous]
□ 2 endpoints: GetList, GetById (read-only)
□ [ProducesResponseType] cho tất cả endpoints

Mobile Features:
□ Get{EntityNames}Mobile.cs
□ Get{EntityName}ByIdMobile.cs

Mobile DTOs:
□ {EntityName}MobileDto.cs
```

---

## 🔄 **Bước Tiếp Theo**

✅ Hoàn thành BƯỚC 4B → Chuyển sang **BƯỚC 5: Testing & Verification**

📄 **Tài liệu:** Xem `step-5.md`
