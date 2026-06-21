# 📝 BƯỚC 2: TẠO DTOs (Data Transfer Objects)

**DTOs:** Là các lớp dùng để truyền dữ liệu giữa tầng API và client. Giúp:
- ✅ Không lộ các properties internal (Id, FK)
- ✅ Tối ưu hóa payload (chỉ gửi dữ liệu cần thiết)
- ✅ Tách biệt API contract với Database model
- ✅ Hỗ trợ multiple versions của API

---

## 📋 **Checklist BƯỚC 2**

```
□ BƯỚC 2.1: Tạo Admin DTO
□ BƯỚC 2.2: Tạo Mobile DTO (nếu cần)
□ BƯỚC 2.3: Tạo Related DTOs (nếu có relationships)
```

---

## 1️⃣ **BƯỚC 2.1: Tạo Admin DTO**

### **Vị Trí File**

**File Location:** `DXC_Core.API/Features/{Domain}/{FeatureName}/{EntityName}Dto.cs`

**Ví dụ:**
- `DXC_Core.API/Features/Common/DepartmentDto.cs`
- `DXC_Core.API/Features/ZaloMiniApp.Places.Hotels/HotelDto.cs`
- `DXC_Core.API/Features/Common.InternalDocuments/InternalDocumentDto.cs`

### **DTO Template - Đơn Giản (Không có Relationship)**

```csharp
// File: DXC_Core.API/Features/Common/DepartmentDto.cs

namespace DXC_Core.API.Features.Common;

public class DepartmentDto
{
    // Chỉ expose PublicId, không expose Id
    public Guid PublicId { get; set; }
    
    // Business properties
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; }
    
    // Audit fields (Admin DTO có, Mobile DTO không)
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### **DTO Template - Có Relationship (Simple)**

```csharp
// File: DXC_Core.API/Features/Common/DepartmentDto.cs

namespace DXC_Core.API.Features.Common;

public class DepartmentDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; }
    
    // Reference to parent (PublicId, không Id)
    public Guid OrganizationPublicId { get; set; }
    public string? OrganizationName { get; set; }
    
    // Audit fields
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### **DTO Template - Có Nested Related Data**

```csharp
// File: DXC_Core.API/Features/ZaloMiniApp.Places.Hotels/HotelDto.cs

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;

public class HotelDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public int? StarRating { get; set; }
    
    // Related images (nested list)
    public List<HotelImageDto> Images { get; set; } = new();
    
    // Audit
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// Nested DTO
public class HotelImageDto
{
    public Guid PublicId { get; set; }
    public required string ImageUrl { get; set; }
    public int? DisplayOrder { get; set; }
}
```

### **Quy Tắc DTO:**

✅ **Chỉ expose PublicId, không expose Id**
```csharp
// ✅ Đúng
public Guid PublicId { get; set; }

// ❌ Sai
public int Id { get; set; }
```

✅ **Admin DTO có audit fields**
```csharp
public bool IsActive { get; set; }
public DateTime CreatedAt { get; set; }
public DateTime UpdatedAt { get; set; }
```

✅ **Foreign Key dùng PublicId**
```csharp
// ✅ Đúng
public Guid CategoryPublicId { get; set; }

// ❌ Sai
public int CategoryId { get; set; }
```

✅ **Related object: chỉ basic info**
```csharp
// ✅ Tốt: Simple reference
public Guid OrganizationPublicId { get; set; }
public string? OrganizationName { get; set; }

// ❌ Không tốt: Full object
public OrganizationDto? Organization { get; set; }  // Có thể gây vòng lặp
```

✅ **Naming: `{EntityName}Dto`**
```csharp
DepartmentDto
HotelDto
InternalDocumentDto
ProductCategoryDto
```

---

## 2️⃣ **BƯỚC 2.2: Tạo Mobile DTO (Nếu Cần)**

### **Vị Trí File**

**File Location:** `DXC_Core.API/Features/{Domain}/{FeatureName}/{EntityName}MobileDto.cs`

### **Mobile DTO Template**

```csharp
// File: DXC_Core.API/Features/Common/DepartmentMobileDto.cs

namespace DXC_Core.API.Features.Common;

public class DepartmentMobileDto
{
    // Chỉ những field cần thiết cho mobile
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    
    // KHÔNG có audit fields
    // KHÔNG có IsActive (chỉ trả về active items)
}
```

### **So Sánh Admin vs Mobile DTO**

```csharp
// ❌ KHÔNG TỐTC: Cùng một DTO
public class DepartmentDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }  // Mobile không cần
    public DateTime CreatedAt { get; set; }  // Mobile không cần
    public DateTime UpdatedAt { get; set; }  // Mobile không cần
}

// ✅ ĐÚNG: Tách biệt
// Admin DTO
public class DepartmentDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// Mobile DTO
public class DepartmentMobileDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}
```

