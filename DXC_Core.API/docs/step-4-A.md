# 🎮 BƯỚC 4A: TẠO API CONTROLLER - Admin Only

**Trường hợp:** Feature chỉ có admin API (không cần mobile API)

**Ví dụ:** Core features như Identity, Profile, Common

---

## 📋 **Checklist BƯỚC 4A**

```
□ BƯỚC 4A.1: Tạo Admin Controller
□ BƯỚC 4A.2: Thêm CRUD Endpoints
□ BƯỚC 4A.3: Thêm [ProducesResponseType] Attributes
```

---

## 1️⃣ **BƯỚC 4A.1: Tạo Admin Controller**

### **Vị Trí File**

**File Location:** `DXC_Core.API/Features/{Domain}/{FeatureName}/{EntityNames}AdminController.cs`

**Ví dụ:**
- `DXC_Core.API/Features/Common/DepartmentsAdminController.cs`
- `DXC_Core.API/Features/Identity/RolesAdminController.cs`

### **Controller Template**

```csharp
// File: DXC_Core.API/Features/Common/DepartmentsAdminController.cs

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.Common;

/// <summary>
/// Admin API cho quản lý Department
/// Tất cả endpoints yêu cầu admin authorization
/// </summary>
[ApiController]
[Route("api/common/departments")]  // Route: /api/common/departments/
[Authorize(Roles = "admin")]       // Require admin role
public class DepartmentsAdminController : ControllerBase
{
    private readonly ISender _sender;

    public DepartmentsAdminController(ISender sender)
    {
        _sender = sender;
    }

    // ========== CRUD ENDPOINTS ==========

    /// <summary>
    /// Tạo mới Department
    /// </summary>
    /// <remarks>
    /// Tạo một department mới
    /// </remarks>
    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateDepartment.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách Departments (có phân trang và filter)
    /// </summary>
    /// <remarks>
    /// Lấy danh sách departments với hỗ trợ:
    /// - Phân trang (Current, PageSize)
    /// - Filter theo Name, Code, OrganizationPublicId, IsActive
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<DepartmentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetList([FromQuery] GetDepartments.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết Department theo ID
    /// </summary>
    /// <param name="publicId">PublicId của Department</param>
    [HttpPost("{publicId}/get")]  // RPC-style: GET by ID using POST
    [ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById([FromRoute] Guid publicId)
    {
        var query = new GetDepartmentById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Cập nhật Department
    /// </summary>
    /// <remarks>
    /// Cập nhật thông tin Department
    /// </remarks>
    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromBody] UpdateDepartment.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Xóa Department
    /// </summary>
    /// <remarks>
    /// Xóa (soft delete) Department
    /// </remarks>
    [HttpPost("{publicId}/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete([FromRoute] Guid publicId)
    {
        var command = new DeleteDepartment.Command { PublicId = publicId };
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
```

---

## 2️⃣ **BƯỚC 4A.2: Thêm CRUD Endpoints**

### **Endpoint Pattern (RPC-style)**

```
POST   /api/common/departments/create          → CreateDepartment
GET    /api/common/departments                 → GetDepartments (list)
POST   /api/common/departments/{id}/get        → GetDepartmentById
POST   /api/common/departments/update          → UpdateDepartment
POST   /api/common/departments/{id}/delete     → DeleteDepartment
```

### **Routing Convention:**

- **Prefix:** `/api/{domain}/{entity}/` (lowercase, kebab-case)
  - ✅ `/api/common/departments/`
  - ✅ `/api/identity/roles/`
  - ✅ `/api/internal-documents/admin/`

- **Action suffixes:** `/create`, `/update`, `/delete` (RPC-style)
  - ✅ POST /api/common/departments/create
  - ✅ POST /api/common/departments/update
  - ✅ POST /api/common/departments/{id}/delete

- **GET by ID:** POST with {id}/get
  - ✅ POST /api/common/departments/{id}/get
  - (Giúp [FromRoute] parameter binding)

