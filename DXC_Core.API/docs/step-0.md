# 🎯 BƯỚC 0: QUYẾT ĐỊNH KIẾN TRÚC (Phase Planning)

Trước khi bắt đầu code, bạn cần phân tích kỹ yêu cầu của feature để quyết định đúng kiến trúc, DbContext, schema, và routes.

---

## 📋 **Checklist Phân Tích Yêu Cầu**

Hãy trả lời các câu hỏi sau để xác định cấu trúc của feature:

### **1️⃣ Feature này liên quan đến Mini App hay Core Platform?**

- **Mini App** 
  - Sử dụng `ZaloMiniAppDbContext`
  - Database: `DXC_ZaloMiniApp`
  - Ví dụ: Hotels, Restaurants, Products, Hotlines, Banners
  - Routes: `/api/zalo-mini-app/admin/...` hoặc `/api/zalo-mini-app/mobile/...`

- **Core Platform** 
  - Sử dụng `CoreDbContext`
  - Database: `DXC_Core`
  - Ví dụ: Identity, Users, Roles, Profiles, Departments, Organizations
  - Routes: `/api/identity/...`, `/api/profile/...`, `/api/common/...`

- **Independent Business Logic** 
  - Tạo **DbContext mới**
  - Database riêng biệt (ví dụ: `DXC_InternalDocuments`)
  - Ví dụ: Internal Documents Management, HR System, Financial System
  - Routes: `/api/{feature-name}/admin/...`

---

### **2️⃣ Dữ liệu có chia sẻ với entities khác không?**

- **Có chia sẻ** (Ví dụ: Feature cần reference User, Organization, Department)
  → Xem xét dùng **shared schema** trong cùng DbContext với entity được reference
  → Đặt models trong cùng folder: `Data/{DbContext}/Models/{Schema}/`

- **Không chia sẻ** (Ví dụ: Feature độc lập, không cần reference entity khác)
  → Có thể dùng **database riêng** với DbContext riêng
  → Hoặc tạo schema riêng trong cùng database

---

### **3️⃣ Feature có cần mobile API (read-only)?**

- **Có mobile API**
  - Tạo **2 controllers**: `{EntityNames}AdminController.cs` + `{EntityNames}MobileController.cs`
  - Admin: `[Authorize(Roles = "admin")]` - đầy đủ CRUD
  - Mobile: `[AllowAnonymous]` - chỉ read (GET)
  - DTOs riêng: `{EntityName}Dto` (Admin) + `{EntityName}MobileDto` (Mobile)

- **Chỉ Admin API**
  - Tạo **1 controller**: `{EntityNames}AdminController.cs`
  - Chỉ cần Admin DTO: `{EntityName}Dto`

---

### **4️⃣ Feature có yêu cầu upload file không?**

- **Có file upload**
  - Tuân thủ **File Association Workflow** (2-step flow):
    1. Upload file → API `/api/files/upload` trả về `PublicId`
    2. Ghi dữ liệu entity + liên kết file bằng `PublicId`
  - Xem chi tiết tại: [AGENTS.md - Quy trình Upload và Liên kết File](../AGENTS.md)

#### Ví dụ: Upload ảnh cho Icon Group (SERVICES)
- Admin endpoints:
  - Tạo nhóm: `POST /api/zalo-mini-app/admin/services/icon-groups/create` (`ImagePublicId?: Guid`)
  - Cập nhật nhóm: `POST /api/zalo-mini-app/admin/services/icon-groups/update` (`ImagePublicId?: Guid`, gửi `Guid.Empty` để xóa ảnh)
- DTO trả về:
  - `IconGroupDto` có `ImageUrl?: string`, `ImagePublicId?: Guid`.
- Mobile config:
  - `GetIconConfig` trả `ImageUrl`/`ImagePublicId` trong `IconGroupMobileDto` để client hiển thị.
- Lưu ý:
  - `ImageUrl` chuẩn hóa: `"/api/files/{PublicId}"` khi liên kết bằng `ImagePublicId`.
  - Không gửi binary trực tiếp trong create/update; luôn theo flow upload → liên kết.

- **Không file upload**
  - Skip file handling logic

---

## 🗂️ **Decision Matrix: Loại Feature & Kiến Trúc Tương Ứng**

Dùng bảng dưới để xác định nhanh kiến trúc cho feature của bạn:

