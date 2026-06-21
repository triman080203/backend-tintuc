# 🎯 BƯỚC 3: TẠO FEATURES (Vertical Slice - CQRS)

**Features:** Là các file chứa logic nghiệp vụ theo kiến trúc Vertical Slice. Mỗi file chứa 3 phần:
1. **Command/Query** - Định nghĩa input
2. **Validator** - Xác thực input
3. **Handler** - Xử lý logic

---

## 📋 **Checklist BƯỚC 3**

```
□ BƯỚC 3.1: CREATE Feature
□ BƯỚC 3.2: GET LIST Feature (with pagination & filters)
□ BƯỚC 3.3: GET BY ID Feature
□ BƯỚC 3.4: UPDATE Feature
□ BƯỚC 3.5: DELETE Feature (Soft Delete)
```

---

## 1️⃣ **BƯỚC 3.1: CREATE Feature**

### **Vị Trí File**

**File Location:** `DXC_Core.API/Features/{Domain}/{FeatureName}/Create{EntityName}.cs`

**Ví dụ:**
- `DXC_Core.API/Features/Common/CreateDepartment.cs`
- `DXC_Core.API/Features/ZaloMiniApp.Places.Hotels/CreateHotel.cs`

### **Template: CREATE Feature**

```csharp
// File: DXC_Core.API/Features/Common/CreateDepartment.cs

using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Common;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class CreateDepartment
{
    // ========== STEP 1: COMMAND ==========
    /// <summary>
    /// Command để tạo mới Department
    /// </summary>
    public class Command : IRequest<ApiResult<DepartmentDto>>
    {
        public required string Name { get; set; }
        public required string Code { get; set; }
        public string? Description { get; set; }
        public Guid OrganizationPublicId { get; set; }
    }

    // ========== STEP 2: VALIDATOR ==========
    /// <summary>
    /// Validator cho CreateDepartment.Command
    /// Xác thực tất cả input validation ở đây, không validate trong Handler
    /// </summary>
    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            // Validate Name
            RuleFor(c => c.Name)
                .NotEmpty()
                .WithMessage("Tên phòng ban không được để trống")
                .MaximumLength(100)
                .WithMessage("Tên phòng ban không được vượt quá 100 ký tự")
                .MustAsync(BeUniqueName)
                .WithMessage("Tên phòng ban đã tồn tại");

            // Validate Code
            RuleFor(c => c.Code)
                .NotEmpty()
                .WithMessage("Mã phòng ban không được để trống")
                .MaximumLength(50)
                .WithMessage("Mã phòng ban không được vượt quá 50 ký tự")
                .MustAsync(BeUniqueCode)
                .WithMessage("Mã phòng ban đã tồn tại");

            // Validate Description
            RuleFor(c => c.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự");

            // Validate OrganizationPublicId - phải tồn tại trong DB
            RuleFor(c => c.OrganizationPublicId)
                .MustAsync(async (orgId, ct) =>
                    await _dbContext.Organizations
                        .AnyAsync(o => o.PublicId == orgId && o.IsActive, ct))
                .WithMessage("Tổ chức không tồn tại hoặc đã bị vô hiệu hóa");
        }

        private async Task<bool> BeUniqueName(Command cmd, string name, CancellationToken ct)
        {
            return !await _dbContext.Departments
                .AnyAsync(d => d.Name == name, ct);
        }

        private async Task<bool> BeUniqueCode(Command cmd, string code, CancellationToken ct)
        {
            return !await _dbContext.Departments
                .AnyAsync(d => d.Code == code, ct);
        }
    }

    // ========== STEP 3: HANDLER ==========
    /// <summary>
    /// Handler thực hiện logic tạo mới Department
    /// </summary>
    public class Handler : IRequestHandler<Command, ApiResult<DepartmentDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<DepartmentDto>> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            // 1. Lấy Organization theo PublicId (để lấy Id interno)
            var organization = await _dbContext.Organizations
                .FirstOrDefaultAsync(o => o.PublicId == request.OrganizationPublicId, cancellationToken);

            if (organization == null)
            {
                return new ApiResult<DepartmentDto>
                {
                    Success = false,
                    Message = "Không tìm thấy tổ chức"
                };
            }

            // 2. Tạo entity mới
            var department = new Department
            {
                PublicId = Guid.NewGuid(),
                OrganizationId = organization.Id,
                Name = request.Name,
                Code = request.Code,
                Description = request.Description,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // 3. Add vào DbContext
            _dbContext.Departments.Add(department);

            // 4. Save changes
            await _dbContext.SaveChangesAsync(cancellationToken);

            // 5. Map entity to DTO
            var dto = new DepartmentDto
            {
                PublicId = department.PublicId,
                Name = department.Name,
                Code = department.Code,
                Description = department.Description,
                IsActive = department.IsActive,
                CreatedAt = department.CreatedAt,
                UpdatedAt = department.UpdatedAt
            };

            // 6. Return result
            return new ApiResult<DepartmentDto>
            {
                Success = true,
                Data = dto,
                Message = "Tạo phòng ban thành công"
            };
        }
    }
}
```

