# 🔧 BƯỚC 1B: THIẾT KẾ & KHỞI TẠO DATABASE - Tạo DbContext Mới

**Trường hợp:** Feature độc lập với database riêng biệt (tạo DbContext và Database mới)

**Ví dụ:** "Internal Documents Management", "HR System", "Financial System"

---

## 📋 **Checklist BƯỚC 1B**

```
□ BƯỚC 1B.1: Tạo Models (Entities)
□ BƯỚC 1B.2: Tạo DbContext mới
□ BƯỚC 1B.3: Đăng ký DbContext trong Program.cs
□ BƯỚC 1B.4: Cập nhật Connection Strings
□ BƯỚC 1B.5: Tạo Migration
□ BƯỚC 1B.6: Áp dụng Migration vào Database
```

---

## 1️⃣ **BƯỚC 1B.1: Tạo Models (Entities)**

### **Tạo Thư Mục Project**

```bash
# Ví dụ: Tạo Internal Documents feature

mkdir -p DXC_Core.API/Data/InternalDocumentsContext/Models
```

**Cấu trúc folder:**
```
DXC_Core.API/Data/
├── CoreContext/
├── FileContext/
├── ZaloMiniAppContext/
└── InternalDocumentsContext/           # ← Mới tạo
    ├── InternalDocumentsDbContext.cs   # ← DbContext mới
    └── Models/
        ├── InternalDocumentCategory.cs
        └── InternalDocument.cs
```

### **Tạo Entity Files**

**File 1:** `DXC_Core.API/Data/InternalDocumentsContext/Models/InternalDocumentCategory.cs`

```csharp
namespace DXC_Core.API.Data.InternalDocumentsContext.Models;

public class InternalDocumentCategory
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    
    public required string Name { get; set; }
    public string? Description { get; set; }
    
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual ICollection<InternalDocument> Documents { get; set; } = new List<InternalDocument>();
}
```

**File 2:** `DXC_Core.API/Data/InternalDocumentsContext/Models/InternalDocument.cs`

```csharp
namespace DXC_Core.API.Data.InternalDocumentsContext.Models;

public class InternalDocument
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    
    // Foreign Key
    public int CategoryId { get; set; }
    
    public required string Title { get; set; }
    public string? Content { get; set; }
    public string? FileUrl { get; set; }
    public DateTime? IssuedDate { get; set; }
    
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual InternalDocumentCategory? Category { get; set; }
}
```

---

## 2️⃣ **BƯỚC 1B.2: Tạo DbContext Mới**

**File:** `DXC_Core.API/Data/InternalDocumentsContext/InternalDocumentsDbContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.InternalDocumentsContext.Models;

namespace DXC_Core.API.Data.InternalDocumentsContext;

public class InternalDocumentsDbContext : DbContext
{
    // Constructor
    public InternalDocumentsDbContext(DbContextOptions<InternalDocumentsDbContext> options)
        : base(options) { }

    // DbSets
    public DbSet<InternalDocumentCategory> DocumentCategories { get; set; }
    public DbSet<InternalDocument> Documents { get; set; }

    // Configuration
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure InternalDocumentCategory
        modelBuilder.Entity<InternalDocumentCategory>(entity =>
        {
            entity.ToTable("DocumentCategories", schema: "DOCUMENTS");
            
            entity.Property(c => c.PublicId)
                  .HasDefaultValueSql("NEWID()");
            
            entity.HasIndex(c => c.PublicId).IsUnique();
            entity.HasIndex(c => c.Name);
            
            entity.Property(c => c.Name)
                  .IsRequired()
                  .HasMaxLength(100);
        });

        // Configure InternalDocument
        modelBuilder.Entity<InternalDocument>(entity =>
        {
            entity.ToTable("Documents", schema: "DOCUMENTS");
            
            entity.Property(d => d.PublicId)
                  .HasDefaultValueSql("NEWID()");
            
            entity.HasIndex(d => d.PublicId).IsUnique();
            entity.HasIndex(d => d.Title);
            entity.HasIndex(d => d.CategoryId);
            
            entity.HasOne(d => d.Category)
                  .WithMany(c => c.Documents)
                  .HasForeignKey(d => d.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.Property(d => d.Title)
                  .IsRequired()
                  .HasMaxLength(255);
        });
    }
}
```

### **Quy Tắc Tạo DbContext:**

✅ Naming: `{FeatureName}DbContext` (ví dụ: `InternalDocumentsDbContext`)

✅ Constructor: Nhận `DbContextOptions<{DbContextName}>`

✅ DbSets: Public property cho mỗi entity

