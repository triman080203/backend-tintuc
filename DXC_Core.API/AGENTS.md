
# Quy tắc cho AI Lập trình - Dự án DXC_Core (Cập nhật)

Đây là file quy tắc và ngữ cảnh cho dự án DXC_Core. Hãy tuân thủ nghiêm ngặt các quy tắc dưới đây khi tạo mới hoặc sửa đổi code.

---
## 1. Kiến trúc Tổng thể

Dự án được xây dựng theo kiến trúc **"Modular Monolith"** và có khả năng **"Đa khách hàng" (Multi-tenant)**.

* **Nền tảng Lõi (Core Platform):** Cung cấp các chức năng dùng chung.
* **Ứng dụng Nghiệp vụ (Business Applications):** Cung cấp các chức năng đặc thù cho từng dự án.
* **Kiến trúc Vertical Slice:** Code được tổ chức theo **chức năng nghiệp vụ (feature)**.
* **Kiến trúc Đa khách hàng (Multi-tenant):**
    * Sử dụng chiến lược **mỗi khách hàng một database nghiệp vụ riêng**.
    * Có một **`AdminDB`** riêng để quản lý thông tin và chuỗi kết nối của các khách hàng (tenant).
    * Sử dụng **`TenantResolverMiddleware`** để xác định khách hàng dựa trên subdomain của request.

---
## 2. Chiến lược Dữ liệu (Data Strategy)

* **CoreDB:** Một database vật lý chứa tất cả dữ liệu của Nền tảng Lõi. Dữ liệu được tổ chức logic bằng các **schema**.
* **Quy tắc bất biến:** **Mỗi schema trong CoreDB được quản lý bởi một DbContext riêng biệt.** (Ví dụ: `IdentityDbContext` quản lý schema `IDENTITY`).
* **BusinessDB:** Mỗi ứng dụng nghiệp vụ lớn có một database vật lý riêng.
* **Quy tắc PublicId:** Tất cả các bảng (trừ các bảng quan hệ nhiều-nhiều không có dữ liệu phụ) **BẮT BUỘC** phải có:
    * Một cột `Id` (int/bigint) làm khóa chính và để join trong nội bộ database.
    * Một cột `PublicId` (Guid) được đánh index, dùng để định danh đối tượng ở tầng API. Cột này phải được tạo tự động khi tạo mới đối tượng.

---
## 3. Quy chuẩn Phản hồi API (API Contract)

Tất cả các phản hồi từ API **BẮT BUỘC** phải tuân thủ một trong ba cấu trúc response sau để tương thích với Ant Design Pro:

### 3.1. ApiResult<T> - Cho các thao tác đơn lẻ

Dùng cho các API Get một đối tượng, Create, Update, Delete:

```csharp
public class ApiResult<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;
    
    [JsonPropertyName("data")]
    public T? Data { get; set; }
    
    [JsonPropertyName("message")]
    public string? Message { get; set; }
}

// Phiên bản không generic cho các thao tác không trả về data
public class ApiResult
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;
    
    [JsonPropertyName("message")]
    public string? Message { get; set; }
}
```

### 3.2. PagedResult<T> - Cho các API có phân trang

Dùng cho các API Get danh sách có phân trang:

```csharp
public class PagedResult<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;
    
    [JsonPropertyName("data")]
    public IEnumerable<T> Data { get; set; } = Enumerable.Empty<T>();
    
    [JsonPropertyName("total")]
    public long Total { get; set; }
    
    [JsonPropertyName("current")]
    public int Current { get; set; }
    
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }
    
    [JsonPropertyName("message")]
    public string? Message { get; set; }
}
```

### 3.3. EnumResult<TValue> - Cho dữ liệu enum/danh mục

Dùng cho các API trả về dữ liệu enum hoặc danh mục cho selection components:

```csharp
public class EnumResult<TValue> where TValue : Enum
{
    [JsonPropertyName("value")]
    public required TValue Value { get; set; }
    
    [JsonPropertyName("label")]
    public required string Label { get; set; }
}
```

