# STEP 2: Create Detail Page

## Overview

Build the detail/view page where users see a single item's full information:
- Display item details in a card
- Navigation bar with Back + Edit buttons
- Handle not found (404) state
- Clean, organized layout

**Estimated time**: 30-40 minutes  
**Depends on**: STEP_0_SETUP.md, STEP_1_LIST_PAGE.md completed

---

## Files to Create

```
src/features/[feature-name]/
├── components/
│   └── [Feature]Profile.tsx          ← Detail display component (new)
└── pages/
    └── [Feature]DetailPage.tsx       ← Detail page (new)
```

## Files to Modify

```
src/app/router/routes.tsx              ← Add detail route
```

---

## Step 1: Create Profile Display Component

**File**: `src/features/[feature-name]/components/[Feature]Profile.tsx`

Displays item details in a readable format.

**Template**:
```typescript
import { formatDate } from '@/utils/date'
import type { [Feature]Dto } from '@/api/generated'

interface [Feature]ProfileProps {
  item: [Feature]Dto
}

export const [Feature]Profile = ({ item }: [Feature]ProfileProps) => {
  return (
    <div className="space-y-6">
      {/* Name Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên</h3>
          <p className="text-lg text-gray-900">{item.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mã</h3>
          <p className="text-lg text-gray-900">{item.code || '-'}</p>
        </div>
      </div>

      {/* Description Section */}
      {item.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Mô tả</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
        </div>
      )}

      {/* Metadata Section */}
      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h3 className="font-semibold text-gray-600 mb-1">Ngày tạo</h3>
          <p className="text-gray-600">{formatDate(item.createdDate)}</p>
        </div>

        {item.updatedDate && (
          <div>
            <h3 className="font-semibold text-gray-600 mb-1">Cập nhật lần cuối</h3>
            <p className="text-gray-600">{formatDate(item.updatedDate)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default [Feature]Profile
```

**Key Points**:
- Display in a grid (2 columns on desktop, 1 on mobile)
- Use semantic HTML headings
- Add metadata (created date, updated date)
- Handle null/undefined values with "-"
- `whitespace-pre-wrap` for multi-line text

**Styling Guidelines**:
- Headers: `font-semibold text-gray-600`
- Values: `text-gray-900` (default text)
- Secondary: `text-gray-700`
- Muted: `text-gray-600`

**Important: Profile Component Structure**

⚠️ **DO NOT add Card wrapper inside Profile component**:
- `DetailPageLayout` already provides a Card wrapper (lines 47-49)
- Adding extra Card components inside Profile creates **duplicate/nested cards**
- Result is cluttered and breaks layout consistency

✅ **Correct approach:**
```typescript
// Profile component should only use semantic <div> elements
<div className="space-y-6">
  {/* Section 1 */}
  <div>
    <h3 className="text-sm font-semibold text-gray-600 mb-2">Field Name</h3>
    <p className="text-lg text-gray-900">{value}</p>
  </div>

  {/* Section 2 with border divider */}
  <div className="border-t pt-4">
    <h3 className="text-sm font-semibold text-gray-600 mb-2">Another Field</h3>
    <p className="text-gray-700">{value}</p>
  </div>
</div>
```

❌ **WRONG - DO NOT DO:**
```typescript
// ❌ This creates nested Card inside DetailPageLayout Card
<div className="space-y-6">
  <Card>
    <CardHeader><CardTitle>...</CardTitle></CardHeader>
    <CardContent>...</CardContent>
  </Card>
</div>
```

**Important: Hide System IDs**

🔒 **Never display system ID fields to end users:**
- ❌ `publicId` - internal system identifier
- ❌ `organizationPublicId` - internal relationship ID
- ❌ `id` - internal database ID

**Show only business-relevant fields:**
- ✅ `name`, `code` - user-facing identifiers
- ✅ `description` - business content
- ✅ `createdDate`, `updatedDate` - metadata
- ✅ Related entity names (e.g., `organizationName` not `organizationPublicId`)

**Example: Good vs Bad**

✅ **Good - Business Data Only:**
```typescript
// Display only what users care about
<div>
  <h3>Tên</h3>
  <p>{item.name}</p>
</div>

<div>
  <h3>Mã</h3>
  <p>{item.code}</p>
</div>

<div>
  <h3>Đơn vị</h3>
  <p>{item.organizationName}</p>
</div>
```

