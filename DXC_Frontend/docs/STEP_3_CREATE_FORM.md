# STEP 3: Create Form & Create Page

## Overview

Build the create form where users add new items:
- Form fields with validation
- Submit to API
- Success redirect
- Error handling

**Estimated time**: 45-60 minutes  
**Depends on**: STEP_0_SETUP.md completed

---

## Files to Create

```
src/features/[feature-name]/
├── components/
│   └── [Feature]Form.tsx             ← Form component (new)
└── pages/
    └── [Feature]CreatePage.tsx       ← Create page (new)
```

---

## Step 1: Create Form Component

**File**: `src/features/[feature-name]/components/[Feature]Form.tsx`

**Template**:
```typescript
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreate[Feature], useUpdate[Feature] } from '../hooks/use[Features]'

// ====== VALIDATION SCHEMA ======
// Define validation rules for form fields
const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được vượt quá 100 ký tự'),
  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional(),
  code: z
    .string()
    .optional(),
  // Add more fields as needed
})

type FormData = z.infer<typeof formSchema>

interface [Feature]FormProps {
  initialData?: any
  onSuccess?: () => void
  onSave?: (submit: () => void) => void
}

export const [Feature]Form = ({
  initialData,
  onSuccess,
  onSave,
}: [Feature]FormProps) => {
  const isEditing = !!initialData?.publicId
  const createMutation = useCreate[Feature]()
  const updateMutation = useUpdate[Feature]()

  // ====== FORM SETUP ======
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      code: initialData?.code || '',
    },
  })

  // ====== FORM SUBMISSION ======
  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        // Update existing
        await updateMutation.mutateAsync(
          { publicId: initialData.publicId, ...data },
          { onSuccess: () => onSuccess?.() }
        )
      } else {
        // Create new
        await createMutation.mutateAsync(data, {
          onSuccess: () => onSuccess?.(),
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  // ====== EXPOSE SUBMIT FUNCTION ======
  // This allows parent page to trigger submit from action bar
  React.useEffect(() => {
    onSave?.(() => form.handleSubmit(onSubmit)())
  }, [form, onSave])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ===== NAME FIELD ===== */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tên..."
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== DESCRIPTION FIELD ===== */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả..."
                  rows={4}
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ===== CODE FIELD ===== */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập mã (tuỳ chọn)..."
                  {...field}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add more fields as needed */}
      </form>
    </Form>
  )
}

export default [Feature]Form
```

**Key Points**:
- `z.object({})` defines form fields and validation
- `zodResolver` connects Zod to react-hook-form
- `defaultValues` populate form with existing data
- `isEditing` determines create vs update
- `onSave` callback exposes submit function to parent
- Required fields marked with red `*`
- Fields disabled while submitting

**Validation Examples**:
```tsx
// Text with min/max
name: z.string().min(2, 'Min 2').max(100, 'Max 100')

// Email
email: z.string().email('Invalid email')

// Number
age: z.number().min(18, 'Must be 18+')

// Optional
description: z.string().optional()

// Custom error message
name: z.string().refine(
  (val) => !val.includes('test'),
  'Name cannot contain "test"'
)
```

---

## Step 2: Create Page Component

**File**: `src/features/[feature-name]/pages/[Feature]CreatePage.tsx`

**Template**:
```typescript
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

  // ====== EVENT HANDLERS ======
  const handleSave = () => {
    if (submitRef.current) {
      submitRef.current()
    }
  }

  // ====== RENDER ======
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
      {/* Form Component */}
      <[Feature]Form
        onSuccess={() => navigate('/[feature-name]')}
        onSave={(submit) => {
          submitRef.current = submit
        }}
      />
    </FormPageLayout>
  )
}

export default [Feature]CreatePage
```

**Key Points**:
- `submitRef` captures submit function from form
- `handleSave` calls submit when user clicks Save
- Back/Cancel both go to list
- Buttons disabled during submission (`isPending`)
- Save button shows "Đang lưu..." while submitting
- Success redirects to list page

---

## Step 3: Add Route

**File**: `src/app/router/routes.tsx`

```typescript
import { [Feature]CreatePage } from '@/features/[feature-name]'

export const routes = [
  {
    path: '/[feature-name]/create',
    element: <[Feature]CreatePage />,
  },
]
```

---

## Testing Checklist

- [ ] Create page loads without errors
- [ ] All form fields display
- [ ] Required fields marked with `*`
- [ ] Can type in all fields
- [ ] Validation works (try empty name)
- [ ] Error messages show correctly
- [ ] Back button navigates to list
- [ ] Cancel button navigates to list
- [ ] Save button calls API
- [ ] Loading state shows during save
- [ ] Success redirects to list
- [ ] New item appears in list
- [ ] Error shows if API fails
- [ ] Form is disabled during submission

---

## See Also

- **Reference**: `src/features/organizations/pages/OrganizationCreatePage.tsx`
- **Form Component**: `src/features/organizations/components/OrganizationForm.tsx`
- **Shared Layout**: `src/shared/components/FormPageLayout.tsx`
- **Next Step**: STEP_4_EDIT_FORM.md
