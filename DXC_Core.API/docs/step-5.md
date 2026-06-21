# ✅ BƯỚC 5: TESTING & VERIFICATION

**Mục đích:** Xác thực rằng feature hoạt động đúng theo yêu cầu trước khi merge code

---

## 📋 **Checklist BƯỚC 5**

```
□ BƯỚC 5.1: Build Project
□ BƯỚC 5.2: Run Project
□ BƯỚC 5.3: Test Endpoints on Swagger
□ BƯỚC 5.4: Verify Response Format
□ BƯỚC 5.5: Test Error Handling
□ BƯỚC 5.6: Final Verification
```

---

## 1️⃣ **BƯỚC 5.1: Build Project**

### **Lệnh Build**

```bash
# Terminal tại root project folder

dotnet build
```

### **Expected Output:**

```
Build started...
Build succeeded.
Time Elapsed: 00:00:XX
```

### **Troubleshooting Build Errors:**

❌ **Error: Namespace not found**
```
→ Kiểm tra using statements đúng
→ Kiểm tra file location đúng
```

❌ **Error: Type or namespace name does not exist**
```
→ Entity class chưa register trong DbContext
→ DTO file chưa tạo
```

❌ **Error: The type or namespace name 'ISender' could not be found**
```
→ Thiếu: using MediatR;
```

---

## 2️⃣ **BƯỚC 5.2: Run Project**

### **Lệnh Run**

```bash
dotnet run
```

### **Expected Output:**

```
Building...
Built in X.XXs
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5292
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to exit.
```

### **Troubleshooting Runtime Errors:**

❌ **Error: The connection string 'CoreDbConnection' was not found in configuration.**
```
→ appsettings.json chưa cập nhật connection string
```

❌ **Error: An exception occurred in the database while executing a command.**
```
→ Database connection sai
→ Migration chưa apply
→ Schema không tồn tại
```

---

## 3️⃣ **BƯỚC 5.3: Test Endpoints on Swagger**

### **Mở Swagger UI**

1. Ứng dụng chạy → mở browser
2. Truy cập: `http://localhost:5292/swagger`
3. Swagger UI hiện lên với danh sách endpoints

### **Kiểm Tra Endpoints Hiện Lên**

✅ **Admin Controller Endpoints:**
- POST /api/common/departments/create
- GET /api/common/departments
- POST /api/common/departments/{publicId}/get
- POST /api/common/departments/update
- POST /api/common/departments/{publicId}/delete

✅ **Mobile Controller Endpoints (nếu có):**
- GET /api/zalo-mini-app/mobile/hotels
- GET /api/zalo-mini-app/mobile/hotels/{publicId}

### **Test Create Endpoint**

1. **Click** endpoint: `POST /api/common/departments/create`
2. **Click** "Try it out"
3. **Nhập JSON body:**
```json
{
  "name": "IT Department",
  "code": "IT",
  "description": "Information Technology",
  "organizationPublicId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```
4. **Click** "Execute"
5. **Kiểm tra Response:**
   - Status: 200 OK
   - Response body có `success: true`
   - Data có `publicId`

### **Test Get List Endpoint**

1. **Click** endpoint: `GET /api/common/departments`
2. **Click** "Try it out"
3. **Nhập query params:**
   - Current: 1
   - PageSize: 10
   - Name: (optional, để trống)
4. **Click** "Execute"
5. **Kiểm tra Response:**
   - Status: 200 OK
   - Response có `data` array
   - Response có `total`, `current`, `pageSize`

### **Test Get By ID Endpoint**

1. **Click** endpoint: `POST /api/common/departments/{publicId}/get`
2. **Click** "Try it out"
3. **Nhập parameter:**
   - publicId: (copy từ create response hoặc list response)
4. **Click** "Execute"
5. **Kiểm tra Response:**
   - Status: 200 OK
   - Response có đầy đủ department info

### **Test Update Endpoint**