---

## 2️⃣ **BƯỚC 3.2: GET LIST Feature (with Pagination & Filters)**

### **File Location**

`DXC_Core.API/Features/{Domain}/{FeatureName}/Get{EntityNames}.cs`

### **Template: GET LIST Feature**

```csharp
// File: DXC_Core.API/Features/Common/GetDepartments.cs

using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetDepartments
{
    // ========== QUERY ==========
    public class Query : IRequest<PagedResult<DepartmentDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        
        // Filter params (specific fields, không generic Search)
        public string? Name { get; set; }
        public string? Code { get; set; }
        public Guid? OrganizationPublicId { get; set; }
        public bool? IsActive { get; set; }
    }

    // ========== VALIDATOR ==========
    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current)
                .GreaterThan(0)
                .WithMessage("Trang phải lớn hơn 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .LessThanOrEqualTo(100)
                .WithMessage("Kích thước trang phải từ 1 đến 100");
        }
    }

    // ========== HANDLER ==========
    public class Handler : IRequestHandler<Query, PagedResult<DepartmentDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PagedResult<DepartmentDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            // 1. Build query
            var query = _dbContext.Departments.AsQueryable();

            // 2. Apply filters
            if (!string.IsNullOrEmpty(request.Name))
            {
                query = query.Where(d => d.Name.Contains(request.Name));
            }

            if (!string.IsNullOrEmpty(request.Code))
            {
                query = query.Where(d => d.Code.Contains(request.Code));
            }

            if (request.OrganizationPublicId.HasValue)
            {
                query = query.Where(d => d.Organization!.PublicId == request.OrganizationPublicId.Value);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(d => d.IsActive == request.IsActive.Value);
            }

            // 3. Get total count (before pagination)
            var totalCount = await query.CountAsync(cancellationToken);

            // 4. Get paged data
            var departments = await query
                .Include(d => d.Organization)
                .OrderByDescending(d => d.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(d => new DepartmentDto
                {
                    PublicId = d.PublicId,
                    Name = d.Name,
                    Code = d.Code,
                    Description = d.Description,
                    IsActive = d.IsActive,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                })
                .ToListAsync(cancellationToken);

            // 5. Return paged result
            return new PagedResult<DepartmentDto>
            {
                Success = true,
                Data = departments,
                Total = totalCount,
                Current = request.Current,
                PageSize = request.PageSize
            };
        }
    }
}
```

---

## 3️⃣ **BƯỚC 3.3: GET BY ID Feature**

### **File Location**

`DXC_Core.API/Features/{Domain}/{FeatureName}/Get{EntityName}ById.cs`

### **Template: GET BY ID**

```csharp
// File: DXC_Core.API/Features/Common/GetDepartmentById.cs

using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetDepartmentById
{
    public class Query : IRequest<ApiResult<DepartmentDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<DepartmentDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<DepartmentDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments
                .Include(d => d.Organization)
                .FirstOrDefaultAsync(d => d.PublicId == request.PublicId, cancellationToken);

            if (department == null)
            {
                return new ApiResult<DepartmentDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phòng ban"
                };
            }

            var dto = new DepartmentDto
            {
                PublicId = department.PublicId,
                Name = department.Name,
                Code = department.Code,
                Description = department.Description,
                IsActive = department.IsActive,
                CreatedAt = department.CreatedAt,
                UpdatedAt = department.UpdatedAt
            };

            return new ApiResult<DepartmentDto>
            {
                Success = true,
                Data = dto
            };
        }
    }
}
```

---

## 4️⃣ **BƯỚC 3.4: UPDATE Feature**

### **File Location**

`DXC_Core.API/Features/{Domain}/{FeatureName}/Update{EntityName}.cs`

### **Template: UPDATE**

