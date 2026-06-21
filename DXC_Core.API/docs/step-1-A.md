# 🔧 BƯỚC 1A: THIẾT KẾ & KHỞI TẠO DATABASE - Thêm vào DbContext Hiện Có

**Trường hợp:** Feature chia sẻ schema với DbContext hiện có (CoreDbContext hoặc ZaloMiniAppDbContext)

**Ví dụ:** Thêm "Department" vào Core.Common, hoặc "ProductCategory" vào ZaloMiniApp.Products

---

## 📋 **Checklist BƯỚC 1A**

```
□ BƯỚC 1A.1: Tạo Models (Entities)
□ BƯỚC 1A.2: Cập nhật DbContext (thêm DbSet + OnModelCreating)
□ BƯỚC 1A.3: Tạo Migration
□ BƯỚC 1A.4: Áp dụng Migration vào Database
```

---

## 1️⃣ **BƯỚC 1A.1: Tạo Models (Entities)**

### **Xác Định DbContext & Schema**

Dựa vào BƯỚC 0 decision, xác định:
- **DbContext:** CoreDbContext hoặc ZaloMiniAppDbContext?
- **Schema:** IDENTITY / PROFILE / COMMON / SERVICES / PLACES / PRODUCTS / DOCUMENTS?

### **Tạo Thư Mục Models**

```bash
# Ví dụ: Tạo Department entity trong Core.Common

mkdir -p DXC_Core.API/Data/CoreContext/Models/Common
```

### **Tạo Entity File**

**File Location:** `DXC_Core.API/Data/{DbContext}/Models/{Schema}/{EntityName}.cs`

**Template Entity - Trường hợp đơn giản (không có relationship):**

```csharp
// File: DXC_Core.API/Data/CoreContext/Models/Common/Department.cs

namespace DXC_Core.API.Data.CoreContext.Models.Common;

public class Department
{
    public int Id { get; set; }                    // Internal PK for relationships
    public Guid PublicId { get; set; }             // API identifier - REQUIRED
    
    // Business properties
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; }
    
    // Audit properties - REQUIRED
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

**Template Entity - Trường hợp có Foreign Key:**

```csharp
// File: DXC_Core.API/Data/CoreContext/Models/Common/Department.cs

namespace DXC_Core.API.Data.CoreContext.Models.Common;

public class Department
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    
    // Foreign Key - dùng int, không phải Guid
    public int OrganizationId { get; set; }
    
    // Business properties
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; }
    
    // Audit properties
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation property - dùng Guid cho API, nhưng FK là int
    public virtual Organization? Organization { get; set; }
}
```

### **Quy Tắc Bắt Buộc:**

✅ **Luôn có:**
- `int Id` - Primary Key (internal, không expose ra API)
- `Guid PublicId` - Identifier cho API (REQUIRED, unique)
- `bool IsActive` - Soft delete support
- `DateTime CreatedAt, UpdatedAt` - Audit trail

✅ **PascalCase:** Tên class và properties dùng PascalCase

✅ **Required:** Dùng `required` keyword cho properties bắt buộc

✅ **Foreign Keys:** Dùng `int` cho FK, không dùng Guid

✅ **Navigation Properties:** Dùng `virtual` và type là Entity class

---

## 2️⃣ **BƯỚC 1A.2: Cập Nhật DbContext**

### **Mở File DbContext**

**File:** `DXC_Core.API/Data/{DbContext}/{DbContext}.cs`

Ví dụ: `DXC_Core.API/Data/CoreContext/CoreDbContext.cs`

### **Thêm DbSet**

```csharp
// Thêm vào class CoreDbContext

public DbSet<Department> Departments { get; set; }
```

**Vị trí thêm:** Sau các DbSet hiện có, grouped by schema

```csharp
public class CoreDbContext : DbContext
{
    // ... existing DbSets ...
    
    // DbSets cho Common schema
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Department> Departments { get; set; }  // ← Thêm ở đây
    
