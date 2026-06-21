# 📚 QUY TRÌNH CHUNG THÊM CHỨC NĂNG MỚI - DXC_Core API

Hướng dẫn chi tiết từng bước để thêm một chức năng/feature mới vào dự án DXC_Core API.

---

## 🎯 **BƯỚC 0: QUYẾT ĐỊNH KIẾN TRÚC (Phase Planning)**

### **Checklist Phân Tích:**
- [ ] Feature này liên quan đến Mini App hay Core Platform?
  - **Mini App** → Sử dụng `ZaloMiniAppDbContext`, schema trong ZaloMiniApp DB
  - **Core Platform** (Identity, Common, Services) → Sử dụng `CoreDbContext`, schema trong Core DB
  - **Independent Business Logic** → Tạo **DbContext mới**, database riêng biệt

- [ ] Dữ liệu có chia sẻ với entities khác?
  - **Có** → Xem xét shared schema trong cùng DbContext
  - **Không** → Có thể dùng database riêng

- [ ] Feature có cần mobile API (read-only)?
  - **Có** → Tạo 2 controllers (Admin + Mobile)
  - **Không** → Chỉ Admin controller

- [ ] Feature có yêu cầu upload file?
  - **Có** → Tuân thủ File Association Workflow (2-step)
  - **Không** → Skip file handling

### **Decision Matrix:**

```
Feature Type          | DbContext               | Schema        | Database           | Routes
----------------------|-------------------------|---------------|--------------------|-----------------------------------------
ZaloMiniApp.Places    | ZaloMiniAppDbContext    | PLACES        | DXC_ZaloMiniApp    | /api/zalo-mini-app/admin/places/
ZaloMiniApp.Services  | ZaloMiniAppDbContext    | SERVICES      | DXC_ZaloMiniApp    | /api/zalo-mini-app/admin/services/
ZaloMiniApp.Products  | ZaloMiniAppDbContext    | PRODUCTS      | DXC_ZaloMiniApp    | /api/zalo-mini-app/admin/products/
Core.Identity         | CoreDbContext           | IDENTITY      | DXC_Core           | /api/identity/
Core.Profile          | CoreDbContext           | PROFILE       | DXC_Core           | /api/profile/
Core.Common           | CoreDbContext           | COMMON        | DXC_Core           | /api/common/
Core.Docs             | NEW InternalDocsDbContext | DOCUMENTS    | DXC_InternalDocs   | /api/internal-documents/
```

---

## 🔧 **BƯỚC 1: THIẾT KẾ & KHỞI TẠO DATABASE**

### **1.1 Tạo Models (Entities)**

**File Location:** 
- Shared schema: `DXC_Core.API/Data/{DbContextName}/Models/{SchemaFolder}/`
- New DbContext: `DXC_Core.API/Data/{ContextName}Context/Models/`

**Entity Template:**
```csharp
namespace DXC_Core.API.Data.{ContextName}.Models.{Schema};

public class {EntityName}
{
    public int Id { get; set; }                    // Internal PK for relationships
    public Guid PublicId { get; set; }             // API identifier (REQUIRED)
    
    // Business properties
    public required string Name { get; set; }
    public string? Description { get; set; }
    
    // Audit properties
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<ChildEntity>? Children { get; set; } = new List<ChildEntity>();
}
```

**Quy tắc bắt buộc:**
- ✅ Luôn có `Id` (int/long) + `PublicId` (Guid)
- ✅ Sử dụng `required` cho properties bắt buộc
- ✅ Có `IsActive` cho soft delete support
- ✅ Có `CreatedAt`, `UpdatedAt` cho audit
- ✅ PascalCase cho tên class và properties

---

### **1.2 Tạo hoặc Cập nhật DbContext**

**Option A: Thêm vào DbContext hiện có**
```csharp
// File: DXC_Core.API/Data/CoreContext/CoreDbContext.cs

public DbSet<NewEntity> NewEntities { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);
    
    modelBuilder.Entity<NewEntity>(entity =>
    {
        entity.ToTable("NewEntities", schema: "NEW_SCHEMA");
        entity.Property(e => e.PublicId).HasDefaultValueSql("NEWID()");
        entity.HasIndex(e => e.PublicId).IsUnique();
        entity.HasIndex(e => e.Name);
        
        // Configure relationships
        entity.HasOne(e => e.Parent)
              .WithMany(p => p.Children)
              .HasForeignKey(e => e.ParentId)
              .OnDelete(DeleteBehavior.Cascade);
    });
}
```