```csharp
// File: DXC_Core.API/Features/Common/UpdateDepartment.cs

using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Common;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class UpdateDepartment
{
    public class Command : IRequest<ApiResult<DepartmentDto>>
    {
        public required Guid PublicId { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(c => c.PublicId)
                .MustAsync(async (id, ct) =>
                    await _dbContext.Departments
                        .AnyAsync(d => d.PublicId == id, ct))
                .WithMessage("Phòng ban không tồn tại");

            RuleFor(c => c.Name)
                .MaximumLength(100)
                .When(c => !string.IsNullOrEmpty(c.Name))
                .MustAsync(BeUniqueNameExcludingSelf)
                .When(c => !string.IsNullOrEmpty(c.Name))
                .WithMessage("Tên phòng ban đã tồn tại");

            RuleFor(c => c.Code)
                .MaximumLength(50)
                .When(c => !string.IsNullOrEmpty(c.Code))
                .MustAsync(BeUniqueCodeExcludingSelf)
                .When(c => !string.IsNullOrEmpty(c.Code))
                .WithMessage("Mã phòng ban đã tồn tại");

            RuleFor(c => c.Description)
                .MaximumLength(500)
                .When(c => c.Description != null);
        }

        private async Task<bool> BeUniqueNameExcludingSelf(
            Command cmd, string name, CancellationToken ct)
        {
            return !await _dbContext.Departments
                .AnyAsync(d => d.Name == name && d.PublicId != cmd.PublicId, ct);
        }

        private async Task<bool> BeUniqueCodeExcludingSelf(
            Command cmd, string code, CancellationToken ct)
        {
            return !await _dbContext.Departments
                .AnyAsync(d => d.Code == code && d.PublicId != cmd.PublicId, ct);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult<DepartmentDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<DepartmentDto>> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments
                .FirstOrDefaultAsync(d => d.PublicId == request.PublicId, cancellationToken);

            if (department == null)
            {
                return new ApiResult<DepartmentDto>
                {
                    Success = false,
                    Message = "Không tìm thấy phòng ban"
                };
            }

            // Update only provided fields
            if (!string.IsNullOrEmpty(request.Name))
                department.Name = request.Name;

            if (!string.IsNullOrEmpty(request.Code))
                department.Code = request.Code;

            if (request.Description != null)
                department.Description = request.Description;

            if (request.IsActive.HasValue)
                department.IsActive = request.IsActive.Value;

            department.UpdatedAt = DateTime.UtcNow;

            _dbContext.Departments.Update(department);
            await _dbContext.SaveChangesAsync(cancellationToken);

            var dto = new DepartmentDto
            {
                PublicId = department.PublicId,
                Name = department.Name,
                Code = department.Code,
                Description = department.Description,
                IsActive = department.IsActive,
                CreatedAt = department.CreatedAt,
                UpdatedAt = department.UpdatedAt
            };

            return new ApiResult<DepartmentDto>
            {
                Success = true,
                Data = dto,
                Message = "Cập nhật phòng ban thành công"
            };
        }
    }
}
```

---

## 5️⃣ **BƯỚC 3.5: DELETE Feature (Soft Delete)**

### **File Location**

`DXC_Core.API/Features/{Domain}/{FeatureName}/Delete{EntityName}.cs`

### **Template: DELETE (Soft Delete)**

```csharp
// File: DXC_Core.API/Features/Common/DeleteDepartment.cs

using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class DeleteDepartment
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult> Handle(
            Command request,
            CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments
                .FirstOrDefaultAsync(d => d.PublicId == request.PublicId, cancellationToken);

            if (department == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy phòng ban"
                };
            }

            // Soft delete: set IsActive = false
            department.IsActive = false;
            department.UpdatedAt = DateTime.UtcNow;

            _dbContext.Departments.Update(department);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa phòng ban thành công"
            };
        }
    }
}
```

---

## 📋 **Feature File Naming Convention**

```
Create{EntityName}.cs     → CreateDepartment.cs
Get{EntityNames}.cs        → GetDepartments.cs (Get list)
Get{EntityName}ById.cs     → GetDepartmentById.cs (Get by ID)
Update{EntityName}.cs      → UpdateDepartment.cs
Delete{EntityName}.cs      → DeleteDepartment.cs

Mobile features (read-only):
Get{EntityNames}Mobile.cs      → GetDepartmentsMobile.cs
Get{EntityName}ByIdMobile.cs   → GetDepartmentByIdMobile.cs
```

---

## ✅ **Checklist Hoàn Thành BƯỚC 3**

```
□ CreateDepartment.cs (Command + Validator + Handler)
□ GetDepartments.cs (Query + Validator + Handler)
□ GetDepartmentById.cs (Query + Handler)
□ UpdateDepartment.cs (Command + Validator + Handler)
□ DeleteDepartment.cs (Command + Handler)

□ Mobile features (nếu cần):
  □ GetDepartmentsMobile.cs
  □ GetDepartmentByIdMobile.cs

□ Validation logic ở Validator, không ở Handler
□ Response objects đúng type: ApiResult<T>, PagedResult<T>
□ Soft delete: set IsActive = false (không hard delete)
□ Include related entities trong queries
□ Publish event (nếu dự án dùng event)
```

---

## 🔄 **Bước Tiếp Theo**

✅ Hoàn thành BƯỚC 3 → Chuyển sang **BƯỚC 4A hoặc 4B: Tạo API Controllers**

📄 **Tài liệu:** Xem `step-4-A.md` (Admin only) hoặc `step-4-B.md` (Admin + Mobile)