    // ... rest of code ...
}
```

### **Cấu Hình Entity trong OnModelCreating**

```csharp
// Trong method OnModelCreating(ModelBuilder modelBuilder)

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // ... existing configurations ...

    // Thêm configuration cho Department
    modelBuilder.Entity<Department>(entity =>
    {
        // 1. Chỉ định table name và schema
        entity.ToTable("Departments", schema: "COMMON");
        
        // 2. Cấu hình PublicId - REQUIRED
        entity.Property(d => d.PublicId)
              .HasDefaultValueSql("NEWID()");  // SQL Server: auto-generate GUID
        
        entity.HasIndex(d => d.PublicId)
              .IsUnique();  // Đảm bảo uniqueness
        
        // 3. Indexes cho search & unique constraints
        entity.HasIndex(d => new { d.OrganizationId, d.Code })
              .IsUnique();  // Combination unique
        
        entity.HasIndex(d => d.Name);  // Search by name
        
        // 4. Cấu hình Foreign Key
        entity.HasOne(d => d.Organization)
              .WithMany(o => o.Departments)
              .HasForeignKey(d => d.OrganizationId)
              .OnDelete(DeleteBehavior.Cascade);  // Cascade delete
        
        // 5. Tính chất của properties (nếu cần)
        entity.Property(d => d.Name)
              .IsRequired()
              .HasMaxLength(100);
        
        entity.Property(d => d.Code)
              .IsRequired()
              .HasMaxLength(50);
    });
}
```

### **Ví Dụ Đầy Đủ DbContext Update:**

```csharp
// File: DXC_Core.API/Data/CoreContext/CoreDbContext.cs

using DXC_Core.API.Data.CoreContext.Models.Identity;
using DXC_Core.API.Data.CoreContext.Models.Profile;
using DXC_Core.API.Data.CoreContext.Models.Common;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Data.CoreContext;

public class CoreDbContext : DbContext
{
    public CoreDbContext(DbContextOptions<CoreDbContext> options) : base(options) { }

    // IDENTITY schema
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }

    // PROFILE schema
    public DbSet<UserProfile> UserProfiles { get; set; }

    // COMMON schema
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Department> Departments { get; set; }  // ← Mới thêm

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ... existing configurations ...

        // Configuration cho Department (MỚI)
        modelBuilder.Entity<Department>(entity =>
        {
            entity.ToTable("Departments", schema: "COMMON");
            
            entity.Property(d => d.PublicId)
                  .HasDefaultValueSql("NEWID()");
            
            entity.HasIndex(d => d.PublicId).IsUnique();
            entity.HasIndex(d => new { d.OrganizationId, d.Code }).IsUnique();
            entity.HasIndex(d => d.Name);
            
            entity.HasOne(d => d.Organization)
                  .WithMany(o => o.Departments)
                  .HasForeignKey(d => d.OrganizationId)
                  .OnDelete(DeleteBehavior.Cascade);
            
            entity.Property(d => d.Name)
                  .IsRequired()
                  .HasMaxLength(100);
            
            entity.Property(d => d.Code)
                  .IsRequired()
                  .HasMaxLength(50);
        });
    }
}
```

---

## 3️⃣ **BƯỚC 1A.3: Tạo Migration**

### **Lệnh Tạo Migration**

Chạy lệnh dưới trong terminal tại **root folder** của project:

```bash
# Cú pháp chung:
# dotnet ef migrations add {MigrationName} \
#   --project {ProjectPath} \
#   --context {DbContextName} \
#   --output-dir {MigrationFolder}

# Ví dụ cụ thể: Thêm Department entity
dotnet ef migrations add AddDepartmentEntity \
  --project DXC_Core.API/DXC_Core.API.csproj \
  --context CoreDbContext \
  --output-dir Migrations/CoreDb
```

### **Giải Thích Tham Số:**

- `AddDepartmentEntity` - Tên migration (naming: `Add{EntityName}` hoặc `Add{EntityName}Table`)
- `--project DXC_Core.API/DXC_Core.API.csproj` - Project path
- `--context CoreDbContext` - DbContext name (QUAN TRỌNG: chỉ định đúng context)
- `--output-dir Migrations/CoreDb` - Thư mục output (organized by context)

### **Kiểm Tra Migration File**

Sau khi chạy lệnh, kiểm tra file migration được tạo:

**File Location:** `DXC_Core.API/Migrations/CoreDb/{Timestamp}_AddDepartmentEntity.cs`

**Nội dung Migration:**

```csharp
using Microsoft.EntityFrameworkCore.Migrations;

