# 🚀 Dự án quản trị hiện đại với Feature Slices & PNPM

**VERSION:** v2.0 (Last updated: Oct 23, 2024) | [Version History](#-version-history)

> ⚡ Khởi tạo nhanh ứng dụng quản trị bằng:
> **Vite + React + TypeScript + Shadcn/ui + Zustand + React Router + TanStack Query + PNPM**

> 📚 **For complete implementation guidelines, see [`/docs/STEPS_INDEX.md`](./docs/STEPS_INDEX.md)** - `/docs` is the source of truth

---

## 📦 1. Mục tiêu

Tạo một ứng dụng quản trị (admin dashboard) hiện đại với:

- Không dùng UmiJS
- Tổ chức code theo **Feature Slices**
- UI chuyên nghiệp với **Shadcn/ui**
- Quản lý state bằng **Zustand**
- Điều hướng bằng **React Router**
- Gọi API bằng **TanStack Query**
- **Recommended: PNPM** làm package manager (hiện tại sử dụng pnpm scripts)
- Dễ mở rộng, dễ bảo trì, dễ chia team
- Style chuẩn với **Tailwind CSS** và **CSS Variables**

### 📊 Trạng thái Triển khai Hiện tại (Implementation Status)

**Project Status:** ✅ **Production Ready** with complete documentation standards (STEP 0-6)

| Feature/Section | Status | Details |
|-----------------|--------|---------|
| **Identity (Login/Welcome)** | ✅ Implemented | Complete auth pages |
| **API Generation (Orval)** | ✅ Implemented | Auto-generates endpoints/models from Swagger |
| **Providers (Auth, QueryClient)** | ✅ Implemented | Fully integrated in App.tsx |
| **Router & Layout** | ✅ Implemented | Complete with navigation, sidebar, breadcrumbs |
| **Dark Mode** | ✅ Implemented | React Context + CSS Variables |
| **Documentation Standards** | ✅ Implemented | STEP 0-6 guides in `/docs` |
| | | |
| **Users (STEP 0-5)** | ✅ Complete CRUD | Advanced filtering, bulk ops, role management |
| **Roles (STEP 0-5)** | ✅ Complete CRUD | Standard pattern template |
| **Departments (STEP 0-5)** | ✅ Complete CRUD | Standard pattern template |
| **Organizations (STEP 0-5)** | ✅ Complete CRUD | Standard pattern template |
| **Hotels (STEP 0-6)** | ✅ CRUD + Images | Full image upload, gallery, lightbox |
| **Restaurants (STEP 0-6)** | ✅ CRUD + Images | Full image upload, gallery, lightbox |

---

## 🔧 2. Công nghệ sử dụng

| Công cụ                      | Mục đích                                                    |
| ---------------------------- | ----------------------------------------------------------- |
| `Vite`                       | Build nhanh, HMR mượt                                       |
| `React 19` + `TypeScript`    | UI & type safety                                            |
| `Shadcn/ui`                  | Component library hiện đại                                  |
| `Tailwind CSS`               | Framework CSS utility-first                                 |
| `react-router-dom@7`         | Điều hướng                                                  |
| `zustand`                    | Quản lý state nhẹ                                           |
| `@tanstack/react-query`      | Gọi API, cache, refetch                                     |
| **Recommended: PNPM**        | Package manager hiệu quả (current: pnpm)                     |
| `ESLint` + `Prettier`        | Format code nhất quán                                       |

---

## 📚 3. Documentation Standards (Quy Chuẩn Tài Liệu)

**⚠️ IMPORTANT:** `/docs` is the **source of truth** for all implementation guidelines.

All features **MUST** comply with 100% of STEP requirements:

| Step | File | Purpose | Status |
|------|------|---------|--------|
| **STEP 0** | [`STEP_0_SETUP.md`](./docs/STEP_0_SETUP.md) | API setup, hooks, folder structure | ✅ Documented |
| **STEP 1** | [`STEP_1_LIST_PAGE.md`](./docs/STEP_1_LIST_PAGE.md) | List page with search & pagination | ✅ Documented |
| **STEP 2** | [`STEP_2_DETAIL_PAGE.md`](./docs/STEP_2_DETAIL_PAGE.md) | Detail/view page | ✅ Documented |
| **STEP 3** | [`STEP_3_CREATE_FORM.md`](./docs/STEP_3_CREATE_FORM.md) | Create form | ✅ Documented |
| **STEP 4** | [`STEP_4_EDIT_FORM.md`](./docs/STEP_4_EDIT_FORM.md) | Edit form (reuses form from STEP_3) | ✅ Documented |
| **STEP 5** | [`STEP_5_DELETE.md`](./docs/STEP_5_DELETE.md) | Delete with confirmation | ✅ Documented |
| **STEP 6** | [`STEP_6_UPLOAD_IMAGE_OPTIONAL.md`](./docs/STEP_6_UPLOAD_IMAGE_OPTIONAL.md) | **Optional** image upload (if feature has images) | ✅ Documented |

**For new features, follow:** [`/docs/STEPS_INDEX.md`](./docs/STEPS_INDEX.md)

---

## 🔗 4. Important References (Tham Chiếu Chính)

### Getting Started
- 📖 **[STEPS_INDEX.md](./docs/STEPS_INDEX.md)** - Complete guide for implementing features (Start here!)
- 📖 **[IMPLEMENT_GUIDE.md](./docs/IMPLEMENT_GUIDE.md)** - Patterns, concepts, and best practices
- 📖 **[AGENTS.md](./AGENTS.md)** - Coding standards and compliance requirements

### Step-by-Step Implementation
- 🔧 **[STEP_0_SETUP.md](./docs/STEP_0_SETUP.md)** - API & feature structure setup
- 📋 **[STEP_1_LIST_PAGE.md](./docs/STEP_1_LIST_PAGE.md)** - List page with pagination
- 👁️ **[STEP_2_DETAIL_PAGE.md](./docs/STEP_2_DETAIL_PAGE.md)** - Detail/view page
- ➕ **[STEP_3_CREATE_FORM.md](./docs/STEP_3_CREATE_FORM.md)** - Create form
- ✏️ **[STEP_4_EDIT_FORM.md](./docs/STEP_4_EDIT_FORM.md)** - Edit form
- 🗑️ **[STEP_5_DELETE.md](./docs/STEP_5_DELETE.md)** - Delete functionality
- 🖼️ **[STEP_6_UPLOAD_IMAGE_OPTIONAL.md](./docs/STEP_6_UPLOAD_IMAGE_OPTIONAL.md)** - Image upload (optional)

### Reference Implementations
- **Users** → `src/features/users/` (Advanced features: filtering, bulk ops, role management)
- **Roles** → `src/features/roles/` (Standard STEP 0-5 pattern)
- **Departments** → `src/features/departments/` (Standard STEP 0-5 pattern)
- **Organizations** → `src/features/organizations/` (Standard STEP 0-5 pattern)
- **Hotels** → `src/features/hotels/` (Complete STEP 0-6 with image upload)
- **Restaurants** → `src/features/restaurants/` (Complete STEP 0-6 with image upload)

---

## 🚀 5. Quick Start

### ⚡ Cấu hình API (Không cần VITE_API_BASE_URL)

Project này sử dụng **Vite Proxy** thay vì `VITE_API_BASE_URL`. Tất cả API calls sẽ tự động được forward đến backend thông qua proxy configuration trong `vite.config.ts`.

**Cách hoạt động:**
- Frontend chạy trên port 5173
- Backend chạy trên port 5292 (hoặc port được config trong ASP.NET)
- Vite Proxy tự động forward các request `/api/*` và `/uploads/*` đến backend
- Không cần set `VITE_API_BASE_URL` trong `.env` file

**Lợi ích:**
- ✅ Không cần config URL cho từng môi trường
- ✅ Tránh CORS issues trong development
- ✅ Đơn giản hóa deployment process

```bash
DXC_Frontend/ (Current Structure)
├── src/
│   ├── api/
│   │   ├── endpoints/          # Generated by Orval (e.g., identity.ts, users.ts)
│   │   ├── models/             # DTOs (e.g., apiResult.ts, userDto.ts)
│   │   └── request.ts          # Axios config & customRequest
│   ├── app/
│   │   ├── layout/
│   │   │   └── MainLayout.tsx  # App shell with Header + Sidebar
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── QueryClientProviderWrapper.tsx
│   │   └── router/
│   │       ├── AppRoutes.tsx   # Route definitions
│   │       └── navigationConfig.ts  # Menu configuration
│   ├── features/
│   │   ├── identity/           # Login feature
│   │   ├── users/              # User management (STEP 0-5)
│   │   ├── roles/              # Role management (STEP 0-5)
│   │   ├── departments/        # Department management (STEP 0-5)
│   │   ├── organizations/      # Organization management (STEP 0-5)
│   │   ├── hotels/             # Hotel management (STEP 0-6 with images)
│   │   ├── restaurants/        # Restaurant management (STEP 0-6 with images)
│   │   ├── feedback/           # Feedback management (role-based)
│   │   └── dashboard/          # Dashboard page
│   ├── shared/
│   │   ├── components/
│   │   │   ├── AppHeader.tsx   # Sticky header with user menu
│   │   │   ├── Sidebar.tsx     # Collapsible hierarchical menu
│   │   │   └── ... (other shared components)
│   │   └── hooks/
│   │       ├── useAuth.ts      # Authentication state
│   │       ├── useNavigation.ts  # Menu navigation logic
│   │       └── ... (other hooks)
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json                 # Dependencies: React 19, TanStack Query, etc.
├── vite.config.ts               # Alias @, Tailwind plugin
├── tsconfig.json                # Path mapping
├── orval.config.ts              # API generation
└── README.md

---

## 🎨 6. Header & Sidebar Layout

### AppHeader Component

**Location:** `src/shared/components/AppHeader.tsx`

Fixed sticky header (top-0 z-40) displaying:

**Left Side:**
- Logo image (Tây Ninh)
- App title: "Hệ thống quản trị Mini App"

**Right Side:**
- User dropdown menu
  - Trigger: User's full name or username
  - Email label
  - Logout button (destructive style with LogOut icon)
  - Toast confirmation on logout
  - Redirects to `/login`

**Features:**
- ✅ Blue-600 background
- ✅ White text for contrast
- ✅ DropdownMenu from Shadcn/ui
- ✅ Handles null user state gracefully
- ✅ Responsive design

---

### Sidebar Component

**Location:** `src/shared/components/Sidebar.tsx`

Collapsible hierarchical navigation menu (w-64, sticky top-0):

**Features:**
- ✅ **Hierarchical:** Parent menus with expandable children
- ✅ **Collapsible:** Click parent to expand/collapse children with chevron animation
- ✅ **Role-based:** Shows/hides menus based on user roles
- ✅ **Auto-expand:** Parent expands when navigating to child route
- ✅ **Active highlighting:** Shows current active menu/submenu
- ✅ **Icons:** Lucide-react icons for each menu
- ✅ **Badges:** Optional badges for item counts/notifications
- ✅ **Smooth animations:** 200ms transitions on expand/collapse

**Visual States:**
- **Active leaf:** `bg-primary text-primary-foreground shadow-sm`
- **Active parent:** `bg-primary/10 text-primary`
- **Hover:** `bg-accent hover:text-accent-foreground`
- **Expandable:** Chevron icon rotates 180° when expanded

**Menu Structure:**
```
1. Quản lý hệ thống (System Management)
   ├── Người dùng (Users)
   └── Vai trò (Roles)

2. Quản lý tổ chức (Organization Management)
   ├── Tổ chức (Organizations)
   └── Phòng ban (Departments)

3. Quản lý địa điểm (Location Management)
   ├── Khách sạn (Hotels)
   └── Nhà hàng (Restaurants)

4. Quản lý phản ánh (Feedback Management) [Role-based]
   ├── Điều phối phản ánh (Feedback Coordination)
   ├── Xử lý phản ánh (Feedback Processing)
   ├── Phê duyệt phản ánh (Feedback Approval)
   ├── Phản ánh công khai (Public Feedback)
   └── Phản ánh từ chối (Rejected Feedback)
```

---

### useNavigation Hook

**Location:** `src/shared/hooks/useNavigation.ts`

Smart navigation hook providing:
- ✅ Role-based menu filtering (admin + custom roles)
- ✅ Active route detection with intelligent path matching
- ✅ Parent menu auto-expansion when navigating to child
- ✅ UUID and ID detection for detail/edit routes
- ✅ Feature route recognition (processing, approval, etc.)
- ✅ Parent menu highlighting when any child is active
- ✅ Expandable state management

**Behavior:**
- When navigating to `/hotels/uuid-123`, Hotels parent menu auto-expands
- Active states update based on current route
- Parent menu shows as active if any child route is active
- Role-based filtering hides menus user can't access

---

### MainLayout Component

**Location:** `src/app/layout/MainLayout.tsx`

App shell wrapping entire application:

```tsx
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed header with logo and user menu */}
      <AppHeader user={user} onLogout={logout} />

      <div className="flex">
        {/* Collapsible sidebar - only shown when logged in */}
        {user && <Sidebar />}

        {/* Main content area with padding */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────┐
│              AppHeader (sticky top-0)                    │
│  [Logo] [Title] ..................... [User Dropdown]    │
├────────────────────┬───────────────────────────────────┤
│                    │                                     │
│   Sidebar          │       Main Content                 │
│   (w-64)           │       (flex-1 p-6)                 │
│                    │                                     │
│ - Collapsible      │   Feature Pages:                   │
│ - Hierarchical     │   - List/Create/Detail/Edit        │
│ - Role-based       │   - Dashboards                     │
│ - Auto-expand      │   - Forms with validation          │
│                    │                                     │
│ Sticky top-0       │                                     │
└────────────────────┴───────────────────────────────────┘
```

---

## 📋 7. Feature Slices Pattern

Each feature follows the same **Feature Slices** structure:

```
src/features/[feature-name]/
├── pages/              # Page components (List, Detail, Create, Edit)
├── components/         # UI components (Table, Form, Profile)
├── hooks/             # Custom hooks (useFeature, useCreate, useUpdate, etc.)
├── types/             # TypeScript types (local to feature)
├── utils/             # Utilities (e.g., image URL builder)
└── index.ts           # Barrel export
```

**See reference implementations:**
- ✅ **Users** - Full advanced features (filtering, bulk ops, role management)
- ✅ **Roles** - Standard STEP 0-5 pattern
- ✅ **Departments** - Standard STEP 0-5 pattern
- ✅ **Organizations** - Standard STEP 0-5 pattern
- ✅ **Hotels** - STEP 0-6 with complete image upload
- ✅ **Restaurants** - STEP 0-6 with complete image upload

**For implementing new features, follow [`/docs/STEPS_INDEX.md`](./docs/STEPS_INDEX.md)**

---

## 8. Router & Routes

### Route Protection

Application uses protected and public routes with authentication:

**PublicRoute:** Accessible without authentication
- Redirects to `/dashboard` if already logged in
- Example: `/login`

**ProtectedRoute:** Requires authentication
- Redirects to `/login` if not authenticated
- All other routes wrapped with this component

```tsx
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

### Current Routes

#### Authentication
| Route | Method | Description |
|-------|--------|-------------|
| `/login` | GET | User login page (PublicRoute) |

#### Dashboard
| Route | Method | Description |
|-------|--------|-------------|
| `/dashboard` | GET | Dashboard page (ProtectedRoute) |

#### Quản lý hệ thống (System Management)
| Route | Method | Description |
|-------|--------|-------------|
| `/users` | GET | User list page |
| `/users/create` | GET | Create user form |
| `/users/:id` | GET | User detail page |
| `/users/:id/edit` | GET | Edit user form |
| `/roles` | GET | Role list page |
| `/roles/create` | GET | Create role form |
| `/roles/:id` | GET | Role detail page |
| `/roles/:id/edit` | GET | Edit role form |

#### Quản lý tổ chức (Organization Management)
| Route | Method | Description |
|-------|--------|-------------|
| `/organizations` | GET | Organization list page |
| `/organizations/create` | GET | Create organization form |
| `/organizations/:id` | GET | Organization detail page |
| `/organizations/:id/edit` | GET | Edit organization form |
| `/departments` | GET | Department list page |
| `/departments/create` | GET | Create department form |
| `/departments/:id` | GET | Department detail page |
| `/departments/:id/edit` | GET | Edit department form |
| `/departments/:id/users` | GET | Department users page |

#### Quản lý địa điểm (Location Management)
| Route | Method | Description |
|-------|--------|-------------|
| `/hotels` | GET | Hotel list page (STEP 0-6) |
| `/hotels/create` | GET | Create hotel with image upload (STEP 3) |
| `/hotels/:id` | GET | Hotel detail with image gallery (STEP 2-6) |
| `/hotels/:id/edit` | GET | Edit hotel with image upload (STEP 4-6) |
| `/restaurants` | GET | Restaurant list page (STEP 0-6) |
| `/restaurants/create` | GET | Create restaurant with image upload (STEP 3) |
| `/restaurants/:id` | GET | Restaurant detail with image gallery (STEP 2-6) |
| `/restaurants/:id/edit` | GET | Edit restaurant with image upload (STEP 4-6) |

#### Quản lý phản ánh (Feedback Management - Role-based)
| Route | Method | Description |
|-------|--------|-------------|
| `/feedback` | GET | Feedback coordination (Điều phối phản ánh) |
| `/feedback/processing` | GET | Feedback processing (Xử lý phản ánh) |
| `/feedback/approval` | GET | Feedback approval (Phê duyệt phản ánh) |
| `/feedback/public` | GET | Public feedback (Phản ánh công khai) |
| `/feedback/rejected` | GET | Rejected feedback (Phản ánh từ chối) |
| `/feedback/create` | GET | Create feedback form |
| `/feedback/:id` | GET | Feedback detail page |
| `/feedback/:id/edit` | GET | Edit feedback form |

### Navigation Configuration

**File:** `src/app/router/navigationConfig.ts`

Routes are organized into hierarchical menu groups with role-based access control:

```typescript
// Role-based access (dynamic)
- 'admin': Full access
- Generated role codes from menu names
  - 'Điều phối phản ánh' → 'dieu_phoi_phan_anh'
  - 'Xử lý phản ánh' → 'xu_ly_phan_anh'
  - 'Phê duyệt phản ánh' → 'phe_duyet_phan_anh'
```

---

## 9. API Response Contract (Hợp đồng Phản hồi API)

Tất cả các endpoint API trong backend DXC_Core đều tuân theo các định dạng phản hồi tiêu chuẩn.

**Note:** For detailed API contracts and integration patterns, see [`/docs/STEP_0_SETUP.md`](./docs/STEP_0_SETUP.md)

### 9.1. ApiResult<T> - Thao tác với mục đơn lẻ

Được sử dụng cho các thao tác trả về một mục (GET theo ID, TẠO, CẬP NHẬT) hoặc các thao tác không trả về dữ liệu (XÓA, CẬP NHẬT).

```typescript
// Interface TypeScript
interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Ví dụ phản hồi cho việc tạo người dùng thành công
{
  "success": true,
  "data": 123,
  "message": "Tạo người dùng thành công"
}

// Ví dụ phản hồi cho việc cập nhật người dùng thành công
{
  "success": true,
  "message": "Cập nhật người dùng thành công"
}

// Ví dụ phản hồi cho thao tác thất bại
{
  "success": false,
  "message": "Tên người dùng đã tồn tại"
}
```

### 9.2. PagedResult<T> - Thao tác Danh sách có Phân trang

Được sử dụng cho các thao tác danh sách với hỗ trợ phân trang.

```typescript
// Interface TypeScript
interface PagedResult<T> {
  success: boolean;
  data: T[];
  total: number;
  current: number;
  pageSize: number;
  message?: string;
}

// Ví dụ phản hồi cho danh sách người dùng
{
  "success": true,
  "data": [
    {
      "id": 1,
      "publicId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "fullName": "Nguyễn Văn A",
      "userName": "nguyenvana",
      "email": "nguyenvana@example.com",
      "isActive": true,
      "createdAt": "2023-01-15T09:30:00Z"
    },
    {
      "id": 2,
      "publicId": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
      "fullName": "Trần Thị B",
      "userName": "tranthib",
      "email": "tranthib@example.com",
      "isActive": true,
      "createdAt": "2023-01-16T14:45:00Z"
    }
  ],
  "total": 42,
  "current": 1,
  "pageSize": 10,
  "message": null
}
```

### 9.3. EnumResult<T> - Dữ liệu Enum/Danh sách

Được sử dụng để trả về các giá trị enum hoặc dữ liệu danh sách cho các thành phần lựa chọn.

```typescript
// Interface TypeScript
interface EnumResult<T> {
  value: T
  label: string
}

// Ví dụ phản hồi cho danh sách vai trò
;[
  {
    value: 'admin',
    label: 'Quản trị viên',
  },
  {
    value: 'user',
    label: 'Người dùng Thường',
  },
  {
    value: 'manager',
    label: 'Quản lý',
  },
]
```

---

## 10. Các Khuyến nghị Chính

### 10.1. Tích hợp API

1. Sử dụng `Orval` để tự động tạo API clients và models từ Swagger/OpenAPI specification
2. Sử dụng `TanStack Query` cho tất cả các thao tác lấy dữ liệu để tận dụng bộ nhớ đệm và tự động làm mới
3. Tạo các file dịch vụ API chuyên dụng cho từng tính năng dựa trên các API clients được generate
4. Triển khai xử lý lỗi phù hợp có thể hiển thị thông báo từ trường `message` trong phản hồi API
5. Sử dụng `publicId` (GUID) cho tất cả các thao tác nhắm mục tiêu các thực thể cụ thể thay vì `id` nội bộ

### 10.2. Quản lý Trạng thái

1. Sử dụng `Zustand` để quản lý trạng thái toàn cục (xác thực, tùy chọn người dùng)
2. Tận dụng bộ nhớ đệm tích hợp của `TanStack Query` cho trạng thái máy chủ
3. Giữ trạng thái cục bộ của component ở mức tối thiểu và chỉ dành cho các tương tác UI

### 10.3. Thiết kế Component

1. Tuân theo các mẫu của Shadcn/ui cho biểu mẫu và bảng
2. Tạo các component có thể tái sử dụng trong thư mục `shared/components`
3. Sử dụng `Table` component của Shadcn/ui cho các chế độ xem danh sách
4. Sử dụng `Form` component của Shadcn/ui cho các biểu mẫu nhập dữ liệu

### 10.4. Định tuyến

1. Triển khai kiểm soát truy cập dựa trên vai trò bằng cách sử dụng `ProtectedRoute` wrapper
2. Cấu trúc các tuyến đường để phù hợp với tổ chức endpoint backend
3. Sử dụng tải lười để chia tách mã

---

## 🎨 6. Cấu hình toàn cục

### `main.tsx`

```ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProviderWrapper } from './app/providers/QueryClientProviderWrapper';
import { MainLayout } from './app/layout/MainLayout';
import { AppRoutes } from './app/router/AppRoutes';
import './assets/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProviderWrapper>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </QueryClientProviderWrapper>
  </BrowserRouter>
);
```

---

## 🔌 7. Providers

### `app/providers/QueryClientProviderWrapper.tsx`

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 5 * 60,
    },
  },
})