✅ OnModelCreating: Cấu hình tất cả entities

✅ Schema: Sử dụng `schema: "DOCUMENTS"` (hoặc tên schema phù hợp)

✅ Namespace: `DXC_Core.API.Data.{ContextName}`

---

## 3️⃣ **BƯỚC 1B.3: Đăng Ký DbContext trong Program.cs**

### **Mở File Program.cs**

**File:** `DXC_Core.API/Program.cs`

### **Thêm Using Statement**

```csharp
using DXC_Core.API.Data.InternalDocumentsContext;  // ← Thêm dòng này
```

### **Thêm DbContext Registration**

Tìm phần comment `// --- Bắt đầu phần cấu hình dịch vụ ---` và thêm code dưới (sau ZaloMiniAppDbContext):

```csharp
// 1.3. Đăng ký InternalDocumentsDbContext với chuỗi kết nối từ appsettings.json
var internalDocumentsConnectionString = builder.Configuration.GetConnectionString("InternalDocumentsDbConnection");
builder.Services.AddDbContext<InternalDocumentsDbContext>(options =>
    options.UseSqlServer(internalDocumentsConnectionString));
```

### **Nơi Cần Thêm (Exact Location)**

```csharp
// ... trong Program.cs

// 1.2. Đăng ký ZaloMiniAppDbContext với chuỗi kết nối từ appsettings.json
var zaloMiniAppConnectionString = builder.Configuration.GetConnectionString("ZaloMiniAppDbConnection");
builder.Services.AddDbContext<ZaloMiniAppDbContext>(options =>
    options.UseSqlServer(zaloMiniAppConnectionString));

// 1.3. Đăng ký InternalDocumentsDbContext với chuỗi kết nối từ appsettings.json  ← THÊM
var internalDocumentsConnectionString = builder.Configuration.GetConnectionString("InternalDocumentsDbConnection");
builder.Services.AddDbContext<InternalDocumentsDbContext>(options =>
    options.UseSqlServer(internalDocumentsConnectionString));

// 2. Đăng ký các dịch vụ dùng chung
builder.Services.AddScoped<IPasswordHasherService, PasswordHasherService>();

// ... rest of code
```

---

## 4️⃣ **BƯỚC 1B.4: Cập Nhật Connection Strings**

### **Mở File appsettings.json**

**File:** `DXC_Core.API/appsettings.json`

### **Thêm Connection String Mới**

```json
{
  "ConnectionStrings": {
    "CoreDbConnection": "Server={ServerName};User Id={UserId};Password={Password};Database=DXC_Core;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "FileDbConnection": "Server={ServerName};User Id={UserId};Password={Password};Database=DXC_Core;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "ZaloMiniAppDbConnection": "Server={ServerName};User Id={UserId};Password={Password};Database=DXC_ZaloMiniApp;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "InternalDocumentsDbConnection": "Server={ServerName};User Id={UserId};Password={Password};Database=DXC_InternalDocuments;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "Jwt": {
    "Issuer": "{YourDomain}",
    "Audience": "{YourDomain}",
    "Key": "{YourSecretKey}"
  },
  // ... rest of config
}
```

### **Connection String Format**

```
Server={ServerName};User Id={UserId};Password={Password};Database={DatabaseName};TrustServerCertificate=True;MultipleActiveResultSets=true
```

**Thay đổi:**
- `{ServerName}`: IP hoặc hostname của SQL Server
- `{UserId}`: SQL Server user (thường là `sa`)
- `{Password}`: SQL Server password
- `{DatabaseName}`: Tên database mới (ví dụ: `DXC_InternalDocuments`)

---

## 5️⃣ **BƯỚC 1B.5: Tạo Migration**

### **Lệnh Tạo Migration**

```bash
# Cú pháp:
# dotnet ef migrations add {MigrationName} \
#   --project {ProjectPath} \
#   --context {DbContextName} \
#   --output-dir Migrations/{FolderName}

# Ví dụ:
dotnet ef migrations add InitialCreateInternalDocuments \
  --project DXC_Core.API/DXC_Core.API.csproj \
  --context InternalDocumentsDbContext \
  --output-dir Migrations/InternalDocumentsDb
```

### **Tham Số Quan Trọng:**

- `InitialCreateInternalDocuments` - Migration name (cho DbContext mới, dùng `InitialCreate{FeatureName}`)
- `--context InternalDocumentsDbContext` - **DbContext name (QUAN TRỌNG: chỉ định đúng)**
- `--output-dir Migrations/InternalDocumentsDb` - Thư mục output (organize by DbContext)

### **Kiểm Tra Migration File**