namespace DXC_Core.API.Migrations.CoreDb
{
    public partial class AddDepartmentEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Departments",
                schema: "COMMON",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, 
                        defaultValueSql: "NEWID()"),
                    OrganizationId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Departments_Organizations_OrganizationId",
                        column: x => x.OrganizationId,
                        principalSchema: "COMMON",
                        principalTable: "Organizations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Departments_PublicId",
                schema: "COMMON",
                table: "Departments",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_OrganizationId_Code",
                schema: "COMMON",
                table: "Departments",
                columns: new[] { "OrganizationId", "Code" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_Name",
                schema: "COMMON",
                table: "Departments",
                column: "Name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Departments",
                schema: "COMMON");
        }
    }
}
```

### **Checklist Migration File:**

- ✅ Có `PublicId` column với `defaultValueSql: "NEWID()"`
- ✅ Có unique index cho `PublicId`
- ✅ Có Foreign Key đúng schema
- ✅ Có audit fields: `IsActive`, `CreatedAt`, `UpdatedAt`
- ✅ Có indexes cho search fields
- ✅ Tên table và schema đúng

---

## 4️⃣ **BƯỚC 1A.4: Áp Dụng Migration vào Database**

### **Lệnh Áp Dụng Migration**

```bash
# Cú pháp chung:
# dotnet ef database update \
#   --project {ProjectPath} \
#   --context {DbContextName}

# Ví dụ cụ thể:
dotnet ef database update \
  --project DXC_Core.API/DXC_Core.API.csproj \
  --context CoreDbContext
```

### **Output Kỳ Vọng:**

```
Build started...
Build succeeded.
Done.
```

### **Kiểm Tra Database**

Sau khi migration chạy thành công:

1. **Kiểm tra bảng được tạo:**
   - Mở SQL Server Management Studio
   - Navigate: `DXC_Core` → `Schemas` → `COMMON` → `Tables`
   - Xác nhận: `Departments` table tồn tại

2. **Kiểm tra columns:**
   - `Id` (int, Primary Key)
   - `PublicId` (uniqueidentifier, unique)
   - `OrganizationId` (int, Foreign Key)
   - `Name`, `Code`, `Description`
   - `IsActive`, `CreatedAt`, `UpdatedAt`

3. **Kiểm tra indexes:**
   - `IX_Departments_PublicId` (unique)
   - `IX_Departments_OrganizationId_Code` (unique)
   - `IX_Departments_Name`

---

## 🚨 **Troubleshooting**

### **Lỗi 1: "The migration 'AddDepartmentEntity' has already been applied to the database."**

→ Migration đã được apply. Nếu cần revert:
```bash
dotnet ef database update {PreviousMigrationName} --context CoreDbContext
```

### **Lỗi 2: "Unable to resolve service for type 'CoreDbContext'."**

→ DbContext chưa được register trong Program.cs
→ Kiểm tra: `builder.Services.AddDbContext<CoreDbContext>(...)`

### **Lỗi 3: "Schema 'COMMON' does not exist on the target database."**

→ Schema chưa tồn tại
→ Cần tạo schema thủ công hoặc qua migration

### **Lỗi 4: Migration conflicts**

→ Xóa migration vừa tạo nếu chưa apply:
```bash
dotnet ef migrations remove --context CoreDbContext
```

---

## ✅ **Checklist Hoàn Thành BƯỚC 1A**

```
□ Entity class tạo: {EntityName}.cs
□ DbSet thêm vào DbContext: public DbSet<{EntityName}> {EntityNames} { get; set; }
□ OnModelCreating cấu hình xong
□ Migration tạo thành công: Migrations/CoreDb/{Timestamp}_{MigrationName}.cs
□ Migration apply thành công (đã chạy dotnet ef database update)
□ Database kiểm tra: Table, columns, indexes tạo đúng
□ PublicId column có defaultValueSql: "NEWID()"
□ Relationships configured đúng (nếu có FK)
```

---

## 🔄 **Bước Tiếp Theo**

✅ Hoàn thành BƯỚC 1A → Chuyển sang **BƯỚC 2: Tạo DTOs**

📄 **Tài liệu:** Xem `step-2.md`