---
## 4. Cấu trúc Thư mục

```plaintext
DXC_Core/
├── .gitignore
├── .trae/
│   └── rules/
│       └── project_rules.md
├── .vscode/
│   ├── launch.json
│   └── tasks.json
├── AGENTS.md
├── DXCCore.sln
├── DXC_Core.API/
│   ├── DXC_Core.API.csproj
│   ├── DXC_Core.API.http
│   ├── DXC_Core.API/                    # Thư mục build output (tự động tạo)
│   ├── Data/
│   │   ├── CoreContext/
│   │   │   ├── CoreDbContext.cs
│   │   │   └── Models/
│   │   │       └── Identity/
│   │   │           ├── Role.cs
│   │   │           ├── User.cs
│   │   │           └── UserRole.cs
│   │   └── README.md
│   ├── Features/
│   │   ├── Identity/
│   │   │   ├── CreateRole.cs
│   │   │   ├── CreateUser.cs
│   │   │   ├── DeleteRole.cs
│   │   │   ├── DeleteUser.cs
│   │   │   ├── GetCurrentUser.cs
│   │   │   ├── GetRoleById.cs
│   │   │   ├── GetRoles.cs
│   │   │   ├── GetUsers.cs
│   │   │   ├── IdentityController.cs
│   │   │   ├── Login.cs
│   │   │   ├── README.md
│   │   │   ├── Register.cs
│   │   │   ├── RoleDto.cs
│   │   │   ├── UpdateRole.cs
│   │   │   ├── UpdateUser.cs
│   │   │   ├── UpdateUserRoles.cs
│   │   │   ├── UserDto.cs
│   │   │   └── UserWithRolesDto.cs
│   │   └── README.md
│   ├── Migrations/
│   │   ├── 20250908165934_InitialCreate.Designer.cs
│   │   ├── 20250908165934_InitialCreate.cs
│   │   ├── 20250909021901_AddRolesAndUserRoles.Designer.cs
│   │   ├── 20250909021901_AddRolesAndUserRoles.cs
│   │   ├── 20250909080123_AddPublicIdToUsers.Designer.cs
│   │   ├── 20250909080123_AddPublicIdToUsers.cs
│   │   ├── 20250909091542_AddNullableCodeToRoles.Designer.cs
│   │   ├── 20250909091542_AddNullableCodeToRoles.cs
│   │   ├── 20250909091707_MakeRoleCodeRequiredAndUnique.Designer.cs
│   │   ├── 20250909091707_MakeRoleCodeRequiredAndUnique.cs
│   │   ├── 20250916014400_AddDescriptionToRoles.Designer.cs
│   │   ├── 20250916014400_AddDescriptionToRoles.cs
│   │   └── CoreDbContextModelSnapshot.cs
│   ├── Program.cs
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── Shared/
│   │   ├── Behaviors/
│   │   │   └── ValidationBehavior.cs
│   │   ├── Contracts/
│   │   │   ├── ApiResult.cs
│   │   │   ├── EnumResult.cs
│   │   │   └── PagedResult.cs
│   │   ├── Middleware/
│   │   │   └── GlobalExceptionHandler.cs
│   │   └── Services/
│   │       ├── IPasswordHasherService.cs
│   │       ├── ITokenService.cs
│   │       ├── PasswordHasherService.cs
│   │       └── TokenService.cs
│   └── appsettings.json
├── GEMINI.md
├── QWEN.md
└── README.md
```

### Mục đích và Quy tắc từng Thư mục

#### Data Layer (`Data/`)
- **Mục đích:** Chứa tất cả các thành phần liên quan đến truy cập dữ liệu
- **Quy tắc:**
  - Mỗi schema có một DbContext riêng (ví dụ: `CoreDbContext` cho schema IDENTITY)
  - Models được tổ chức theo domain/schema trong thư mục con (`Models/Identity/`)
  - Không chứa logic nghiệp vụ, chỉ định nghĩa Entity và cấu hình database
  - Entity classes sử dụng PascalCase và thuộc tính required khi cần thiết