| # | Feature Type | DbContext | Schema | Database | Routes | Admin | Mobile | Files |
|---|---|---|---|---|---|---|---|---|
| 1 | ZaloMiniApp.Places | ZaloMiniAppDbContext | PLACES | DXC_ZaloMiniApp | `/api/zalo-mini-app/admin/places/` | ✅ | ✅ | ✅ |
| 2 | ZaloMiniApp.Services | ZaloMiniAppDbContext | SERVICES | DXC_ZaloMiniApp | `/api/zalo-mini-app/admin/services/` | ✅ | ✅ | ❌ |
| 3 | ZaloMiniApp.Products | ZaloMiniAppDbContext | PRODUCTS | DXC_ZaloMiniApp | `/api/zalo-mini-app/admin/products/` | ✅ | ✅ | ✅ |
| 4 | Core.Identity | CoreDbContext | IDENTITY | DXC_Core | `/api/identity/` | ✅ | ❌ | ❌ |
| 5 | Core.Profile | CoreDbContext | PROFILE | DXC_Core | `/api/profile/` | ✅ | ❌ | ❌ |
| 6 | Core.Common | CoreDbContext | COMMON | DXC_Core | `/api/common/` | ✅ | ❌ | ❌ |
| 7 | Core.InternalDocs | NEW DbContext | DOCUMENTS | DXC_InternalDocs | `/api/internal-documents/` | ✅ | ❌ | ✅ |

---

## 💡 **Ví Dụ Decision Flow**

### **Ví dụ 1: Thêm "Product Category" cho ZaloMiniApp**

```
Q1: Liên quan Mini App?
→ Trả lời: Có, ZaloMiniApp.Products
→ DbContext: ZaloMiniAppDbContext
→ Schema: PRODUCTS
→ Database: DXC_ZaloMiniApp

Q2: Chia sẻ dữ liệu?
→ Trả lời: Không, độc lập
→ Schema: Tạo mới PRODUCTS schema trong DXC_ZaloMiniApp

Q3: Cần mobile API?
→ Trả lời: Có, hiển thị categories trên mobile
→ Controllers: ProductCategoriesAdminController + ProductCategoriesMobileController
→ DTOs: ProductCategoryDto + ProductCategoryMobileDto

Q4: Cần upload file?
→ Trả lời: Không
→ Skip file handling

✅ Quyết định cuối: 
- DbContext: ZaloMiniAppDbContext
- Schema: PRODUCTS (thêm vào schema hiện có)
- Routes: /api/zalo-mini-app/admin/product-categories/
- Controllers: 2 (Admin + Mobile)
```

### **Ví dụ 2: Thêm "Internal Documents" - Feature độc lập**

```
Q1: Liên quan Mini App?
→ Trả lời: Không, Core Platform độc lập
→ DbContext: Tạo NEW InternalDocumentsDbContext
→ Database: DXC_InternalDocuments (riêng biệt)

Q2: Chia sẻ dữ liệu?
→ Trả lời: Không, hoàn toàn độc lập
→ Schema: DOCUMENTS (riêng trong DB mới)

Q3: Cần mobile API?
→ Trả lời: Không, chỉ admin dùng
→ Controllers: InternalDocumentsAdminController (chỉ 1 controller)
→ DTOs: InternalDocumentDto (chỉ 1 DTO)

Q4: Cần upload file?
→ Trả lời: Có, upload document PDF
→ Tuân thủ File Association Workflow

✅ Quyết định cuối:
- DbContext: NEW InternalDocumentsDbContext
- Schema: DOCUMENTS
- Routes: /api/internal-documents/admin/
- Controllers: 1 (Admin only)
- Cần: Register DbContext + Connection String + Migration mới
```

### **Ví dụ 3: Thêm "Department" - Core Platform feature**

```
Q1: Liên quan Mini App?
→ Trả lời: Không, Core Platform
→ DbContext: CoreDbContext
→ Database: DXC_Core

Q2: Chia sẻ dữ liệu?
→ Trả lời: Có, reference Organization
→ Schema: COMMON (dùng schema hiện có)
→ Models location: Data/CoreContext/Models/Common/

Q3: Cần mobile API?
→ Trả lời: Có, mobile cần xem departments
→ Controllers: DepartmentsAdminController + DepartmentsMobileController
→ DTOs: DepartmentDto + DepartmentMobileDto

Q4: Cần upload file?
→ Trả lời: Không
→ Skip file handling

✅ Quyết định cuối:
- DbContext: CoreDbContext (thêm vào hiện có)
- Schema: COMMON (sử dụng schema hiện có)
- Routes: /api/common/departments/
- Controllers: 2 (Admin + Mobile)
- Cần: Update CoreDbContext + Migration
```

---