**Option B: Tạo DbContext mới (cho feature độc lập)**
```csharp
// File: DXC_Core.API/Data/{FeatureName}Context/{FeatureName}DbContext.cs

public class {FeatureName}DbContext : DbContext
{
    public {FeatureName}DbContext(DbContextOptions<{FeatureName}DbContext> options) 
        : base(options) { }

    public DbSet<Entity1> Entity1s { get; set; }
    public DbSet<Entity2> Entity2s { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure entities...
    }
}
```

---

### **1.3 Đăng ký DbContext trong Program.cs**

**Chỉ cần nếu tạo DbContext mới:**

```csharp
// File: DXC_Core.API/Program.cs
// Thêm vào phần "Bắt đầu phần cấu hình dịch vụ"

var {featureName}ConnectionString = builder.Configuration
    .GetConnectionString("{FeatureName}DbConnection");
builder.Services.AddDbContext<{FeatureName}DbContext>(options =>
    options.UseSqlServer({featureName}ConnectionString));
```

---

### **1.4 Cập nhật Connection Strings**

**File:** `DXC_Core.API/appsettings.json`

```json
{
  "ConnectionStrings": {
    "CoreDbConnection": "Server=...;Database=DXC_Core;...",
    "{FeatureName}DbConnection": "Server=...;Database=DXC_{FeatureName};..."
  }
}
```

---

### **1.5 Tạo Migration & Áp dụng Database**

```bash
# Terminal tại root project folder

# Nếu thêm vào DbContext hiện có:
dotnet ef migrations add Add_{EntityName}_Table \
  --project DXC_Core.API/DXC_Core.API.csproj \
  --context CoreDbContext \
  --output-dir Migrations/CoreDb

# Nếu tạo DbContext mới:
dotnet ef migrations add InitialCreate_{FeatureName} \
  --project DXC_Core.API/DXC_Core.API.csproj \
  --context {FeatureName}DbContext \
  --output-dir Migrations/{FeatureName}Db

# Áp dụng migration vào database
dotnet ef database update \
  --project DXC_Core.API/DXC_Core.API.csproj \
  --context {DbContextName}
```

**Checklist:**
- [ ] Migration file được tạo đúng thư mục
- [ ] Có thuộc tính `PublicId` với `HasDefaultValueSql("NEWID()")`
- [ ] Relationships và FK được cấu hình đúng
- [ ] Indexes được tạo cho `PublicId` và search fields

---

## 📝 **BƯỚC 2: TẠO DTOs (Data Transfer Objects)**

**File Location:** `DXC_Core.API/Features/{Domain}/{FeatureName}/`

### **Pattern DTO**

```csharp
// Admin DTO (đầy đủ thông tin)
public class {EntityName}Dto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Related data (nếu cần)
    public {RelatedDto}? RelatedEntity { get; set; }
}

// Mobile DTO (tối thiểu hóa dữ liệu)
public class {EntityName}MobileDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}
```

**Quy tắc:**
- ✅ Không lộ `Id` (internal), chỉ `PublicId`
- ✅ Admin DTO có audit fields, Mobile DTO không
- ✅ Naming: `{EntityName}Dto`, `{EntityName}MobileDto`
- ✅ JSON properties tự động camelCase via config

---

## 🎯 **BƯỚC 3: TẠO FEATURES (Vertical Slice - CQRS)**

**Cấu trúc file mỗi feature:**
```
{Feature}.cs
├── Command/Query (nested class)
├── Validator (nested class)
└── Handler (nested class)
```

### **3.1 CREATE Feature**