Sau khi chạy, kiểm tra file được tạo:

**File Location:** `DXC_Core.API/Migrations/InternalDocumentsDb/{Timestamp}_InitialCreateInternalDocuments.cs`

**Nội dung:**

```csharp
using Microsoft.EntityFrameworkCore.Migrations;

namespace DXC_Core.API.Migrations.InternalDocumentsDb
{
    public partial class InitialCreateInternalDocuments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "DOCUMENTS");

            migrationBuilder.CreateTable(
                name: "DocumentCategories",
                schema: "DOCUMENTS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, 
                        defaultValueSql: "NEWID()"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Documents",
                schema: "DOCUMENTS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false,
                        defaultValueSql: "NEWID()"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IssuedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Documents_DocumentCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "DOCUMENTS",
                        principalTable: "DocumentCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentCategories_Name",
                schema: "DOCUMENTS",
                table: "DocumentCategories",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_DocumentCategories_PublicId",
                schema: "DOCUMENTS",
                table: "DocumentCategories",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_CategoryId",
                schema: "DOCUMENTS",
                table: "Documents",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_PublicId",
                schema: "DOCUMENTS",
                table: "Documents",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_Title",
                schema: "DOCUMENTS",
                table: "Documents",
                column: "Title");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Documents",
                schema: "DOCUMENTS");

            migrationBuilder.DropTable(
                name: "DocumentCategories",
                schema: "DOCUMENTS");
        }
    }
}
```

### **Checklist Migration File:**

- ✅ `EnsureSchema()` để tạo schema nếu không tồn tại
- ✅ PublicId với `defaultValueSql: "NEWID()"`
- ✅ Unique indexes cho PublicId
- ✅ Foreign keys đúng schema
- ✅ Audit fields: IsActive, CreatedAt, UpdatedAt

---

## 6️⃣ **BƯỚC 1B.6: Áp Dụng Migration vào Database**

### **Lệnh Áp Dụng Migration**

```bash
dotnet ef database update \
  --project DXC_Core.API/DXC_Core.API.csproj \
  --context InternalDocumentsDbContext
```

### **Output Kỳ Vọng:**

```
Build started...
Build succeeded.
Done.
```

### **Kiểm Tra Database**

1. **Kiểm tra database được tạo:**
   - Mở SQL Server Management Studio
   - Kiểm tra `DXC_InternalDocuments` database tồn tại

2. **Kiểm tra schema:**
   - Navigate: `DXC_InternalDocuments` → `Security` → `Schemas`
   - Xác nhận: `DOCUMENTS` schema tồn tại

3. **Kiểm tra tables:**
   - Navigate: `DXC_InternalDocuments` → `Schemas` → `DOCUMENTS` → `Tables`
   - Xác nhận: `DocumentCategories` và `Documents` tables tồn tại

---

## 🚨 **Troubleshooting**

### **Lỗi 1: "Cannot find a DbContext type '{DbContextName}'."**

→ DbContext chưa được import đúng
→ Kiểm tra `using` statement trong Program.cs

### **Lỗi 2: "Database '{DatabaseName}' does not exist."**

→ Database chưa được tạo tự động
→ SQL Server có thể tạo tự động, hoặc tạo thủ công qua SQL Management Studio

### **Lỗi 3: "The connection string 'InternalDocumentsDbConnection' was not found in configuration."**

→ Connection string chưa thêm vào appsettings.json
→ Kiểm tra key name khớp trong Program.cs và appsettings.json

### **Lỗi 4: "A network-related or instance-specific error occurred while establishing a connection to SQL Server."**

→ Connection string sai (server, credentials)
→ Kiểm tra IP, username, password, TrustServerCertificate

---

## ✅ **Checklist Hoàn Thành BƯỚC 1B**

```
□ Entities tạo: InternalDocumentCategory.cs, InternalDocument.cs
□ DbContext mới tạo: InternalDocumentsDbContext.cs
□ DbContext registered trong Program.cs
□ Connection string thêm vào appsettings.json
□ Migration tạo: Migrations/InternalDocumentsDb/{Timestamp}_{MigrationName}.cs
□ Migration apply thành công
□ Database tạo: DXC_InternalDocuments
□ Schema tạo: DOCUMENTS
□ Tables tạo: DocumentCategories, Documents
□ PublicId column đúng với NEWID() default
□ Foreign keys configured đúng
```

---

## 🔄 **Bước Tiếp Theo**

✅ Hoàn thành BƯỚC 1B → Chuyển sang **BƯỚC 2: Tạo DTOs**

📄 **Tài liệu:** Xem `step-2.md`