#### Features Layer (`Features/`)
- **Mục đích:** Chứa tất cả logic nghiệp vụ theo kiến trúc Vertical Slice
- **Quy tắc:**
  - Mỗi thư mục con đại diện cho một domain (ví dụ: `Identity`)
  - Mỗi file xử lý một chức năng cụ thể (ví dụ: `CreateRole.cs`, `GetRoles.cs`)
  - Tuân thủ CQRS với MediatR (Command/Query, Validator, Handler)
  - Handler phải trả về đúng format response (ApiResult<T>, PagedResult<T>, EnumResult<T>)
  - Controller phải "mỏng", chỉ điều phối request đến MediatR
  - DTO classes được đặt cùng thư mục với các feature liên quan

#### Shared Layer (`Shared/`)
- **Mục đích:** Chứa các thành phần dùng chung cho toàn bộ ứng dụng
- **Quy tắc:**
  - `Contracts/`: Định nghĩa các response models chung (ApiResult, PagedResult, EnumResult)
  - `Services/`: Các service tiện ích (hashing, token, email, etc.)
  - `Middleware/`: Các middleware xử lý cross-cutting concerns (GlobalExceptionHandler)
  - `Behaviors/`: Các behavior cho MediatR pipeline (ValidationBehavior, logging, etc.)

#### Migrations (`Migrations/`)
- **Mục đích:** Chứa các file migration của Entity Framework Core
- **Quy tắc:**
  - Chỉ chứa các file được tạo tự động bởi EF Core CLI
  - Không được chỉnh sửa thủ công các file migration đã được apply
  - Đặt tên migration rõ ràng, mô tả chính xác thay đổi
  - Luôn chỉ định đúng `--context` khi tạo migration

#### Build Output (`DXC_Core.API/`)
- **Mục đích:** Thư mục build output được tạo tự động bởi .NET
- **Quy tắc:**
  - Không commit vào source control (đã có trong .gitignore)
  - Được tạo tự động khi build hoặc run ứng dụng
  - Chứa các file compiled và dependencies

---
## 5. Quy ước Đặt tên

* **Thư mục Feature:** `[DomainPrefix].[FeatureName]` (ví dụ: `Places.Restaurants`).
* **Lớp và Thuộc tính C#:** **PascalCase** (`UserName`).
* **JSON API:** **camelCase** (`userName`).
* **Role Names:** Sử dụng chữ thường, nếu có nhiều từ thì ngăn cách bằng dấu gạch dưới (ví dụ: `admin`, `hotel_manager`).

---
## 6. Quy ước Thiết kế API & Bảo mật

### 6.1. Quy ước Thiết kế API Endpoint (RPC-style)

* **Đọc Dữ liệu (Read):** Dùng `GET` với `Query Param` hoặc `Path Param`.
* **Ghi Dữ liệu (Tạo/Sửa/Xóa):** Dùng `POST` với `[FromBody]`. Sử dụng hậu tố trong URL. Ví dụ: `POST /api/restaurants/update`.

### 6.2. Quy ước về PublicId trong API

*   **Nguyên tắc:** Để tăng cường bảo mật và tránh bị tấn công bằng cách dò ID tuần tự, tất cả các API endpoint thực hiện thao tác trên một đối tượng cụ thể (Get by Id, Update, Delete) **BẮT BUỘC** phải sử dụng `PublicId` (dạng Guid/UUID) thay vì `Id` số nguyên.
*   **Quy tắc:**
    *   Các `Command` và `Query` cho các thao tác này sẽ nhận vào `PublicId`.
    *   `Handler` sẽ chịu trách nhiệm truy vấn đối tượng trong CSDL bằng `PublicId`.
    *   `Id` số nguyên chỉ nên được sử dụng cho các mối quan hệ (foreign key) bên trong database và không được lộ ra ngoài API cho các thao tác này.