```csharp
// File: DXC_Core.API/Features/{Domain}/{FeatureName}/Create{EntityName}.cs

using {DbContext};
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;

namespace DXC_Core.API.Features.{Domain}.{FeatureName};

public static class Create{EntityName}
{
    // Step 1: Command - định nghĩa input
    public class Command : IRequest<ApiResult<{EntityName}Dto>>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        // ... other properties
    }

    // Step 2: Validator - xác thực input
    public class Validator : AbstractValidator<Command>
    {
        private readonly {DbContext} _dbContext;

        public Validator({DbContext} dbContext)
        {
            _dbContext = dbContext;

            RuleFor(c => c.Name)
                .NotEmpty().WithMessage("Tên không được để trống")
                .MaximumLength(100).WithMessage("Tên không được vượt quá 100 ký tự")
                .MustAsync(BeUniqueName).WithMessage("Tên đã tồn tại");

            RuleFor(c => c.Description)
                .MaximumLength(500).WithMessage("Mô tả không được vượt quá 500 ký tự");
        }

        private async Task<bool> BeUniqueName(Command cmd, string name, CancellationToken ct)
        {
            return !await _dbContext.Entities
                .AnyAsync(e => e.Name == name, ct);
        }
    }

    // Step 3: Handler - xử lý logic
    public class Handler : IRequestHandler<Command, ApiResult<{EntityName}Dto>>
    {
        private readonly {DbContext} _dbContext;

        public Handler({DbContext} dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<{EntityName}Dto>> Handle(
            Command request, 
            CancellationToken cancellationToken)
        {
            // 1. Create entity
            var entity = new {EntityName}
            {
                PublicId = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // 2. Add to context
            _dbContext.{EntityNames}.Add(entity);

            // 3. Save
            await _dbContext.SaveChangesAsync(cancellationToken);

            // 4. Map to DTO
            var dto = new {EntityName}Dto
            {
                PublicId = entity.PublicId,
                Name = entity.Name,
                Description = entity.Description
            };

            // 5. Return result
            return new ApiResult<{EntityName}Dto>
            {
                Success = true,
                Data = dto,
                Message = "Tạo thành công"
            };
        }
    }
}
```

### **3.2 GET LIST Feature (with Pagination & Filters)**

```csharp
// File: Get{EntityNames}.cs

public class Query : IRequest<PagedResult<{EntityName}Dto>>
{
    public int Current { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Name { get; set; }              // Filter by name
    public bool? IsActive { get; set; }            // Filter by status
    public DateTime? CreatedFrom { get; set; }     // Filter by date range
    public DateTime? CreatedTo { get; set; }
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

public class Handler : IRequestHandler<Query, PagedResult<{EntityName}Dto>>
{
    public async Task<PagedResult<{EntityName}Dto>> Handle(Query request, CancellationToken ct)
    {
        // 1. Build query with filters
        var query = _dbContext.{EntityNames}.AsQueryable();

        if (!string.IsNullOrEmpty(request.Name))
            query = query.Where(e => e.Name.Contains(request.Name));

        if (request.IsActive.HasValue)
            query = query.Where(e => e.IsActive == request.IsActive.Value);

        if (request.CreatedFrom.HasValue)
            query = query.Where(e => e.CreatedAt >= request.CreatedFrom.Value);

        if (request.CreatedTo.HasValue)
            query = query.Where(e => e.CreatedAt <= request.CreatedTo.Value);

        // 2. Get total count
        var total = await query.CountAsync(ct);

        // 3. Get paged data
        var entities = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((request.Current - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(e => new {EntityName}Dto
            {
                PublicId = e.PublicId,
                Name = e.Name,
                // ... map other properties
            })
            .ToListAsync(ct);

        // 4. Return paged result
        return new PagedResult<{EntityName}Dto>
        {
            Success = true,
            Data = entities,
            Total = total,
            Current = request.Current,
            PageSize = request.PageSize
        };
    }
}
```

### **3.3 GET BY ID Feature**

```csharp
public class Query : IRequest<ApiResult<{EntityName}Dto>>
{
    public required Guid PublicId { get; set; }
}

public class Handler : IRequestHandler<Query, ApiResult<{EntityName}Dto>>
{
    public async Task<ApiResult<{EntityName}Dto>> Handle(Query request, CancellationToken ct)
    {
        var entity = await _dbContext.{EntityNames}
            .FirstOrDefaultAsync(e => e.PublicId == request.PublicId, ct);

        if (entity == null)
            return new ApiResult<{EntityName}Dto>
            {
                Success = false,
                Message = "Không tìm thấy dữ liệu"
            };

        return new ApiResult<{EntityName}Dto>
        {
            Success = true,
            Data = MapToDto(entity)
        };
    }
}
```

### **3.4 UPDATE Feature**