❌ **Bad - Exposing System IDs:**
```typescript
// Don't show this to users
<div>
  <h3>ID</h3>
  <p>{item.publicId}</p>  // System ID - hide this!
</div>

<div>
  <h3>Organization ID</h3>
  <p>{item.organizationPublicId}</p>  // System ID - hide this!
</div>
```

---

## Step 2: Create Detail Page

**File**: `src/features/[feature-name]/pages/[Feature]DetailPage.tsx`

**Template**:
```typescript
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DetailPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, Edit, AlertCircle } from 'lucide-react'
import [Feature]Profile from '../components/[Feature]Profile'
import { use[Feature]Detail } from '../hooks/use[Features]'

export const [Feature]DetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // ====== DATA FETCHING ======
  const { data, isLoading, error } = use[Feature]Detail(id!)

  // ====== EVENT HANDLERS ======
  const handleEdit = () => {
    navigate(`/[feature-name]/${id}/edit`)
  }

  // ====== ERROR STATE ======
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
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy [đối tượng]
            </h3>
            <p className="text-gray-600 mb-6">
              [Đối tượng] bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/[feature-name]')}
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </DetailPageLayout>
    )
  }

  const item = data.data

  // ====== RENDER ======
  return (
    <DetailPageLayout
      title="Quản lý [đối tượng]"
      description="Quản lý tất cả [đối tượng] trong hệ thống"
      objectName={item.name || '[Đối tượng] chi tiết'}
      breadcrumbItems={[
        { label: 'Quản lý [đối tượng]', href: '/[feature-name]' },
        { label: item.name || 'Chi tiết', current: true }
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
      {/* Detail Content */}
      <[Feature]Profile item={item} />
    </DetailPageLayout>
  )
}

export default [Feature]DetailPage
```

**Key Points**:
- Use `useParams()` to get ID from URL
- Check for error/null before rendering content
- Show 404 state with helpful message
- ActionBar has Back + Edit buttons separated by divider
- Profile component is child of DetailPageLayout
- **REQUIRED: Add `title` and `description` props** (see Props below)

**DetailPageLayout Props**:

| Prop | Type | Required | Example | Notes |
|------|------|----------|---------|-------|
| `title` | string | ✅ Yes | "Quản lý phòng ban" | Page-level title shown above ObjectName |
| `description` | string | ✅ Yes | "Quản lý tất cả..." | Page-level description below title |
| `objectName` | string | ✅ Yes | item.name | Object name shown in card header |
| `breadcrumbItems` | array | ✅ Yes | [...] | Breadcrumb navigation |
| `actionBarContent` | React.ReactNode | ✅ Yes | buttons | Action buttons (Back, Edit, Delete) |
| `children` | React.ReactNode | ✅ Yes | `<Profile />` | Profile component |

**Example - Must include title + description:**
```typescript
<DetailPageLayout
  title="Quản lý phòng ban"              // ← REQUIRED
  description="Quản lý thông tin..."     // ← REQUIRED
  objectName={item.name}
  breadcrumbItems={[...]}
  actionBarContent={...}
>
  <RoleProfile item={item} />
</DetailPageLayout>
```

---

## Step 3: Add Route

**File**: `src/app/router/routes.tsx`

```typescript
import { [Feature]DetailPage } from '@/features/[feature-name]'

export const routes = [
  // ... other routes
  {
    path: '/[feature-name]/:id',
    element: <[Feature]DetailPage />,
  },
]
```

**Important**: `:id` parameter must match URL format used in navigation (usually `publicId`)

---

## Testing Checklist

- [ ] Page loads without errors
- [ ] Displays item name in header
- [ ] Shows all item details in profile
- [ ] Shows formatted dates
- [ ] Back button navigates to list page
- [ ] Edit button navigates to edit page with correct ID
- [ ] 404 state shows when item not found
- [ ] Loading state works (spinner in header)
- [ ] Breadcrumb shows correct items
- [ ] Mobile responsive (2 columns → 1 column)

---

## See Also

- **Reference**: `src/features/organizations/pages/OrganizationDetailPage.tsx`
- **Profile Component**: `src/features/organizations/components/OrganizationProfile.tsx`
- **Shared Layout**: `src/shared/components/DetailPageLayout.tsx`
- **Previous Step**: STEP_1_LIST_PAGE.md
- **Next Step**: STEP_3_CREATE_FORM.md
