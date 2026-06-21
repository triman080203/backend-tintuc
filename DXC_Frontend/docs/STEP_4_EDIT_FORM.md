# STEP 4: Create Edit Page

## Overview

Build the edit page where users modify existing items:
- Load item data into form
- Submit changes to API
- Success redirect
- Handle errors

**Estimated time**: 20-30 minutes  
**Depends on**: STEP_0_SETUP.md, STEP_3_CREATE_FORM.md completed

---

## Files to Create

```
src/features/[feature-name]/
└── pages/
    └── [Feature]EditPage.tsx         ← Edit page (new)
```

**Note**: Reuses `[Feature]Form` from STEP_3

---

## Step 1: Create Edit Page

**File**: `src/features/[feature-name]/pages/[Feature]EditPage.tsx`

**Template**:
```typescript
import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormPageLayout, ActionBarDivider } from '@/shared/components'
import { ChevronLeft, X, Check } from 'lucide-react'
import [Feature]Form from '../components/[Feature]Form'
import { use[Feature]Detail, useUpdate[Feature] } from '../hooks/use[Features]'

export const [Feature]EditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const updateMutation = useUpdate[Feature]()
  const submitRef = useRef<(() => void) | null>(null)

  // ====== DATA FETCHING ======
  const { data, isLoading, error } = use[Feature]Detail(id!)

  // ====== EVENT HANDLERS ======
  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  // ====== ERROR STATE ======
  if (error || !data?.data) {
    return (
      <FormPageLayout
        formTitle="Không tìm thấy"
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
        <p className="text-center text-gray-600 py-8">
          [Đối tượng] không tồn tại hoặc đã bị xóa.
        </p>
      </FormPageLayout>
    )
  }

  const item = data.data

  // ====== RENDER ======
  return (
    <FormPageLayout
      title="Quản lý [đối tượng]"
      description="Quản lý tất cả [đối tượng] trong hệ thống"
      formTitle={`Chỉnh sửa: ${item.name}`}
      breadcrumbItems={[
        { label: 'Quản lý [đối tượng]', href: '/[feature-name]' },
        { label: 'Chỉnh sửa', current: true }
      ]}
      actionBarContent={
        <>
          {/* Navigation: Back */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/[feature-name]')}
            disabled={updateMutation.isPending || isLoading}
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
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <X className="w-4 h-4 text-blue-600" />
            Hủy
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending || isLoading}
            className="gap-2"
          >
            <Check className="w-4 h-4 text-blue-600" />
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      {/* Form Component */}
      <[Feature]Form
        initialData={item}
        onSuccess={() => navigate('/[feature-name]')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default [Feature]EditPage
```

**Key Differences from Create Page**:
- Uses `use[Feature]Detail(id)` to load data
- Passes `initialData={item}` to form
- Form title includes item name
- Checks for error/not found state
- Uses `updateMutation` instead of `createMutation`
- On success, redirects to list

---

## Step 2: Add Route

**File**: `src/app/router/routes.tsx`

```typescript
import { [Feature]EditPage } from '@/features/[feature-name]'

export const routes = [
  {
    path: '/[feature-name]/:id/edit',
    element: <[Feature]EditPage />,
  },
]
```

**Important**: `:id` in route must match what you pass to `useParams()`

---

## Step 3: Add Edit Navigation

Verify that list page and detail page navigate to edit correctly:

**In [Feature]ListPage.tsx**:
```tsx
// In table actions
{
  label: 'Sửa',
  icon: Edit,
  onClick: (row) => navigate(`/[feature-name]/${row.publicId}/edit`)
}
```

**In [Feature]DetailPage.tsx**:
```tsx
const handleEdit = () => {
  navigate(`/[feature-name]/${id}/edit`)
}
```

---

## Testing Checklist

- [ ] Edit page loads without errors
- [ ] Form populates with existing data
- [ ] Can modify all fields
- [ ] Validation still works
- [ ] Save button updates item in API
- [ ] Loading state shows during save
- [ ] Success redirects to list
- [ ] Updated item shows in list with new values
- [ ] Back/Cancel button works
- [ ] Error handling for not found
- [ ] Buttons disabled during loading

---

## See Also

- **Reference**: `src/features/organizations/pages/OrganizationEditPage.tsx`
- **Form Component**: `src/features/organizations/components/OrganizationForm.tsx`
- **Previous Step**: STEP_3_CREATE_FORM.md
- **Next Step**: STEP_5_DELETE.md
