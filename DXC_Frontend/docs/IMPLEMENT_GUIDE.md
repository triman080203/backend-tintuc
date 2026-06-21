# Feature Implementation Guide

Hướng dẫn thực tế cách xây dựng một feature mới sử dụng shared components.

> **Note**: Ví dụ sử dụng placeholder `MyFeature`, `myfeature`. Thay thế bằng tên feature thực tế của bạn (VD: `Organization`, `User`, `Product`, `Department`, v.v.). 
>
> **Reference Implementation**: Xem `src/features/organizations/` như ví dụ thực tế của architecture này.

## Table of Contents
1. [Kiến trúc tổng quan](#kiến-trúc-tổng-quan)
2. [Shared Components](#shared-components)
3. [Cấu trúc Feature](#cấu-trúc-feature)
4. [Chi tiết Implementation](#chi-tiết-implementation)
5. [Step-by-step Guide](#step-by-step-guide)
6. [Common Patterns](#common-patterns)
7. [Best Practices](#best-practices)

---

## Kiến trúc tổng quan

### Architecture Principle

Shared components cung cấp **pure layout containers** (chỉ layout + styling), **features định nghĩa tất cả actions** (logic business + button content).

```
┌─────────────────────────────────────┐
│     ListPageLayout (Shared)         │
│  - Breadcrumb                       │
│  - Title + Description              │
│  - ActionBar (container)            │
│  - Content slot (children)          │
│                                     │
│  ❌ NO default buttons              │
│  ❌ NO search logic                 │
└─────────────────────────────────────┘
           ↑
           │ accepts actionBarContent
           │ (features provide buttons)
           │
┌─────────────────────────────────────┐
│  [FeatureName]ListPage (Feature)    │
│  - Custom Create button             │
│  - ActionBarDivider                 │
│  - Custom Search button             │
│  - Search dialog logic              │
│  - Table component                  │
└─────────────────────────────────────┘
```

### Core Components

| Component | Purpose | Responsibility |
|-----------|---------|-----------------|
| `ListPageLayout` | List page template | Layout only, no buttons |
| `DetailPageLayout` | Detail page template | Layout only, no buttons |
| `FormPageLayout` | Form page template | Layout only, no buttons |
| `ActionBar` | Button container | Styling, border, shadow |
| `ActionBarDivider` | Button separator | Visual divider between groups |
| `DataTable` | Data display | Render table, pagination |

---

## Shared Components

### 1. ListPageLayout

**File**: `src/shared/components/ListPageLayout.tsx`

```tsx
interface ListPageLayoutProps {
  title?: string
  description?: string
  breadcrumbItems?: BreadcrumbItem[]
  actionBarContent?: React.ReactNode  // Features provide ALL buttons here
  children: React.ReactNode
}
```

**Features**: 
- Renders breadcrumb, title/description
- Renders ActionBar wrapper (if actionBarContent provided)
- Renders children (table, etc.)

**What it does NOT do**:
- ❌ No default Create button
- ❌ No search dialog
- ❌ No page state management

---

### 2. DetailPageLayout

**File**: `src/shared/components/DetailPageLayout.tsx`

```tsx
interface DetailPageLayoutProps {
  objectName: string
  breadcrumbItems?: BreadcrumbItem[]
  actionBarContent?: React.ReactNode  // Features provide ALL buttons here
  children: React.ReactNode
}
```

**Features**:
- Renders breadcrumb
- Renders Card with object name
- Renders ActionBar wrapper
- Renders children (detail content)

**What it does NOT do**:
- ❌ No default Back button
- ❌ No default Edit button

---

### 3. FormPageLayout

**File**: `src/shared/components/FormPageLayout.tsx`

```tsx
interface FormPageLayoutProps {
  formTitle: string
  breadcrumbItems?: BreadcrumbItem[]
  actionBarContent?: React.ReactNode  // Features provide ALL buttons here
  children: React.ReactNode
}
```

**Features**:
- Renders breadcrumb
- Renders Card with form title
- Renders ActionBar wrapper
- Renders children (form fields)

**What it does NOT do**:
- ❌ No default Back button
- ❌ No default Cancel/Save buttons

---

### 4. ActionBar & ActionBarDivider

**ActionBar**: Container with consistent styling
```tsx
<ActionBar>
  {/* buttons go here */}
</ActionBar>
```

**ActionBarDivider**: Visual separator
```tsx
<Button>...</Button>
<ActionBarDivider />  {/* renders | */}
<Button>...</Button>
```

---

## Cấu trúc Feature

```
src/features/[feature-name]/
├── pages/
│   ├── [Feature]ListPage.tsx         ← List với custom actionBarContent
│   ├── [Feature]DetailPage.tsx       ← Detail với custom actionBarContent
│   ├── [Feature]CreatePage.tsx       ← Create với custom actionBarContent
│   └── [Feature]EditPage.tsx         ← Edit với custom actionBarContent
├── components/
│   ├── [Feature]Table.tsx            ← Uses DataTable
│   ├── [Feature]Form.tsx             ← Form fields only
│   └── [Feature]Profile.tsx          ← Display fields (optional)
├── hooks/
│   └── use[Features].ts              ← Data fetching (create, list, detail, update, delete)
├── types/
│   └── index.ts                      ← TypeScript types
└── index.ts                          ← Barrel export
```

**Placeholder Legend**:
- `[feature-name]`: VD: `organizations`, `users`, `products` (lowercase, kebab-case)
- `[Feature]`: VD: `Organization`, `User`, `Product` (PascalCase)
- `[Features]`: VD: `Organizations`, `Users`, `Products` (PascalCase plural)

### Key Points

1. **Pages manage button logic** (actionBarContent)
2. **Components are presentational** (form fields, table columns)
3. **Hooks handle data** (API calls, mutations)
4. **Each page is self-contained** (no shared page logic)

---

## Image Upload Pattern (Optional)

⚠️ **Only implement if your feature has image fields** (see STEP_6_UPLOAD_IMAGE_OPTIONAL.md)

### Architecture

Image upload follows a **4-layer pattern**:

```
1. Utility Layer
   └─ buildImageUrl()
      Converts API paths to full URLs
      
2. Hook Layer
   └─ use[Feature]ImageUpload()
      Manages upload state & validation
      - File size checking (5MB)
      - Upload/remove operations
      - Public ID collection
      
3. Component Layer
   ├─ [Feature]ImageUploader
   │  Drag-drop UI for uploading
   │  - Shows existing images (green)
   │  - Shows new images (blue)
   │  - Delete buttons on new only
   │
   └─ ImageGallery
      Display & lightbox
      - Responsive grid
      - Full-screen viewer
      - Keyboard navigation
      
4. Integration Layer
   ├─ Form: RestaurantForm
   │  Add imagePublicIds field
   │  Include uploader component
   │
   └─ Detail: DetailPage
      Add gallery display
      Show conditional on images.length > 0
```

### Key Concepts

**1. URL Building**
```typescript
// API returns relative path: "uploads/image.jpg"
// Frontend needs: "https://api.example.com/uploads/image.jpg"

buildImageUrl(imageUrl)  // Prepends VITE_API_BASE_URL
```

**2. Upload Hook Pattern**
```typescript
const { uploadedImages, isUploading, handleUpload, removeImage } = 
  use[Feature]ImageUpload()

// Returns:
{
  uploadedImages: UploadedImage[],    // Newly uploaded
  isUploading: boolean,                // Upload in progress
  handleUpload: (files) => void,       // Upload files
  removeImage: (uid) => void,          // Delete single
  getPublicIds: () => string[]         // Get IDs for form
}
```

**3. Form Integration**
```typescript
// Add to Zod schema
imagePublicIds: z.array(z.string()).optional()

// Add state
const [isImageUploading, setIsImageUploading] = useState(false)

// Add callbacks
const handleImagesUploaded = (publicIds) => {
  form.setValue('imagePublicIds', publicIds)
}

// Prevent submit during upload
if (isImageUploading) return

// Include in submitData
imagePublicIds: data.imagePublicIds?.length ? data.imagePublicIds : null
```

**4. File Validation**
```typescript
// Max 5MB per image (5 * 1024 * 1024 bytes)
const maxSize = 5 * 1024 * 1024

if (file.size > maxSize) {
  toast.error(`File ${file.name} exceeds 5MB limit`)
  return
}
```

**5. Detail Page Display**
```typescript
{/* Conditional rendering */}
{feature.images?.length > 0 && (
  <div className="border-t pt-6">
    <h3>Ảnh [feature]</h3>
    <ImageGallery images={feature.images} />
  </div>
)}
```

### Common Implementation Mistakes

❌ **Don't**:
- Forget to check `isImageUploading` in form submit
- Mix uploaded & existing images incorrectly
- Allow form submit during upload
- Forget `useRef` to prevent infinite callbacks
- Use `object-cover` in lightbox (use `object-contain`)

✅ **Do**:
- Validate file size before upload
- Show upload progress
- Use `useRef` for sync tracking
- Combine existing + new images
- Use `object-contain` for lightbox
- Add proper error handling with toasts

---

## Chi tiết Implementation

### 1. List Page with Custom Action Bar

**File**: `src/features/[feature-name]/pages/[Feature]ListPage.tsx`

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import [Feature]Table from '../components/[Feature]Table'
import { use[Features] } from '../hooks/use[Features]'

export const [Feature]ListPage = () => {
  const navigate = useNavigate()
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)
  
  const { data, isLoading } = use[Features]({
    ...getPaginationParams(),
    Name: searchTerm || undefined,
  })

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setIsSearchOpen(false)
  }

  const handleCancelSearch = () => {
    setTempSearchTerm(searchTerm)
    setIsSearchOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempSearchTerm(searchTerm)
    }
    setIsSearchOpen(open)
  }

  return (
    <>
      <ListPageLayout
        title="Quản lý [đối tượng]"
         description="Quản lý tất cả [đối tượng] trong hệ thống"
        breadcrumbItems={[{ label: 'Quản lý [đối tượng]', current: true }]}
        actionBarContent={
          <>
            {/* Create Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/[feature-name]/create')}
              className="gap-2"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Thêm mới
            </Button>
            
            {/* Divider between button groups */}
            <ActionBarDivider />
            
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(true)}
              className="gap-2"
            >
              <Search className="w-4 h-4 text-blue-600" />
              Tìm kiếm
            </Button>
          </>
        }
      >
        <[Feature]Table
          items={data?.data || []}
          isLoading={isLoading}
          pagination={{
            current: page,
            total: data?.total || 0,
            pageSize: pageSize,
            onChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />
      </ListPageLayout>

      {/* Search Dialog - managed by this page */}
      <Dialog open={isSearchOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm</DialogTitle>
          </DialogHeader>

          <Input
            autoFocus
            placeholder="Nhập từ khóa tìm kiếm..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearch()
              }
            }}
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancelSearch}>
              Hủy
            </Button>
            <Button onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

**Key Points**:
1. Page provides **full actionBarContent** with Create + Search buttons
2. Page manages **search dialog state** (isSearchOpen, tempSearchTerm)
3. Page manages **search logic** (handleSearch)
4. Uses **ActionBarDivider** to separate button groups
5. Uses **usePagination** hook for page/pageSize management

---

### 2. Detail Page with Custom Action Bar

**File**: `src/features/[feature-name]/pages/[Feature]DetailPage.tsx`

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DetailPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit } from 'lucide-react'
import [Feature]Profile from '../components/[Feature]Profile'
import { use[Feature]Detail } from '../hooks/use[Features]'

export const [Feature]DetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error } = use[Feature]Detail(id!)

  const handleEdit = () => {
    navigate(`/[feature-name]/${id}/edit`)
  }

  if (error || !data?.data) {
    return (
      <DetailPageLayout
      title="Quản lý [đối tượng]"
         description="Quản lý tất cả [đối tượng] trong hệ thống"
        objectName="Không tìm thấy"
        breadcrumbItems={[
          { label: 'Quản lý [đối tượng]', href: '/[feature-name]' }
        ]}
        actionBarContent={
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/[feature-name]')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
        }
      >
        <div className="text-center py-8 space-y-4">
          <p className="text-muted-foreground">
            [Đối tượng] bạn đang tìm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </DetailPageLayout>
    )
  }

  const itemData = data.data

  return (
    <DetailPageLayout
      objectName={itemData.name || '[Đối tượng] chi tiết'}
      breadcrumbItems={[
        { label: 'Quản lý [đối tượng]', href: '/[feature-name]' },
        { label: itemData.name || 'Chi tiết', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/[feature-name]')}
            disabled={isLoading}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
          
          {/* Divider between groups */}
          <ActionBarDivider />
          
          {/* Action: Edit */}
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            disabled={isLoading}
            className="gap-2"
          >
            <Edit className="w-4 h-4 text-blue-600" />
            Chỉnh sửa
          </Button>
        </>
      }
    >
      <[Feature]Profile item={itemData} />
    </DetailPageLayout>
  )
}
```

**Key Points**:
1. Page provides **full actionBarContent** with Back + Edit buttons
2. Page handles **navigation** (useNavigate)
3. Page manages **error state** (show different UI if error)
4. Page defines **button visibility** and **disabled states**
5. Uses **ActionBarDivider** to separate Back from Edit

---

### 3. Create Page with Form

**File**: `src/features/[feature-name]/pages/[Feature]CreatePage.tsx`

```tsx
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import [Feature]Form from '../components/[Feature]Form'
import { useCreate[Feature] } from '../hooks/use[Features]'

export const [Feature]CreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useCreate[Feature]()
  const submitRef = useRef<(() => void) | null>(null)

  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  return (
    <FormPageLayout
    title="Quản lý [đối tượng]"
         description="Quản lý tất cả [đối tượng] trong hệ thống"
      formTitle="Tạo [đối tượng] mới"
      breadcrumbItems={[
        { label: 'Quản lý [đối tượng]', href: '/[feature-name]' },
        { label: 'Tạo mới', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/[feature-name]')}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
          
          {/* Divider */}
          <ActionBarDivider />
          
          {/* Form Actions: Cancel, Save */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/[feature-name]')}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={createMutation.isPending}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <[Feature]Form 
        onSuccess={() => navigate('/[feature-name]')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}
```

**Key Points**:
1. Page provides **full actionBarContent** with Back + Cancel + Save buttons
2. Page manages **form submission** via ref (submitRef)
3. Page handles **navigation** (Back/Cancel go to list)
4. Page shows **loading state** during save (isPending)
5. Uses **ActionBarDivider** to separate Back from form actions

---

### 4. Form Component (Presentational)

**File**: `src/features/[feature-name]/components/[Feature]Form.tsx`

```tsx
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreate[Feature], useUpdate[Feature] } from '../hooks/use[Features]'

const schema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface [Feature]FormProps {
  initialData?: any
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const [Feature]Form = ({ initialData, onSuccess, onSave }: [Feature]FormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreate[Feature]()
  const updateMutation = useUpdate[Feature]()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    if (isEditing) {
      await updateMutation.mutateAsync(
        { publicId: initialData.publicId, ...data },
        { onSuccess: () => onSuccess?.() }
      )
    } else {
      await createMutation.mutateAsync(data, { onSuccess: () => onSuccess?.() })
    }
  }

  // Expose submit function to parent via ref
  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập tên..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Nhập mô tả..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

**Key Points**:
1. Form is **purely presentational** (no buttons)
2. Form exposes **submit via callback** (onSave prop)
3. Form handles **validation** (zod schema)
4. Form works for both **create and edit** (isEditing flag)
5. No form-level state management beyond react-hook-form

---

### 5. Data Fetching Hook

**File**: `src/features/[feature-name]/hooks/use[Features].ts`

```tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as API from '@/api/[feature-name]'

// ✅ List [Features]
export const use[Features] = (params: any) => {
  return useQuery({
    queryKey: ['[features]', params],
    queryFn: () => API.get[Features](params),
    enabled: true,
  })
}

// ✅ Get [Feature] Detail
export const use[Feature]Detail = (id: string) => {
  return useQuery({
    queryKey: ['[feature]', id],
    queryFn: () => API.get[Feature]Detail(id),
  })
}

// ✅ Create [Feature]
export const useCreate[Feature] = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.create[Feature](data),
    onSuccess: () => {
      toast.success('Tạo thành công')
      queryClient.invalidateQueries({ queryKey: ['[features]'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Có lỗi xảy ra')
    },
  })
}

// ✅ Update [Feature]
export const useUpdate[Feature] = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => API.update[Feature](data),
    onSuccess: () => {
      toast.success('Cập nhật thành công')
      queryClient.invalidateQueries({ queryKey: ['[features]'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Có lỗi xảy ra')
    },
  })
}

// ✅ Delete [Feature]
export const useDelete[Feature] = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => API.delete[Feature](id),
    onSuccess: () => {
      toast.success('Xóa thành công')
      queryClient.invalidateQueries({ queryKey: ['[features]'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Có lỗi xảy ra')
    },
  })
}
```

**Key Points**:
1. Each query/mutation is **separate hook**
2. Hooks handle **cache invalidation** on success
3. Hooks show **toast notifications** for feedback
4. Hooks are **agnostic** to page implementation

---

## Step-by-step Guide

### Step 1: Create Feature Folder Structure

```bash
mkdir -p src/features/[feature-name]/{pages,components,hooks,types}
touch src/features/[feature-name]/index.ts
```

### Step 2: Create API Calls (API layer)

Create file: `src/api/[feature-name].ts`

```tsx
export const get[Features] = (params: any) => {
  return apiClient.get('/[feature-name]s', { params })
}

export const get[Feature]Detail = (id: string) => {
  return apiClient.get(`/[feature-name]/${id}`)
}

export const create[Feature] = (data: any) => {
  return apiClient.post('/[feature-name]s', data)
}

export const update[Feature] = (data: any) => {
  return apiClient.put(`/[feature-name]/${data.publicId}`, data)
}

export const delete[Feature] = (id: string) => {
  return apiClient.delete(`/[feature-name]/${id}`)
}
```

### Step 3: Create Data Hooks

Create file: `src/features/[feature-name]/hooks/use[Features].ts`

Use pattern from [Data Fetching Hook section](#5-data-fetching-hook) above

### Step 4: Create Form Component

Create file: `src/features/[feature-name]/components/[Feature]Form.tsx`

Use pattern from [Form Component section](#4-form-component-presentational) above

### Step 5: Create Table Component

Create file: `src/features/[feature-name]/components/[Feature]Table.tsx`

Display table using DataTable, define columns and actions

### Step 6: Create List Page

Create file: `src/features/[feature-name]/pages/[Feature]ListPage.tsx`

Use pattern from [List Page section](#1-list-page-with-custom-action-bar) above

### Step 7: Create Detail Page

Create file: `src/features/[feature-name]/pages/[Feature]DetailPage.tsx`

Use pattern from [Detail Page section](#2-detail-page-with-custom-action-bar) above

### Step 8: Create Form Pages

Create files:
- `src/features/[feature-name]/pages/[Feature]CreatePage.tsx`
- `src/features/[feature-name]/pages/[Feature]EditPage.tsx`

Use pattern from [Create Page section](#3-create-page-with-form) above

### Step 9: Export from Feature Index

Edit file: `src/features/[feature-name]/index.ts`

```tsx
export { [Feature]ListPage } from './pages/[Feature]ListPage'
export { [Feature]DetailPage } from './pages/[Feature]DetailPage'
export { [Feature]CreatePage } from './pages/[Feature]CreatePage'
export { [Feature]EditPage } from './pages/[Feature]EditPage'
```

### Step 10: Add Routes

Edit file: `src/app/router/routes.tsx`

```tsx
import { 
  [Feature]ListPage,
  [Feature]DetailPage,
  [Feature]CreatePage,
  [Feature]EditPage,
} from '@/features/[feature-name]'

const routes = [
  {
    path: '/[feature-name]',
    element: <[Feature]ListPage />,
  },
  {
    path: '/[feature-name]/:id',
    element: <[Feature]DetailPage />,
  },
  {
    path: '/[feature-name]/create',
    element: <[Feature]CreatePage />,
  },
  {
    path: '/[feature-name]/:id/edit',
    element: <[Feature]EditPage />,
  },
]
```

### Step 11: Add Navigation

Edit file: `src/app/router/navigationConfig.ts`

```tsx
{
  label: 'Quản lý [đối tượng]',
  href: '/[feature-name]',
  icon: 'IconName',
}
```

---

## Common Patterns

### Pattern 1: Custom Search in List Page

Key components:
```tsx
const [searchTerm, setSearchTerm] = useState('')
const [isSearchOpen, setIsSearchOpen] = useState(false)
const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

// Dialog state management
const handleOpenChange = (open: boolean) => {
  if (open) {
    setTempSearchTerm(searchTerm)
  }
  setIsSearchOpen(open)
}

// Apply search
const handleSearch = () => {
  setSearchTerm(tempSearchTerm)
  setIsSearchOpen(false)
}

// Cancel search
const handleCancelSearch = () => {
  setTempSearchTerm(searchTerm)
  setIsSearchOpen(false)
}
```

**In actionBarContent**:
```tsx
<Button onClick={() => handleOpenChange(true)}>
  <Search className="w-4 h-4 text-blue-600" />
  Tìm kiếm
</Button>
```

---

### Pattern 2: Navigation Buttons (Back)

Used in all pages with actionBarContent

```tsx
<Button 
  variant="ghost"
  size="sm"
  onClick={() => navigate('/[feature-name]')}
  disabled={isLoading}
  className="gap-2"
>
  <ChevronLeft className="w-4 h-4 text-blue-600" />
  Quay lại
</Button>
```

---

### Pattern 3: Form Submission from Parent

In page component:
```tsx
const submitRef = useRef<(() => void) | null>(null)

const handleSave = () => {
  if (submitRef.current) {
    submitRef.current()
  }
}

// Pass ref to form
<[Feature]Form onSave={(submit) => {
  submitRef.current = submit
}} />

// Use in button
<Button onClick={handleSave} disabled={isPending}>
  Lưu
</Button>
```

In Form component:
```tsx
React.useEffect(() => {
  onSave?.(() => form.handleSubmit(onSubmit)())
}, [form, onSave])
```

---

### Pattern 4: Action Bar with Divider

```tsx
actionBarContent={
  <>
    {/* Group 1: Navigation */}
    <Button>Back</Button>
    
    {/* Separator */}
    <ActionBarDivider />
    
    {/* Group 2: Actions */}
    <Button>Edit</Button>
  </>
}
```

---

## Best Practices

### ✅ DO

1. **Use ListPageLayout for all list pages**
   ```tsx
   <ListPageLayout actionBarContent={...}>
     <DataTable ... />
   </ListPageLayout>
   ```

2. **Provide actionBarContent in pages**
   ```tsx
   actionBarContent={
     <>
       <Button>Create</Button>
       <ActionBarDivider />
       <Button>Search</Button>
     </>
   }
   ```

3. **Use ActionBarDivider between button groups**
   ```tsx
   <Button>Navigation</Button>
   <ActionBarDivider />
   <Button>Action</Button>
   ```

4. **Add text-blue-600 to all icons**
   ```tsx
   <Plus className="w-4 h-4 text-blue-600" />
   ```

5. **Use consistent button styling**
   ```tsx
   <Button variant="ghost" size="sm" className="gap-2">
     <Icon className="w-4 h-4 text-blue-600" />
     Label
   </Button>
   ```

6. **Manage search dialog in the page**
   ```tsx
   const [isSearchOpen, setIsSearchOpen] = useState(false)
   // ... search dialog at bottom
   ```

7. **Use hooks for data fetching**
   ```tsx
   const { data, isLoading } = use[Features](params)
   ```

---

### ❌ DON'T

1. **Don't add buttons to FormPageLayout/DetailPageLayout**
   ```tsx
   ❌ <FormPageLayout onSave={handleSave} onCancel={...} />
   ✅ <FormPageLayout actionBarContent={<Button onClick={handleSave} />} />
   ```

2. **Don't define shared component logic**
   ```tsx
   ❌ ListPageLayout defines Create button
   ✅ ListPageLayout provides layout only
   ```

3. **Don't forget ActionBarDivider**
   ```tsx
   ❌ <Button>Back</Button><Button>Edit</Button>
   ✅ <Button>Back</Button><ActionBarDivider /><Button>Edit</Button>
   ```

4. **Don't mix icon colors**
   ```tsx
   ❌ <Plus className="w-4 h-4" /> (no color)
   ✅ <Plus className="w-4 h-4 text-blue-600" /> (blue)
   ```

5. **Don't hardcode state in components**
   ```tsx
   ❌ const [searchTerm] = useState('') // in form component
   ✅ Pass via props or use page-level state
   ```

---

## File Checklist for New Feature

- [ ] `src/features/[feature-name]/pages/[Feature]ListPage.tsx`
- [ ] `src/features/[feature-name]/pages/[Feature]DetailPage.tsx`
- [ ] `src/features/[feature-name]/pages/[Feature]CreatePage.tsx`
- [ ] `src/features/[feature-name]/pages/[Feature]EditPage.tsx`
- [ ] `src/features/[feature-name]/components/[Feature]Form.tsx`
- [ ] `src/features/[feature-name]/components/[Feature]Table.tsx` (optional)
- [ ] `src/features/[feature-name]/components/[Feature]Profile.tsx` (optional)
- [ ] `src/features/[feature-name]/hooks/use[Features].ts`
- [ ] `src/features/[feature-name]/types/index.ts` (optional)
- [ ] `src/features/[feature-name]/index.ts` (barrel export)
- [ ] `src/api/[feature-name].ts` (if new API)
- [ ] Routes added to `src/app/router/routes.tsx`
- [ ] Navigation added to `src/app/router/navigationConfig.ts`

---

## Placeholder Reference

| Placeholder | Meaning | Example |
|------------|---------|---------|
| `[feature-name]` | Feature folder name, lowercase kebab-case | `organizations`, `user-roles`, `products` |
| `[Feature]` | PascalCase singular | `Organization`, `User`, `Product` |
| `[Features]` | PascalCase plural | `Organizations`, `Users`, `Products` |
| `[features]` | lowercase plural, used in query keys | `organizations`, `users`, `products` |
| `[đối tượng]` | Vietnamese description of object | `đơn vị`, `người dùng`, `sản phẩm` |

---

## Reference Implementation

For actual implementation details, refer to:
- **Real Feature**: `src/features/organizations/` 

This Organization feature implements the architecture and patterns described in this guide and serves as the reference for all new features.

---

## Questions?

1. **How do I handle pagination?**
   → Use `usePagination` hook from `@/shared/hooks`

2. **How do I add more form fields?**
   → Add `FormField` components in `[Feature]Form.tsx` following the same pattern

3. **How do I customize the table?**
   → Define custom `columns` prop in `[Feature]Table.tsx` using DataTable

4. **How do I add more buttons to action bar?**
   → Add more `<Button>` components in `actionBarContent` with `<ActionBarDivider />` between groups

5. **How do I handle errors?**
   → Mutations already handle toast notifications via `onError` callback

6. **How do I add delete functionality?**
   → Create `useDelete[Feature]` mutation following same pattern as create/update

7. **What if I need additional hooks?**
   → Create in `src/features/[feature-name]/hooks/use[Features].ts` following TanStack Query patterns