export const QueryClientProviderWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
```

---

## 🧭 8. Router

### `app/router/routes.ts`

```ts
// Routes sẽ được cập nhật khi các features được triển khai
export const appRoutes = [
  // Identity Routes
  { path: '/login', name: 'Đăng nhập', component: 'LoginPage', isProtected: false },

  // Users Routes (Standard CRUD Pattern)
  { path: '/users', name: 'Quản lý người dùng', component: 'UserListPage', isProtected: true },
  { path: '/users/create', name: 'Thêm người dùng', component: 'UserCreatePage', isProtected: true },
  { path: '/users/:id', name: 'Chi tiết người dùng', component: 'UserDetailPage', isProtected: true },
  { path: '/users/:id/edit', name: 'Chỉnh sửa người dùng', component: 'UserEditPage', isProtected: true },

  // Dashboard
  { path: '/dashboard', name: 'Trang chủ', component: 'DashboardPage', isProtected: true },

  // Ví dụ routes khác:
  // { path: '/files', name: 'Files', element: <FileListPage /> },
] as const
```

### `app/router/AppRoutes.tsx`

```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/identity/pages/LoginPage'
import { UserListPage, UserCreatePage, UserDetailPage, UserEditPage } from '@/features/users'
import { DashboardPage } from '@/features/dashboard'