### 6.3. Cấu trúc Endpoint thống nhất cho ZaloMiniApp

Tất cả các endpoints liên quan đến ZaloMiniApp phải tuân thủ cấu trúc đường dẫn thống nhất:

* **Quản trị Admin:** `/api/zalo-mini-app/admin/{feature}/{action}`
* **Ứng dụng Di động:** `/api/zalo-mini-app/mobile/{feature}/{action}`
* **Các tính năng chung:** `/api/zalo-mini-app/{feature}/{action}`

Ví dụ:
* `POST /api/zalo-mini-app/admin/hotels/create`
* `GET /api/zalo-mini-app/mobile/hotels/123`
* `POST /api/zalo-mini-app/hotels/images/upload`

---
## 7. Các Nguyên tắc Thiết kế Chính

* **CQRS với MediatR:**
    * Logic nghiệp vụ nằm trong các lớp `Handler`.
    * **Quy tắc:** Các `Handler` phải chịu trách nhiệm xây dựng và trả về đối tượng response phù hợp (`ApiResult<T>`, `PagedResult<T>`, hoặc `EnumResult<T>`) hoàn chỉnh. Điều này đảm bảo Controller luôn "mỏng" và nhất quán.

* **Controller "mỏng":**
    * Chỉ điều phối request đến MediatR và trả về kết quả `IActionResult` từ `Handler`. Không chứa logic nghiệp vụ, không tự tạo DTO trả về.
    * **Quy tắc bắt buộc cho Swagger:** Để đảm bảo `swagger.json` luôn đầy đủ schema cho DTO, tất cả các action trong controller **BẮT BUỘC** phải được chú thích (decorate) bằng attribute `[ProducesResponseType]`. Attribute này khai báo tường minh kiểu dữ liệu trả về khi thành công (HTTP 200), giúp các công cụ auto-generate code cho frontend hoạt động chính xác.

    **Ví dụ:**
    ```csharp
    // Trong IdentityController.cs
    // ... other using statements
    using DXC_Core.API.Shared.Contracts;
    using Microsoft.AspNetCore.Http;

    // ...

    [HttpGet("roles")]
    [Authorize(Roles = "admin")]
    // BẮT BUỘC: Khai báo kiểu trả về cụ thể cho Swagger
    [ProducesResponseType(typeof(PagedResult<RoleDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoles([FromQuery] GetRoles.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }
    ```

* **Chiến lược Validation Thống nhất:**
    * **Nguyên tắc:** Toàn bộ logic xác thực dữ liệu đầu vào (input validation) phải được đặt tập trung trong các lớp `Validator` của `FluentValidation`.
    * **Quy tắc 1 (Tập trung):** `Validator` là nơi duy nhất chứa logic validation. `Handler` sẽ không chứa các câu lệnh `if` để kiểm tra input.
    * **Quy tắc 2 (Validation với Database):** Đối với các quy tắc cần truy vấn CSDL (ví dụ: kiểm tra username/email có tồn tại không), hãy inject `DbContext` vào `Validator` và sử dụng phương thức `MustAsync`.
    * **Quy tắc 3 (Phân biệt rõ):** Cần phân biệt giữa **Input Validation** (xác thực dữ liệu đầu vào) và **Business Logic** (xử lý nghiệp vụ).
        * **Ví dụ ĐÚNG:** Kiểm tra `password` có khớp trong `Login.Handler` là **Business Logic**.
        * **Ví dụ SAI:** Kiểm tra `UserId` có tồn tại trong `UpdateUserRoles.Handler` là **Input Validation** và phải được chuyển vào `UpdateUserRoles.Validator`.

* **Xử lý lỗi:** Sử dụng `GlobalExceptionHandler` để tự động bắt lỗi (bao gồm cả `ValidationException`) và trả về lỗi theo cấu trúc response phù hợp (`ApiResult`, `PagedResult`, hoặc `EnumResult`).

* **Không JOIN chéo Database:** Kết hợp dữ liệu ở tầng ứng dụng (Application-Side Join).