---

## 3️⃣ **BƯỚC 4A.3: [ProducesResponseType] Attributes**

### **Tại sao cần [ProducesResponseType]?**

- ✅ Swagger tự động generate đúng schema cho DTO
- ✅ Frontend tools (OpenAPI Generator) có thể auto-generate client code
- ✅ IDE intellisense hiểu kiểu response

### **[ProducesResponseType] Pattern:**

```csharp
[ProducesResponseType(typeof({ResponseType}), StatusCodes.Status200OK)]
```

### **Response Types:**

```csharp
// Single object operation
[ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]

// List operation (paged)
[ProducesResponseType(typeof(PagedResult<DepartmentDto>), StatusCodes.Status200OK)]

// Delete operation (no data)
[ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
```

### **Example with All Endpoints:**

```csharp
// Create
[HttpPost("create")]
[ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]
public async Task<IActionResult> Create([FromBody] CreateDepartment.Command command)
{
    var result = await _sender.Send(command);
    return Ok(result);
}

// Get List (Paged)
[HttpGet]
[ProducesResponseType(typeof(PagedResult<DepartmentDto>), StatusCodes.Status200OK)]
public async Task<IActionResult> GetList([FromQuery] GetDepartments.Query query)
{
    var result = await _sender.Send(query);
    return Ok(result);
}

// Get By ID
[HttpPost("{publicId}/get")]
[ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]
public async Task<IActionResult> GetById([FromRoute] Guid publicId)
{
    var query = new GetDepartmentById.Query { PublicId = publicId };
    var result = await _sender.Send(query);
    return Ok(result);
}

// Update
[HttpPost("update")]
[ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]
public async Task<IActionResult> Update([FromBody] UpdateDepartment.Command command)
{
    var result = await _sender.Send(command);
    return Ok(result);
}

// Delete
[HttpPost("{publicId}/delete")]
[ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
public async Task<IActionResult> Delete([FromRoute] Guid publicId)
{
    var command = new DeleteDepartment.Command { PublicId = publicId };
    var result = await _sender.Send(command);
    return Ok(result);
}
```

---

## 📋 **Admin Controller Checklist**

```
□ File tạo: {EntityNames}AdminController.cs
□ Namespace: Features.{Domain}.{FeatureName}
□ Route: [Route("api/{domain}/{entity}")]
□ Authorization: [Authorize(Roles = "admin")]
□ Dependency: ISender _sender (MediatR)

Endpoints:
□ [HttpPost("create")] - CreateDepartment.Command
  □ [ProducesResponseType(typeof(ApiResult<DepartmentDto>))]
□ [HttpGet] - GetDepartments.Query
  □ [ProducesResponseType(typeof(PagedResult<DepartmentDto>))]
□ [HttpPost("{publicId}/get")] - GetDepartmentById.Query
  □ [ProducesResponseType(typeof(ApiResult<DepartmentDto>))]
□ [HttpPost("update")] - UpdateDepartment.Command
  □ [ProducesResponseType(typeof(ApiResult<DepartmentDto>))]
□ [HttpPost("{publicId}/delete")] - DeleteDepartment.Command
  □ [ProducesResponseType(typeof(ApiResult))]

Documentation:
□ [Summary] cho controller class
□ [Summary] cho mỗi endpoint
□ [Remarks] nếu có thêm thông tin
```

---

## 🔄 **Bước Tiếp Theo**

✅ Hoàn thành BƯỚC 4A → Chuyển sang **BƯỚC 5: Testing & Verification**

📄 **Tài liệu:** Xem `step-5.md`

---

## 📌 **Ghi Chú**

- Nếu feature cần cả Admin + Mobile APIs, xem `step-4-B.md`
- Controller "mỏng": chỉ dispatch đến MediatR, không chứa logic
- Tất cả validation ở Validator, không ở Controller
- Response mapping ở Handler, không ở Controller