// Routes sẽ được cập nhật khi các features được triển khai
export const AppRoutes = () => (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Users Routes - Standard CRUD Pattern */}
      <Route path="/users" element={<UserListPage />} />
      <Route path="/users/create" element={<UserCreatePage />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      <Route path="/users/:id/edit" element={<UserEditPage />} />

      {/* Ví dụ routes khác: */}
      {/* <Route path="/files" element={<FileListPage />} /> */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
)
```

---

## 🎪 9. Layout

### `app/layout/MainLayout.tsx`

```tsx
import { appRoutes } from '../router/routes'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              alt="Logo"
              className="h-8 w-8"
            />
            <h1 className="text-xl font-bold">DXC Admin</h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/10">
          <nav className="p-4">
            <ul className="space-y-2">
              {appRoutes
                .filter(route => route.isProtected) // Only show protected routes in sidebar
                .map((route) => (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        location.pathname === route.path && "bg-accent text-accent-foreground"
                      )}
                    >
                      {route.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## 🎨 10. Quy Tắc Style Component (Style Rules)

> ✅ **Mục tiêu**: Đảm bảo giao diện nhất quán, dễ bảo trì, tương thích với Shadcn/ui và Tailwind CSS
> 🔒 **Không được phép override CSS thô bằng `!important`**

### ✅ Nguyên tắc chung

1. **Luôn dùng `Tailwind CSS` làm phương pháp chính để style**
2. **Sử dụng CSS Variables cho theme customization**
3. **Tận dụng các component có sẵn của Shadcn/ui**
4. **Không sử dụng `!important` để override style**
5. **Tuân thủ design system của Shadcn/ui**

---

### 📏 Cách chọn phương pháp style phù hợp

| Mục đích                                   | Phương pháp                            |
| ------------------------------------------ | -------------------------------------- |
| Thay đổi màu sắc, radius, padding toàn cục | ✅ `CSS Variables` + `Tailwind config` |
| Thiết lập font chữ, kích thước cơ bản      | ✅ `Tailwind config`                   |
| Tùy chỉnh riêng cho từng component         | ✅ `cn()` utility + `Tailwind classes` |
| Style đặc biệt cho một trang/component     | ✅ `CSS Modules` + `:global()` nếu cần |
| Override sâu (rất hiếm)                    | ⚠️ `CSS Modules` với class cụ thể      |

---

### 🧩 Cấu trúc Theme đề xuất (`src/theme/`)

#### `src/lib/theme.ts`

```ts
export const theme = {
  colors: {
    primary: '#722ED1',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    border: '#e2e8f0',
    accent: '#f8fafc',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const
```

#### `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}

export default config
```

#### `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 262.1 83.3% 57.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

### 🛠️ Áp dụng Theme toàn cục

```tsx
// App.tsx
import { ThemeProvider } from 'next-themes'

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  <YourApp />
</ThemeProvider>
```

> 🔥 Sử dụng `ThemeProvider` của `next-themes` để hỗ trợ dark mode

---

### ❌ Những điều CẤM KỴ

| Hành động                        | Lý do                   | Cách sửa                           |
| -------------------------------- | ----------------------- | ---------------------------------- |
| `!important` trong CSS           | Gây xung đột            | Dùng specificity hoặc Tailwind     |
| Viết style toàn cục không cần thiết | Ảnh hưởng toàn ứng dụng | Dùng component-scoped styling      |
| Dùng CSS frameworks khác         | Không tương thích        | Sử dụng Tailwind CSS               |
| Override Shadcn/ui components    | Phá vỡ design system    | Tùy chỉnh qua CSS variables        |

---

### 🌓 Dark Mode (React/Vite Implementation)

Dark mode sử dụng CSS variables với Tailwind's dark: prefix và React Context cho toggle. Không phụ thuộc Next.js.

#### 1. CSS Setup (globals.css - đã có)
Sử dụng :root và .dark cho variables (như trong phần 10).

#### 2. Theme Context (shared/hooks/useTheme.ts)
```tsx
// shared/hooks/useTheme.ts
import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme}> {children} </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

#### 3. Integrate in App.tsx
```tsx
// App.tsx
import { ThemeProvider } from './shared/hooks/useTheme';
// ...
<ThemeProvider>
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProviderWrapper>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
        <Toaster />
      </QueryClientProviderWrapper>
    </AuthProvider>
  </BrowserRouter>
</ThemeProvider>
```

#### 4. Theme Toggle Button (e.g., in Header)
```tsx
// components/ThemeToggle.tsx
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

#### 5. Persist Theme (Optional)
Sử dụng localStorage trong useTheme để lưu theme.

---

### ✅ Checklist Style trước khi commit

- [ ] Đã dùng `Tailwind CSS` classes
- [ ] Không có `!important`
- [ ] Không dùng CSS frameworks khác
- [ ] Có `ThemeProvider` cho dark mode (React Context)
- [ ] Shadcn/ui components được dùng đúng cách
- [ ] CSS variables được tổ chức rõ ràng
- [ ] Dark mode được xử lý nếu cần (Tailwind dark: prefix)

---

## 11. Quy trình phát triển

Tuân thủ tuyệt đối quy trình sau:

### 11.1. Quy trình phát triển (API-First)

Quy trình chuẩn của dự án tuân thủ theo mô hình **API-First**, lấy Swagger/OpenAPI làm hợp đồng và là nguồn sự thật duy nhất.

1.  **Backend:**
    - Phân tích yêu cầu, thiết kế và xây dựng API.
    - Cung cấp API cho Frontend thông qua một file `swagger.json`.
    - API được **tag** theo từng feature (ví dụ: `Users`, `Products`).
    - Mọi phản hồi API tuân thủ theo "Hợp đồng Phản hồi" đã định nghĩa (xem mục 4).

2.  **Frontend:**
    - Sử dụng **Orval** để tự động sinh API client và schema từ `swagger.json`. Cấu hình Orval (`orval.config.ts`) được thiết lập để tách các file API theo `tag` của backend.
    - **Tuyệt đối không** chỉnh sửa các file được sinh ra tự động trong `src/api/endpoints` và `src/api/models`.
    - Dựa trên các `tag` API, tạo cấu trúc thư mục "Feature Slices" tương ứng trong `src/features`. Ví dụ, tag `Users` sẽ tương ứng với thư mục `src/features/users`.
    - Mỗi feature sẽ có các thư mục con như `components`, `pages`, `store`.
    - Triển khai UI và logic cho các chức năng quản lý đối tượng theo các quy tắc tối thiểu sau:
      - **Chức năng:** Thêm, Xóa, Sửa đối tượng.
      - **Danh sách:** Sử dụng `Table` component của Shadcn/ui để hiển thị danh sách có phân trang và bộ lọc.
      - **Xem chi tiết:** Sử dụng `Sheet` hoặc `Dialog` chứa component `Card` với thông tin chi tiết.
      - **Upload:** Nếu có chức năng upload file/ảnh, sử dụng API `files` dùng chung. API upload sẽ trả về danh sách thông tin file đã upload thành công để điền vào form Thêm/Sửa đối tượng.

### 11.2. Quản lý State trong Feature

- **Quy định:** Thư mục `features/<feature-name>/store` (sử dụng **Zustand**) **chỉ** dùng để quản lý các state liên quan đến UI của riêng feature đó (ví dụ: trạng thái đóng/mở của modal, dữ liệu form nhiều bước,...).
- **Yêu cầu:** Toàn bộ dữ liệu từ server (danh sách, chi tiết đối tượng,...) **phải** được quản lý bởi **TanStack Query** để tận dụng caching, auto-refetch, và các tính năng mạnh mẽ khác. **Không** dùng Zustand để lưu trữ server state.

### 11.3. Tập trung Toàn bộ Logic API vào `src/api/request.ts`

Đây là yêu cầu quan trọng nhất để giữ cho code sạch sẽ và dễ bảo trì.

- **Bối cảnh:** Cấu hình Orval của dự án đã được thiết lập để sử dụng một `mutator` tùy chỉnh là hàm `customRequest` trong file `src/api/request.ts`. Điều này có nghĩa là mọi API call đều đi qua hàm này.
- **Yêu cầu triển khai:**
  1.  **Tạo Axios Instance:** Trong `src/api/request.ts`, tạo một `axios instance` duy nhất và cấu hình các thông số chung như `baseURL`.
  2.  **Thêm Interceptor cho Authentication:** Sử dụng `axios.interceptors.request` trên instance đó để tự động đính kèm token xác thực vào mỗi request.
  3.  **Chuẩn hóa Phản hồi và Lỗi trong `customRequest`:** Hàm `customRequest` phải là nơi xử lý "hợp đồng API" trước khi dữ liệu được trả về cho TanStack Query.
      - Nếu phản hồi có `success: true`, trả về `response.data`.
      - Nếu phản hồi có `success: false`, `throw` một `Error` với nội dung là `response.data.message`.
- **Lợi ích:**
  - TanStack Query sẽ tự động bắt được `Error` và chuyển trạng thái của query/mutation thành `error`.
  - Các component không cần phải tự kiểm tra `res.success` nữa.
  - Toàn bộ logic xác thực và xử lý lỗi API cơ bản được tập trung tại **một nơi duy nhất**.

---

## 12. Kiến trúc và Thực hành Mới Nhất (Cập nhật tháng 6/2024)

### 12.1. Sử dụng TanStack Query như Trung tâm Quản lý State từ Server

Thay vì tạo các service layer trung gian không xử lý logic đặc biệt, chúng ta sẽ:

1. **Gọi trực tiếp API từ component thông qua TanStack Query**
2. **Sử dụng `useQuery` để fetch data**
3. **Sử dụng `useMutation` để tạo/cập nhật/xóa data**
4. **Tận dụng caching và state management của TanStack Query**

```typescript
// Kiến trúc mới:
[Component] 
     ↓ (sử dụng)
[TanStack Query Hooks] 
     ↓ (gọi)
[API Layer (src/api)] 
     ↓ (gọi HTTP)
[Backend API]

// Thay vì kiến trúc cũ:
[Component] 
     ↓ (sử dụng)
[Service Layer] 
     ↓ (gọi)
[API Layer (src/api)] 
     ↓ (gọi HTTP)
[Backend API]
```

### 12.2. Chỉ tạo Service Layer khi cần xử lý logic đặc biệt

Chỉ tạo service layer (`src/features/*/services/*`) khi cần:
- Transform data trước/sau khi gọi API
- Xử lý logic nghiệp vụ phức tạp
- Kết hợp nhiều API calls
- Xử lý lỗi đặc biệt

### 12.3. Tránh useEffect không cần thiết với Table component

Khi sử dụng Table component của Shadcn/ui:
- **Sử dụng TanStack Query để quản lý data fetching**
- **Để Table component render data từ TanStack Query**
- **Giảm network load và rerender không cần thiết**

```typescript
// Đúng - Sử dụng TanStack Query:
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: () => getUsers().getApiUsers()
})

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users?.data?.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.fullName}</TableCell>
        <TableCell>{user.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Sai - Dùng useEffect không cần thiết:
useEffect(() => {
  fetchUsers() // Không cần thiết khi dùng TanStack Query
}, [])
```

### 12.4. Sử dụng useMutation cho các thao tác tạo/sửa/xóa

```typescript
const createMutation = useMutation({
  mutationFn: (data) => postApiUsersCreate(data),
  onSuccess: (result) => {
    if (result.success) {
      toast({
        title: "Thành công",
        description: "Tạo người dùng thành công",
      })
      // Tự động invalidate cache để refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  },
  onError: (error) => {
    toast({
      title: "Lỗi",
      description: error.message,
      variant: "destructive",
    })
  }
})
```

### 12.5. Loại bỏ store không cần thiết

Khi TanStack Query đã xử lý state management:
- **Không cần tạo store để quản lý data từ server**
- **Chỉ giữ lại store cho UI state cục bộ**
- **Giảm độ phức tạp của ứng dụng**

---

## 🚀 13. Cấu hình API Backend

### 13.1. Cấu hình môi trường

File `.env` đã được cấu hình để kết nối với backend tại `localhost:5292`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5292

# Development Environment
NODE_ENV=development
```

### 13.2. Tự động tạo API Client từ Swagger

Dự án sử dụng **Orval** để tự động tạo API clients từ Swagger/OpenAPI specification:

- **Swagger URL:** `http://localhost:5292/swagger/v1/swagger.json`
- **Cấu hình:** `orval.config.ts`
- **Output:** `src/api/endpoints/` và `src/api/models/`

### 13.3. Cách sử dụng

#### Tạo API Client mới:

```bash
# Tự động tạo API clients từ Swagger
pnpm run generate-api

# Sau đó, verify: Kiểm tra src/api/endpoints cho new files theo API tags (e.g., users.ts nếu tag 'Users')
```

#### Sử dụng trong component:

```typescript
import { getUsers } from '@/api/endpoints/users'

// Trong component
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => getUsers().getApiUsers()
})

// Hoặc sử dụng trực tiếp với axios
const users = await getUsers().getApiUsers()
```

### 13.4. Xử lý Authentication

API client tự động thêm Bearer token vào header của mỗi request:

```typescript
// Lưu token sau khi đăng nhập
sessionStorage.setItem('auth_token', token)

// Token sẽ tự động được thêm vào tất cả API calls
const { data } = await getUsers().getApiUsers()
```

### 13.5. Xử lý lỗi API

Tất cả lỗi API được chuẩn hóa thông qua `customRequest`:

- **Thành công:** Trả về `response.data`
- **Thất bại:** Throw `Error` với message từ API
- **Lỗi mạng:** Hiển thị console.error

### 13.6. Cấu trúc API được tạo tự động

```
src/api/
├── endpoints/          # API clients được tạo tự động
│   ├── users.ts
│   ├── files.ts
│   └── ...
├── models/            # TypeScript types được tạo tự động
│   ├── userDto.ts
│   ├── apiResult.ts
│   └── ...
└── request.ts         # Cấu hình Axios và xử lý request
```

> ⚠️ **Lưu ý:** Không chỉnh sửa các file trong `src/api/endpoints/` và `src/api/models/` vì chúng được tạo tự động từ Swagger.

---

## 14. Feature Implementation Example (Users)

Feature `users` được triển khai đầy đủ như **template tiêu chuẩn** cho tất cả features khác trong dự án. Đây là ví dụ hoàn chỉnh về cách áp dụng Feature Slices Pattern với các best practices.

### 14.1. Cấu trúc Feature Slices

```
src/features/users/
├── components/              # UI Components
│   ├── UserForm.tsx        # Form với validation
│   ├── UserTable.tsx       # Bảng với pagination
│   ├── UserProfile.tsx     # Chi tiết user
│   └── UserImport.tsx      # Import CSV
├── hooks/                  # Custom Hooks
│   ├── useUsers.ts         # CRUD với TanStack Query
│   └── useUserDetail.ts    # Chi tiết user
├── pages/                  # Pages
│   ├── UserListPage.tsx    # Danh sách + filtering
│   ├── UserCreatePage.tsx  # Tạo mới
│   ├── UserDetailPage.tsx  # Chi tiết
│   └── UserEditPage.tsx    # Chỉnh sửa
└── index.ts               # Export
```

### 14.2. API Integration

API clients được tự động generate từ Swagger:

```typescript
// src/api/endpoints/users.ts (Auto-generated)
export const getUsers = () => ({
  getApiUsers: (params) => customRequest<PagedResultOfUserWithRolesDto>({...}),
  postApiUsersCreate: (data) => customRequest<ApiResultOfString>({...}),
  postApiUsersUpdate: (data) => customRequest<ApiResult>({...}),
  postApiUsersDelete: (data) => customRequest<ApiResult>({...}),
})
```

### 14.3. State Management với TanStack Query

```typescript
// src/features/users/hooks/useUsers.ts
export const useUsers = (params) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers().getApiUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })
}

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data) => getUsers().postApiUsersCreate(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success('Tạo người dùng thành công')
        queryClient.invalidateQueries({ queryKey: ['users'] }) // Auto refresh
      }
    },
    onError: (error) => {
      toast.error('Tạo người dùng thất bại', { description: error.message })
    }
  })
}
```

### 14.4. UI Components với Shadcn/ui

#### UserTable Component
- Sử dụng Table component của Shadcn/ui
- Pagination tích hợp
- Row selection cho bulk operations
- Responsive design

#### UserForm Component
- React Hook Form + Zod validation
- Password strength checker
- Role-based permissions
- Conditional rendering cho create/edit

### 14.5. Advanced Features

#### Advanced Filtering
```typescript
// Search, filter theo trạng thái, collapsible filters
const [searchParams, setSearchParams] = useState({
  FullName: query,
  IsActive: status,
  Current: 1, // Reset page when filtering
})
```

#### Bulk Operations
```typescript
// Select multiple users, bulk delete, export CSV
const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
const handleBulkDelete = async () => {
  // Bulk delete với confirmation
}
```

#### Form Validation
```typescript
// React Hook Form + Zod schema
const userFormSchema = z.object({
  fullName: z.string().min(2, 'Tên đầy đủ phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
})
```

### 14.6. Error Handling & UX

#### Loading States
```typescript
if (isLoading) {
  return <div className="animate-spin">Loading...</div>
}
```

#### Error Boundaries
```typescript
if (error) {
  return <div className="text-red-600">{error.message}</div>
}
```

#### Toast Notifications
```typescript
onSuccess: (result) => {
  if (result.success) {
    toast.success('Tạo người dùng thành công')
  }
}
```

### 14.7. Routing Pattern

```typescript
// Standard CRUD routes
{
  path: '/users',
  name: 'Quản lý người dùng',
  component: 'UserListPage',
  isProtected: true,
},
{
  path: '/users/create',
  name: 'Thêm người dùng',
  component: 'UserCreatePage',
  isProtected: true,
},
{
  path: '/users/:id',
  name: 'Chi tiết người dùng',
  component: 'UserDetailPage',
  isProtected: true,
},
{
  path: '/users/:id/edit',
  name: 'Chỉnh sửa người dùng',
  component: 'UserEditPage',
  isProtected: true,
}
```

### 14.8. Best Practices Applied

✅ **Feature Slices Pattern**: Tách biệt hoàn toàn giữa các features
✅ **API-First**: Tự động generate từ Swagger specification
✅ **Type Safety**: Full TypeScript với generated types
✅ **State Management**: TanStack Query cho server state
✅ **Form Handling**: React Hook Form + Zod validation
✅ **UI Components**: Shadcn/ui với Tailwind CSS
✅ **Error Handling**: Comprehensive error states
✅ **Loading States**: Proper loading indicators
✅ **Responsive Design**: Mobile-first approach
✅ **Accessibility**: ARIA labels và keyboard navigation
✅ **Performance**: Code splitting và caching strategy

### 14.9. Template cho Features khác

Sử dụng users feature làm template để implement các features khác:

1. **Tạo cấu trúc thư mục** theo Feature Slices pattern
2. **Generate API clients** từ Swagger với Orval
3. **Implement CRUD operations** với TanStack Query
4. **Tạo UI components** với Shadcn/ui
5. **Thêm routing** theo standard pattern
6. **Implement advanced features** như filtering, bulk operations

**Ví dụ cho Hotels feature:**
```bash
# 1. Generate API từ Swagger
pnpm run generate-api

# 2. Tạo feature structure
mkdir -p src/features/hotels/{components,hooks,pages}

# 3. Copy và customize từ users feature
cp src/features/users/hooks/useUsers.ts src/features/hotels/hooks/useHotels.ts
# ... customize theo Hotel model

# 4. Update routes
# Thêm routes vào app/router/routes.ts

# 5. Update navigation
# Routes sẽ tự động hiển thị trong sidebar
```

Feature users đã được implement đầy đủ và có thể sử dụng làm template cho tất cả các features khác trong dự án.

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| **v2.0** | Oct 23, 2024 | **Major Update**: Updated documentation standards with STEP 0-6 guides, implemented complete image upload for Hotels/Restaurants, refined dark mode with React Context, clarified `/docs` as source of truth, added feature status table |
| **v1.0** | Sep 2024 | Initial project setup with base features (Identity, Users, Roles, Departments, Organizations), API-First architecture, Feature Slices pattern |

---

## 📞 Support

For questions or issues:
1. Check [`/docs/STEPS_INDEX.md`](./docs/STEPS_INDEX.md) for implementation guidance
2. Review reference implementations in `src/features/`
3. Check [`/docs/IMPLEMENT_GUIDE.md`](./docs/IMPLEMENT_GUIDE.md) for architectural patterns
4. Review [`/AGENTS.md`](./AGENTS.md) for coding standards

---

**Last Updated:** Oct 23, 2024 | **Current Version:** v2.0