* **Chiến lược Query Filtering và Searching:**
    * **Nguyên tắc:** Để tương thích tối đa với ProTable và các UI framework hiện đại, các API Query (đặc biệt là các API trả về danh sách có phân trang) **BẮT BUỘC** sử dụng các trường filter cụ thể thay vì trường search chung.
    * **Quy tắc 1 (Trường Filter Cụ thể):** Thay vì sử dụng trường `Search` chung, hãy sử dụng trực tiếp các trường dữ liệu của đối tượng làm filter parameters. Ví dụ: `Name`, `Code`, `Description`, `Status`, v.v.
    * **Quy tắc 2 (Tương thích ProTable):** Cấu trúc này cho phép ProTable tự động tạo các filter controls cho từng column, cung cấp trải nghiệm người dùng tốt hơn.
    * **Quy tắc 3 (Kết hợp Filter):** Các filter có thể được kết hợp với nhau bằng toán tử AND. Mỗi filter sử dụng `Contains()` cho partial matching.
    * **Quy tắc 4 (Xử lý Nullable):** Đối với các trường nullable, cần kiểm tra null trước khi áp dụng filter.
    
    **Ví dụ Query Class:**
    ```csharp
    public class Query : IRequest<PagedResult<RoleDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }        // Thay vì Search
        public string? Code { get; set; }        // Filter cụ thể
        public string? Description { get; set; } // Filter cụ thể
    }
    ```

### 6.4. Quy trình Upload và Liên kết File (File Association Workflow)

*   **Nguyên tắc:** Để đảm bảo tính toàn vẹn dữ liệu và tái sử dụng tối đa, quy trình upload và liên kết file với một đối tượng (entity) phải tuân thủ luồng hai bước (two-step flow).

*   **Luồng thực hiện:**
    1.  **Bước 1: Upload file vật lý.**
        *   Client gọi đến một endpoint upload chung (ví dụ: `POST /api/files/upload`).
        *   Endpoint này chỉ chịu trách nhiệm nhận file, lưu vào thư mục, tạo record trong bảng `Files` và trả về thông tin của file đã lưu, đặc biệt là `PublicId` của file đó.
        *   API response cho bước này phải được thiết kế để tương thích với các thư viện UI phổ biến (như Ant Design), trả về một đối tượng chứa `uid`, `name`, `status`, `url`, và `publicId`.
    2.  **Bước 2: Liên kết file với đối tượng.**
        *   Client nhận `PublicId` của file từ Bước 1 và lưu ở phía client (trong state của form).
        *   Khi người dùng thực hiện hành động chính (ví dụ: nhấn nút "Lưu" để tạo/cập nhật một đối tượng `Hotel`), client sẽ gửi thông tin của đối tượng đó **kèm theo danh sách các `PublicId` của file** đến endpoint nghiệp vụ (ví dụ: `POST /api/hotels/create`).
        *   `Handler` của endpoint nghiệp vụ này sẽ chịu trách nhiệm:
            *   Xác thực sự tồn tại của các `PublicId` của file bằng cách truy vấn đến `FileDbContext`.
            *   Tạo đối tượng chính (ví dụ: `Hotel`).
            *   Tạo các record liên kết (ví dụ: `HotelImage`) bằng cách sử dụng `Id` của đối tượng chính và thông tin (`FilePath`) lấy được từ `FileDbContext`.

*   **Lợi ích:** Luồng làm việc này tách biệt rõ ràng trách nhiệm, giúp API upload chung có thể tái sử dụng cho mọi đối tượng, đồng thời đảm bảo chỉ khi hành động chính thành công thì việc liên kết mới được thực hiện.