1. **Click** endpoint: `POST /api/common/departments/update`
2. **Click** "Try it out"
3. **Nhập JSON body:**
```json
{
  "publicId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "IT Department Updated"
}
```
4. **Click** "Execute"
5. **Kiểm tra Response:**
   - Status: 200 OK
   - Data có giá trị `name` mới

### **Test Delete Endpoint**

1. **Click** endpoint: `POST /api/common/departments/{publicId}/delete`
2. **Click** "Try it out"
3. **Nhập parameter:**
   - publicId: (id bất kỳ)
4. **Click** "Execute"
5. **Kiểm tra Response:**
   - Status: 200 OK
   - Response có `success: true`

---

## 4️⃣ **BƯỚC 5.4: Verify Response Format**

### **Response Format Verification**

✅ **Check: Response Structure**

```json
// ApiResult<T> - Single object
{
  "success": true,
  "data": { /* object */ },
  "message": "Tạo thành công"
}

// PagedResult<T> - List with pagination
{
  "success": true,
  "data": [ /* array */ ],
  "total": 25,
  "current": 1,
  "pageSize": 10,
  "message": null
}

// ApiResult - No data
{
  "success": true,
  "message": "Xóa thành công"
}
```

✅ **Check: JSON Property Names (camelCase)**
```json
{
  "publicId": "guid",      // ✅ Đúng (camelCase)
  "name": "value",         // ✅ Đúng (camelCase)
  "isActive": true,        // ✅ Đúng (camelCase)
  "createdAt": "timestamp" // ✅ Đúng (camelCase)
}
```

❌ **NOT:**
```json
{
  "PublicId": "guid",      // ❌ Sai (PascalCase)
  "Id": 123,               // ❌ Sai (internal ID lộ ra)
  "IsActive": true         // ❌ Sai (PascalCase)
}
```

✅ **Check: No Internal IDs Exposed**
- ✅ Only `PublicId` (Guid) exposed
- ✅ No `Id` (internal int) in response
- ✅ No Foreign Key IDs

---

## 5️⃣ **BƯỚC 5.5: Test Error Handling**

### **Test Validation Errors**

1. **Test: Create with empty Name**
   - POST /api/common/departments/create
   - Body: `{ "name": "", "code": "TEST" }`
   - Expected: 400 Bad Request với validation error message

2. **Test: Create with non-existent Organization**
   - POST /api/common/departments/create
   - Body: `{ "name": "Test", "organizationPublicId": "00000000-0000-0000-0000-000000000000" }`
   - Expected: Validation error "Organization not found"

3. **Test: Get non-existent Item**
   - POST /api/common/departments/{bad-guid}/get
   - Expected: 200 OK + `success: false` + message "Not found"

### **Test Authorization**

1. **Test: Admin endpoint without token**
   - Try access POST /api/common/departments/create
   - Expected: 401 Unauthorized

2. **Test: Admin endpoint with non-admin role**
   - Login as user with role "user" (not "admin")
   - Try access POST /api/common/departments/create
   - Expected: 403 Forbidden

3. **Test: Mobile endpoint (no auth needed)**
   - GET /api/zalo-mini-app/mobile/hotels
   - Should work without token
   - Expected: 200 OK

---

## 6️⃣ **BƯỚC 5.6: Final Verification**

### **Database Verification**

1. **Open SQL Server Management Studio**
2. **Navigate to database**
3. **Check table created:**
   - Table name correct
   - Columns exist: Id, PublicId, Name, Code, Description, IsActive, CreatedAt, UpdatedAt
   - Indexes created on PublicId

4. **Check data inserted:**
```sql
-- Example: Check Departments table
SELECT * FROM [DXC_Core].[COMMON].[Departments]
WHERE IsActive = 1
ORDER BY CreatedAt DESC;
```

5. **Verify PublicId uniqueness:**
```sql
SELECT PublicId, COUNT(*) 
FROM [DXC_Core].[COMMON].[Departments]
GROUP BY PublicId
HAVING COUNT(*) > 1;
-- Should return 0 rows
```