## 🎯 **Checklists Quyết Định Cuối Cùng**

Sau khi trả lời 4 câu hỏi trên, điền vào checklist dưới để xác nhận quyết định:

### **Architecture Decision Checklist**

```
[ ] DbContext đã chọn: _________________________________
    □ CoreDbContext (hiện có)
    □ ZaloMiniAppDbContext (hiện có)
    □ NEW {FeatureName}DbContext (mới)

[ ] Database: _________________________________
    □ DXC_Core
    □ DXC_ZaloMiniApp
    □ NEW DXC_{FeatureName}

[ ] Schema: _________________________________
    □ IDENTITY / PROFILE / COMMON / SERVICES / PLACES / PRODUCTS / DOCUMENTS
    □ NEW schema: _______________________

[ ] Cấu trúc Thư Mục Features:
    □ /Features/Identity/
    □ /Features/Common/
    □ /Features/ZaloMiniApp.Places/
    □ /Features/ZaloMiniApp.Services/
    □ /Features/ZaloMiniApp.Products/
    □ /Features/{Domain}.{FeatureName}/

[ ] API Routes:
    □ /api/identity/
    □ /api/profile/
    □ /api/common/
    □ /api/zalo-mini-app/admin/{feature}/
    □ /api/zalo-mini-app/mobile/{feature}/
    □ /api/{feature-name}/admin/

[ ] Controllers cần tạo:
    □ Admin controller: {EntityNames}AdminController.cs
    □ Mobile controller: {EntityNames}MobileController.cs (nếu cần)

[ ] File handling:
    □ Tuân thủ File Association Workflow (2-step)
    □ Không cần file handling

[ ] Ngôn ngữ & Naming:
    □ Entity names: PascalCase (ProductCategory)
    □ DTO names: {EntityName}Dto, {EntityName}MobileDto
    □ Feature names: {Action}{EntityName}.cs
    □ Controller names: {EntityNames}{Type}Controller.cs
    □ Route pattern: /api/{prefix}/{entity-name-kebab-case}/{action}
    □ JSON properties: camelCase (automatic via config)
```

---

## 📝 **Template: Tài Liệu Decision của Feature**

Tạo file `.md` cho mỗi feature để ghi lại quyết định architect:

**File:** `docs/features/{FeatureName}-architecture.md`

```markdown
# {Feature Name} - Architecture Decision

## Overview
- **Feature Name:** {Name}
- **Description:** {Brief description}
- **Priority:** {High/Medium/Low}
- **Target Date:** {Date}

## Architecture Decisions

### Database
- **DbContext:** {DbContext name}
- **Database:** {Database name}
- **Schema:** {Schema name}
- **Location:** {Location in Data/}

### API Layer
- **Admin Controller:** Yes/No
- **Mobile Controller:** Yes/No
- **Routes:** {List of routes}
- **Endpoints:** {List of CRUD endpoints}

### Data Model
- **Entities:** {List of entities}
- **Relationships:** {List of relationships}
- **Audit Fields:** IsActive, CreatedAt, UpdatedAt

### Special Requirements
- **File Upload:** Yes/No
- **Third-party Integration:** Yes/No
- **Performance Optimization:** {Notes}

## Implementation Status
- [ ] BƯỚC 0: Architecture Decision (Done)
- [ ] BƯỚC 1: Database (Pending)
- [ ] BƯỚC 2: DTOs (Pending)
- [ ] BƯỚC 3: Features (Pending)
- [ ] BƯỚC 4: Controllers (Pending)
- [ ] BƯỚC 5: Testing (Pending)

## Notes
- {Ghi chú thêm}
```

---

## 🔄 **Quyết Định vs Thực Hiện**

Sau khi hoàn thành BƯỚC 0 (Architecture Decision):

✅ **Bước tiếp theo:** Chuyển sang **BƯỚC 1** - Thiết Kế & Khởi Tạo Database

📄 **Tài liệu:** Xem `step-1.md` để chi tiết

---

## 💾 **Lưu Decision Document**

Sau khi hoàn thành decision checklist, hãy:

1. **Lưu lại checklist** vào file `docs/features/{FeatureName}-decision.md`
2. **Commit lên Git** với message: `docs: architecture decision for {FeatureName}`
3. **Share với team** trước khi bắt đầu code

Điều này giúp:
- ✅ Team hiểu rõ kiến trúc được lựa chọn
- ✅ Tránh thay đổi kiến trúc giữa quá trình dev
- ✅ Dễ onboard developers mới
- ✅ Có reference cho features tương tự sau này