### **Quy Tắc Mobile DTO:**

✅ **Tối thiểu hóa fields** - chỉ lấy cần thiết
✅ **Không có audit fields** (IsActive, CreatedAt, UpdatedAt)
✅ **Không có sensitive data**
✅ **Naming: `{EntityName}MobileDto`**

---

## 3️⃣ **BƯỚC 2.3: Tạo Related DTOs (Nếu Có Relationships)**

### **Ví Dụ: Hotel với Images**

**File 1:** `HotelDto.cs` (Main)
```csharp
public class HotelDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    
    // Include related images
    public List<HotelImageDto> Images { get; set; } = new();
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**File 2:** `HotelImageDto.cs` (Related)
```csharp
public class HotelImageDto
{
    public Guid PublicId { get; set; }
    public required string ImageUrl { get; set; }
    public int? DisplayOrder { get; set; }
}
```

**File 3:** `HotelMobileDto.cs` (Mobile - không include images trong list)
```csharp
public class HotelMobileDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? ThumbnailImage { get; set; }  // Chỉ thumbnail
    public int? StarRating { get; set; }
}
```

---

## 📋 **DTO Checklist Template**

Khi tạo DTOs, sử dụng checklist này:

```
□ Entity: {EntityName}

Admin DTO ({EntityName}Dto):
  □ Chỉ expose PublicId (không Id)
  □ Có audit fields: IsActive, CreatedAt, UpdatedAt
  □ Related data: PublicId + Name (không full object)
  □ File location: Features/{Domain}/{FeatureName}/{EntityName}Dto.cs
  □ Namespace: Features.{Domain}.{FeatureName}
  □ Class name: {EntityName}Dto

Mobile DTO ({EntityName}MobileDto):
  □ Tối thiểu hóa fields
  □ KHÔNG có audit fields
  □ KHÔNG có sensitive data
  □ File location: Features/{Domain}/{FeatureName}/{EntityName}MobileDto.cs
  □ Namespace: Features.{Domain}.{FeatureName}
  □ Class name: {EntityName}MobileDto

Related DTO (nếu có):
  □ File: {RelatedEntity}Dto.cs
  □ Chỉ basic info (PublicId, Name, v.v)
```

---

## 🔄 **Mapping Entity → DTO (Trong Handler)**

### **Cách Mapping (Manual Select)**

```csharp
// Trong Handler của feature

// Cách 1: Dùng Select trong LINQ query
var dtos = await _dbContext.Entities
    .Select(e => new EntityDto
    {
        PublicId = e.PublicId,
        Name = e.Name,
        Description = e.Description,
        IsActive = e.IsActive,
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt
    })
    .ToListAsync(cancellationToken);

// Cách 2: Tạo extension method
var dtos = entities.Select(e => e.ToDto()).ToList();

// Cách 3: Mapper library (AutoMapper)
var dtos = _mapper.Map<List<EntityDto>>(entities);
```

### **Extension Method Pattern (Recommended)**

```csharp
// Trong file Entity hoặc separate Mapper file

namespace DXC_Core.API.Features.Common;

public static class DepartmentMapper
{
    public static DepartmentDto ToDto(this Department entity)
    {
        return new DepartmentDto
        {
            PublicId = entity.PublicId,
            Name = entity.Name,
            Code = entity.Code,
            Description = entity.Description,
            IsActive = entity.IsActive,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static DepartmentMobileDto ToMobileDto(this Department entity)
    {
        return new DepartmentMobileDto
        {
            PublicId = entity.PublicId,
            Name = entity.Name,
            Description = entity.Description
        };
    }
}

// Sử dụng:
var dto = entity.ToDto();
var mobileDto = entity.ToMobileDto();
```

---

## ✅ **Checklist Hoàn Thành BƯỚC 2**

```
□ Admin DTO tạo: {EntityName}Dto.cs
  □ Có PublicId (không Id)
  □ Có business fields
  □ Có audit fields: IsActive, CreatedAt, UpdatedAt
  
□ Mobile DTO tạo: {EntityName}MobileDto.cs (nếu cần)
  □ Tối thiểu hóa fields
  □ Không có audit fields
  
□ Related DTOs tạo (nếu có relationships)
  □ Tạo separate files
  □ Naming: {RelatedEntity}Dto.cs
  
□ Mapper methods tạo (optional)
  □ Extension methods: ToDto(), ToMobileDto()
  □ Hoặc dùng AutoMapper
  
□ All DTOs ở đúng folder: Features/{Domain}/{FeatureName}/
```

---

## 🔄 **Bước Tiếp Theo**

✅ Hoàn thành BƯỚC 2 → Chuyển sang **BƯỚC 3: Tạo Features (Vertical Slice - CQRS)**

📄 **Tài liệu:** Xem `step-3.md`