```csharp
public class Command : IRequest<ApiResult<{EntityName}Dto>>
{
    public required Guid PublicId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
}

public class Validator : AbstractValidator<Command>
{
    public Validator({DbContext} dbContext)
    {
        RuleFor(c => c.PublicId)
            .MustAsync(async (id, ct) =>
                await dbContext.{EntityNames}.AnyAsync(e => e.PublicId == id, ct))
            .WithMessage("Dữ liệu không tồn tại");

        RuleFor(c => c.Name)
            .MaximumLength(100)
            .MustAsync(BeUniqueNameExcludingSelf)
            .WithMessage("Tên đã tồn tại");
    }

    private async Task<bool> BeUniqueNameExcludingSelf(
        Command cmd, string name, CancellationToken ct)
    {
        return !await _dbContext.{EntityNames}
            .AnyAsync(e => e.Name == name && e.PublicId != cmd.PublicId, ct);
    }
}

public class Handler : IRequestHandler<Command, ApiResult<{EntityName}Dto>>
{
    public async Task<ApiResult<{EntityName}Dto>> Handle(Command request, CancellationToken ct)
    {
        var entity = await _dbContext.{EntityNames}
            .FirstOrDefaultAsync(e => e.PublicId == request.PublicId, ct);

        if (entity == null)
            return new ApiResult<{EntityName}Dto>
            { Success = false, Message = "Không tìm thấy" };

        // Update properties
        if (!string.IsNullOrEmpty(request.Name))
            entity.Name = request.Name;
        
        if (request.Description != null)
            entity.Description = request.Description;

        entity.UpdatedAt = DateTime.UtcNow;

        _dbContext.{EntityNames}.Update(entity);
        await _dbContext.SaveChangesAsync(ct);

        return new ApiResult<{EntityName}Dto>
        {
            Success = true,
            Data = MapToDto(entity),
            Message = "Cập nhật thành công"
        };
    }
}
```

### **3.5 DELETE Feature (Soft Delete)**

```csharp
public class Command : IRequest<ApiResult>
{
    public required Guid PublicId { get; set; }
}

public class Handler : IRequestHandler<Command, ApiResult>
{
    public async Task<ApiResult> Handle(Command request, CancellationToken ct)
    {
        var entity = await _dbContext.{EntityNames}
            .FirstOrDefaultAsync(e => e.PublicId == request.PublicId, ct);

        if (entity == null)
            return new ApiResult { Success = false, Message = "Không tìm thấy" };

        // Soft delete
        entity.IsActive = false;
        entity.UpdatedAt = DateTime.UtcNow;

        _dbContext.{EntityNames}.Update(entity);
        await _dbContext.SaveChangesAsync(ct);

        return new ApiResult
        {
            Success = true,
            Message = "Xóa thành công"
        };
    }
}
```

---

## 🎮 **BƯỚC 4: TẠO API CONTROLLERS**

**File Location:** `DXC_Core.API/Features/{Domain}/{FeatureName}/`

### **Admin Controller Template**

```csharp
// File: {EntityNames}AdminController.cs

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.{Domain}.{FeatureName};

[ApiController]
[Route("api/{route-prefix}/admin/{entity-name}")]  // Example: /api/zalo-mini-app/admin/hotels
[Authorize(Roles = "admin")]
public class {EntityNames}AdminController : ControllerBase
{
    private readonly ISender _sender;

    public {EntityNames}AdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<{EntityName}Dto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] Create{EntityName}.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<{EntityName}Dto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetList([FromQuery] Get{EntityNames}.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("{publicId}/get")]  // RPC-style: GET by ID using POST
    [ProducesResponseType(typeof(ApiResult<{EntityName}Dto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById([FromRoute] Guid publicId)
    {
        var query = new Get{EntityName}ById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<{EntityName}Dto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromBody] Update{EntityName}.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("{publicId}/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete([FromRoute] Guid publicId)
    {
        var command = new Delete{EntityName}.Command { PublicId = publicId };
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
```

### **Mobile Controller Template (Read-only)**

```csharp
// File: {EntityNames}MobileController.cs

[ApiController]
[Route("api/zalo-mini-app/mobile/{entity-name}")]
[AllowAnonymous]
public class {EntityNames}MobileController : ControllerBase
{
    private readonly ISender _sender;

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<{EntityName}MobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetList([FromQuery] Get{EntityNames}Mobile.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId}")]
    [ProducesResponseType(typeof(ApiResult<{EntityName}MobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById([FromRoute] Guid publicId)
    {
        var query = new Get{EntityName}ByIdMobile.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }
}
```

---

## ✅ **BƯỚC 5: TESTING & VERIFICATION**

### **Build & Verify**
```bash
# 1. Build project
dotnet build

# 2. Run project
dotnet run

# 3. Test endpoints
# Mở Swagger: http://localhost:5292/swagger
```

### **Test Checklist**
- [ ] Build không có error/warning
- [ ] Swagger UI hiển thị tất cả endpoints
- [ ] Admin endpoint require Authorization
- [ ] Mobile endpoint không require Authorization
- [ ] [ProducesResponseType] attributes có mặt
- [ ] CRUD operations hoạt động đúng
- [ ] Filter & pagination hoạt động
- [ ] Validation errors return correct format
- [ ] PublicId uniqueness enforced
- [ ] Soft delete (IsActive=false) hoạt động