*   **Ví dụ triển khai (Tạo Khách sạn với nhiều ảnh):**
    1.  **DTO trả về của API Upload (`UploadFileResponseDto.cs`):**

        ```csharp
        public class UploadFileResponseDto
        {
            public Guid Uid { get; set; } // Dùng cho Ant Design
            public Guid PublicId { get; set; } // ID để gửi lại cho server
            public required string Name { get; set; }
            public string Status { get; set; } = "done";
            public required string Url { get; set; }
        }
        ```

    2.  **Command tạo khách sạn (`CreateHotel.cs`):** Command này sẽ nhận danh sách các `PublicId` của ảnh.

        ```csharp
        public class Command : IRequest<ApiResult<HotelDto>>
        {
            // ... các thuộc tính khác của khách sạn
            public required string Name { get; set; }
            
            // Nhận danh sách PublicId của các file ảnh đã upload
            public List<Guid>? ImagePublicIds { get; set; }
        }
        ```

    3.  **Validator (`CreateHotel.cs`):** Validator phải inject `FileDbContext` để xác thực các `PublicId` này.

        ```csharp
        public Validator(ZaloMiniAppDbContext zaloContext, FileDbContext fileContext) 
        {
            // ... các rule khác

            RuleFor(x => x.ImagePublicIds)
                .MustAsync(async (ids, cancellation) =>
                {
                    if (ids == null || !ids.Any()) return true;
                    var count = await fileContext.Files.CountAsync(f => ids.Contains(f.PublicId), cancellation);
                    return count == ids.Count;
                })
                .WithMessage("Một hoặc nhiều PublicId của ảnh không hợp lệ.");
        }
        ```

    4.  **Handler (`CreateHotel.cs`):** Handler cũng inject `FileDbContext` để lấy `FilePath` và tạo `HotelImage`.

        ```csharp
        public async Task<ApiResult<HotelDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            // 1. Tạo đối tượng Hotel
            var hotel = new Hotel { /* ... */ };
            _zaloContext.Hotels.Add(hotel);

            // 2. Xử lý liên kết ảnh
            if (request.ImagePublicIds != null && request.ImagePublicIds.Any())
            {
                var imageFiles = await _fileContext.Files
                    .Where(f => request.ImagePublicIds.Contains(f.PublicId))
                    .ToListAsync(cancellationToken);

                foreach (var file in imageFiles)
                {
                    var hotelImage = new HotelImage
                    {
                        HotelId = hotel.Id, // EF Core sẽ tự động gán FK
                        ImageUrl = file.FilePath, // Lấy đường dẫn từ file đã xác thực
                        // ... các thuộc tính khác
                    };
                    _zaloContext.HotelImages.Add(hotelImage);
                }
            }

            // 3. Lưu tất cả thay đổi trong 1 transaction
            await _zaloContext.SaveChangesAsync(cancellationToken);

            // 4. Trả về kết quả
            // ...
        }
        ```

---
## 7. Các Nguyên tắc Thiết kế Chính
    ```

---
## 8. Quy trình Thêm một Chức năng Mới (End-to-End)

Đây là các bước chuẩn để thêm một chức năng CRUD cho một thực thể mới, ví dụ: "Quản lý Vai trò (Role)".

### Bước 1: Tạo/Cập nhật Model (Entity)

Định nghĩa lớp C# đại diện cho bảng trong database. Đặt nó vào đúng thư mục `Data/` theo `DbContext` tương ứng.

* **Vị trí:** `DXC_Core.API/Data/CoreContext/Models/Identity/Role.cs`
* **Quy tắc:** Dùng `PascalCase` cho tên lớp và thuộc tính.

```csharp
namespace DXC_Core.API.Data.CoreContext.Models.Identity;

public class Role
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public bool IsActive { get; set; } = true;
}
````

### Bước 2: Cập nhật DbContext

Đăng ký `Entity` mới vào `DbContext` phù hợp. **Tuân thủ nghiêm ngặt quy tắc: mỗi schema một DbContext.**

  * **Vị trí:** `DXC_Core.API/Data/CoreContext/CoreDbContext.cs`
  * **Hành động:**
    1.  Thêm `DbSet<Role> Roles { get; set; }`.
    2.  Cấu hình `Entity` trong `OnModelCreating`, chỉ định rõ `ToTable("Roles", schema: "IDENTITY")`.