### **Swagger Schema Verification**

1. **Open Swagger UI**
2. **Scroll to Models section**
3. **Verify DTOs appear:**
   - DepartmentDto
   - DepartmentMobileDto (if exists)
   - ApiResultOfDepartmentDto
   - PagedResultOfDepartmentDto

4. **Check each DTO has correct properties**

---

## 📋 **Final Verification Checklist**

```
Build & Run:
□ dotnet build - No errors
□ dotnet run - App starts successfully
□ http://localhost:5292/swagger - Swagger loads

Endpoints:
□ All CRUD endpoints show in Swagger
□ Admin endpoints: 5 (Create, List, GetById, Update, Delete)
□ Mobile endpoints: 2 (List, GetById) - if needed
□ Endpoints have [ProducesResponseType] attributes

Response Format:
□ Response follows ApiResult<T> or PagedResult<T>
□ JSON properties are camelCase
□ No internal Id exposed (only PublicId)
□ Audit fields present: IsActive, CreatedAt, UpdatedAt
□ Admin DTO has audit fields
□ Mobile DTO minimal fields only

Functionality:
□ Create: Successfully create new entity
□ Get List: Returns paginated results
□ Get by ID: Returns correct entity
□ Update: Updates entity fields correctly
□ Delete: Soft delete (IsActive = false)
□ Filter/Search: Works on list endpoint

Error Handling:
□ Validation errors return proper message
□ Non-existent entity returns 404-like response
□ Authorization errors work correctly
□ Mobile endpoints work without token

Database:
□ Table created with correct name and schema
□ All columns exist and correct types
□ PublicId has unique index
□ Foreign keys configured correctly
□ Data inserted successfully
□ Soft delete works (IsActive = false)
```

---

## 🚀 **Next Steps After Verification**

### **1. Code Review**
```bash
# Check code quality
# Review with team members
# Get approval
```

### **2. Commit Changes**
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat(departments): add CRUD operations for departments

- Create Departments entity with PublicId
- Add GetDepartments, CreateDepartment, UpdateDepartment, DeleteDepartment features
- Implement DepartmentsAdminController with full CRUD endpoints
- Support filtering and pagination
- Soft delete on delete operation"

# Push to remote
git push origin feature/add-departments
```

### **3. Create Pull Request**
```bash
# Create PR on GitHub
# Reference any related issues
# Wait for CI/CD to pass
# Request reviewers
```

### **4. Merge & Deploy**
```bash
# After approval and CI passes
# Merge to main/develop branch
# Deploy to staging/production
```

---

## 📚 **Reference Documents**

- **guide.md** - Complete implementation guide
- **step-0.md** - Architecture decisions
- **step-1-A.md** - Database setup (shared schema)
- **step-1-B.md** - Database setup (new DbContext)
- **step-2.md** - Create DTOs
- **step-3.md** - Create features (CQRS)
- **step-4-A.md** - Admin controller only
- **step-4-B.md** - Admin + Mobile controllers
- **step-5.md** - Testing & Verification (this file)

---

## ✅ **Completion**

Congratulations! 🎉 Bạn đã hoàn thành tất cả 5 bước để thêm một feature mới vào dự án DXC_Core.

**Tóm tắt what was done:**
1. ✅ BƯỚC 0: Architecture decisions
2. ✅ BƯỚC 1: Database setup (Models, DbContext, Migration)
3. ✅ BƯỚC 2: DTOs (Admin, Mobile)
4. ✅ BƯỚC 3: Features (CQRS - Command/Query/Handler/Validator)
5. ✅ BƯỚC 4: Controllers (Admin, Mobile)
6. ✅ BƯỚC 5: Testing & Verification

**Next time** khi thêm feature mới, tuân thủ quy trình này để đảm bảo tính nhất quán và chất lượng code 💪