---

## 📋 **SUMMARY: File Checklist**

### **Cho Database Shared Schema (dùng DbContext hiện có):**
- [ ] **1 file update:** `{DbContext}.cs` (add DbSet + OnModelCreating)
- [ ] **1-2 files models:** Entity classes
- [ ] **2-3 files DTOs:** Admin DTO, Mobile DTO (nếu có)
- [ ] **5 feature files:** Create, Get List, Get By ID, Update, Delete
- [ ] **2 controller files:** Admin + Mobile (hoặc 1 nếu chỉ Admin)
- [ ] **1 migration:** `Add_{EntityName}_Table`
- **Total: ~14 files**

### **Cho New DbContext (Database riêng):**
- [ ] **1 file new DbContext:** `{FeatureName}DbContext.cs`
- [ ] **1 file update:** `Program.cs` (register context)
- [ ] **1 file update:** `appsettings.json` (add connection string)
- [ ] **1-2 files models:** Entity classes
- [ ] **2-3 files DTOs:** Admin DTO, Mobile DTO
- [ ] **5 feature files:** CRUD features
- [ ] **2 controller files:** Admin + Mobile
- [ ] **1 migration:** `InitialCreate_{FeatureName}`
- **Total: ~17 files**

---

## 🚀 **BEST PRACTICES & TIPS**

### **Code Quality**
✅ Luôn sử dụng PublicId (Guid) cho API, Id (int) cho DB relationships
✅ Validator là nơi duy nhất validate input - không validate trong Handler
✅ Handler trả về response model đúng cấu trúc (ApiResult, PagedResult)
✅ Controllers "mỏng" - chỉ dispatch đến MediatR
✅ Sử dụng soft delete (IsActive) thay vì hard delete

### **Database**
✅ Migration luôn chỉ định đúng `--context`
✅ Có unique index cho PublicId
✅ Có FK constraints + cascade delete rules
✅ Luôn include related entities trong queries

### **API Design**
✅ RPC-style endpoints: `/create`, `/update`, `/delete`
✅ GET by ID dùng POST: `POST /{id}/get` (để có [FromRoute])
✅ Sử dụng `[ProducesResponseType]` cho mỗi endpoint
✅ Admin: `[Authorize(Roles = "admin")]`
✅ Mobile: `[AllowAnonymous]`

### **Naming Conventions**
✅ Features: `{Action}{EntityName}.cs` (Create{Entity}.cs, Get{Entities}.cs)
✅ DTOs: `{EntityName}Dto.cs`, `{EntityName}MobileDto.cs`
✅ Controllers: `{EntityNames}{Type}Controller.cs`
✅ Namespaces: `Features.{Domain}.{FeatureName}`
✅ Routes: `/api/{prefix}/{entity}/` (camelCase, lowercase, hyphen-separated)

---

## 📖 **EXAMPLE: Complete Implementation Checklist**

### Ví dụ: Thêm "Product Category" vào ZaloMiniApp.Products

```
□ BƯỚC 1: Database Design
  □ Tạo ProductCategory.cs entity
  □ Update ZaloMiniAppDbContext.cs
  □ dotnet ef migrations add AddProductCategory --context ZaloMiniAppDbContext
  □ dotnet ef database update --context ZaloMiniAppDbContext

□ BƯỚC 2: DTOs
  □ ProductCategoryDto.cs
  □ ProductCategoryMobileDto.cs

□ BƯỚC 3: Features
  □ CreateProductCategory.cs
  □ GetProductCategories.cs
  □ GetProductCategoryById.cs
  □ UpdateProductCategory.cs
  □ DeleteProductCategory.cs

□ BƯỚC 4: Controllers
  □ ProductCategoriesAdminController.cs
  □ ProductCategoriesMobileController.cs

□ BƯỚC 5: Testing
  □ dotnet build
  □ dotnet run
  □ Test tất cả endpoints trên Swagger
  □ Verify responses match expected format
```

---

## 🔗 **TÀI LIỆU LIÊN QUAN**

- **AGENTS.md** - Quy tắc lập trình chi tiết cho dự án
- **README.md** - Hướng dẫn cài đặt và khởi tạo
- **/.trae/rules/project_rules.md** - Project rules tổng hợp
- **Program.cs** - Configuration chi tiết
- **Data/CoreContext/CoreDbContext.cs** - Ví dụ DbContext existing