<!-- end list -->

```csharp
// Trong CoreDbContext.cs
public DbSet<Role> Roles { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // ... các cấu hình khác
    modelBuilder.Entity<Role>(entity =>
    {
        entity.ToTable("Roles", schema: "IDENTITY");
        entity.HasIndex(r => r.Name).IsUnique();
    });
    // ...
}
```

### Bước 3: Tạo và Áp dụng Migration

Sử dụng EF Core CLI để cập nhật schema database. **Luôn chỉ định đúng `--context`**.

```bash
# 1. Tạo migration
dotnet ef migrations add Add_Roles_Table --project DXC_Core.API/DXC_Core.API.csproj --context CoreDbContext

# 2. Cập nhật vào database
dotnet ef database update --project DXC_Core.API/DXC_Core.API.csproj --context CoreDbContext
```

### Bước 4: Tạo Feature Slice (Vertical Slice)

Tạo file chứa logic nghiệp vụ theo CQRS. Mỗi file xử lý một hành động duy nhất (Create, GetById, Update...).

  * **Vị trí:** `DXC_Core.API/Features/Identity/CreateRole.cs`
  * **Cấu trúc:** Mỗi file chứa `Command`/`Query`, `Validator`, và `Handler`.
  * **Quy tắc:** `Handler` **BẮT BUỘC** trả về response phù hợp (`ApiResult<T>`, `PagedResult<T>`, hoặc `EnumResult<T>`).

<!-- end list -->

```csharp
// File: DXC_Core.API/Features/Identity/CreateRole.cs
using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;

namespace DXC_Core.API.Features.Identity;

public static class CreateRole
{
    public class Command : IRequest<ApiResult<int>>
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(c => c.Name).NotEmpty().MaximumLength(50);
            RuleFor(c => c.Description).MaximumLength(250);
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Command, ApiResult<int>>
    {
        public async Task<ApiResult<int>> Handle(Command request, CancellationToken cancellationToken)
        {
            var role = new Data.CoreContext.Models.Identity.Role
            {
                Name = request.Name,
                Description = request.Description
            };
            
            dbContext.Roles.Add(role);
            await dbContext.SaveChangesAsync(cancellationToken);
            
            return new ApiResult<int> { Success = true, Data = role.Id };
        }
    }
}
```

### Bước 5: Tạo DTO (Data Transfer Object)

Tạo một lớp chỉ chứa các dữ liệu cần thiết để trả về cho client, tránh lộ các thuộc tính của `Entity`.

  * **Vị trí:** `DXC_Core.API/Features/Identity/RoleDto.cs`

<!-- end list -->

```csharp
// File: DXC_Core.API/Features/Identity/RoleDto.cs
namespace DXC_Core.API.Features.Identity;

public class RoleDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
}
```

### Bước 6: Thêm Endpoint trong Controller

Controller phải "mỏng". Chỉ có nhiệm vụ nhận request, gửi đến `MediatR`, và trả về kết quả.

  * **Vị trí:** `DXC_Core.API/Features/Identity/IdentityController.cs`
  * **Quy tắc:**
      * Dùng `POST` cho các hành động Create/Update/Delete.
      * Endpoint phải có hậu tố rõ ràng (`/create`, `/update`, `/delete`).
      * Tên thuộc tính trong JSON request/response phải là `camelCase`.

<!-- end list -->

```csharp
// Trong IdentityController.cs
[ApiController]
[Route("api/identity")]
public class IdentityController : ControllerBase
{
    private readonly ISender _sender;
    // ... constructor

    [HttpPost("roles/create")] // RPC-style endpoint
    public async Task<IActionResult> CreateRole([FromBody] CreateRole.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }
}
```

-----

### Hướng dẫn cuối cùng cho AI:

Hãy tuân thủ nghiêm ngặt các quy tắc trên. Ưu tiên hàng đầu là tính nhất quán với cấu trúc và các quy chuẩn đã được thiết lập của dự án.
