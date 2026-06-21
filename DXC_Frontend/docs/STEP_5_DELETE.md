# STEP 5: Delete Functionality

## Overview

Add delete capability to your feature:
- Delete button in detail pages
- Confirmation dialog before delete
- Cache invalidation
- Success feedback

**Estimated time**: 20-30 minutes  
**Depends on**: All previous steps completed

---

## Overview of Implementation

Delete functionality uses the `useDelete[Feature]` hook (created in STEP_0).

One places to add delete:
1. **Detail Page** - Delete from action bar


## Step 1: Add Delete to Detail Page

**File**: `src/features/[feature-name]/pages/[Feature]DetailPage.tsx`

Add delete button in action bar:

```typescript
import { useRef } from 'react'
import { ChevronLeft, Edit, Trash2 } from 'lucide-react'
import { useDelete[Feature] } from '../hooks/use[Features]'

export const [Feature]DetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const deleteQuery = useDelete[Feature]()
  const confirmRef = useRef<boolean>(false)

  const handleDelete = () => {
    if (confirm('Bạn có chắc muốn xóa? Hành động này không thể hoàn tác.')) {
      deleteQuery.mutate(id!, {
        onSuccess: () => {
          navigate('/[feature-name]')  // Redirect after delete
        },
      })
    }
  }

  return (
    <DetailPageLayout
      actionBarContent={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/[feature-name]')}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
            Quay lại
          </Button>
          
          <ActionBarDivider />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="gap-2"
          >
            <Edit className="w-4 h-4 text-blue-600" />
            Chỉnh sửa
          </Button>

          {/* Delete Button - Red variant */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteQuery.isPending}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            Xóa
          </Button>
        </>
      }
    >
      {/* ... */}
    </DetailPageLayout>
  )
}
```

**Key Points**:
- Delete button has red color (`text-red-600`)
- Shows confirmation before deleting
- On success, redirects to list
- Disabled while deleting (`isPending`)

---

## Delete Confirmation Dialog (Advanced)

For better UX, use a dedicated dialog instead of `confirm()`:

```typescript
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const [Feature]DetailPage = () => {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const deleteQuery = useDelete[Feature]()

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteQuery.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      })
    }
  }

  return (
    <>
      {/* ... Detail page JSX ... */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa [đối tượng]?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. [Đối tượng] sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteQuery.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteQuery.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
```

**Benefits**:
- ✅ Better UX than browser confirm()
- ✅ Shows warning message
- ✅ Can add extra info (e.g., "cannot undo")
- ✅ Styled consistently with app

---

## Testing Checklist

### Detail Page Delete

- [ ] Delete button shows in action bar
- [ ] Delete button is red
- [ ] Confirmation dialog shows
- [ ] Page redirects to list on success
- [ ] Success toast appears
- [ ] Error handling works

### Cache Management

- [ ] List refreshes after delete (queries invalidated)
- [ ] Detail page queries updated
- [ ] No stale data shown

---

## Common Issues & Solutions

### Issue 1: Delete doesn't refresh list

**Problem**: Item deleted but still shows in list

**Solution**:
1. Check `useDelete[Feature]` calls `queryClient.invalidateQueries()`
2. Verify queryKey matches: `['[features]']` (must match list query key)
3. Check browser DevTools React Query tab

```tsx
// In hook
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['[features]'] })  // ← Must match
}
```

### Issue 2: Delete button is disabled after one delete

**Problem**: Delete button disabled even after successful delete

**Solution**: Check mutation isn't in error state:
```tsx
<Button
  disabled={deleteQuery.isPending || deleteQuery.isError}  // ← Remove isError
>
```

Better approach - reset after success:
```tsx
onSuccess: () => {
  setDeleteId(null)  // Reset state
  queryClient.invalidateQueries({ queryKey: ['[features]'] })
}
```

### Issue 3: Confirmation never shows

**Problem**: No dialog before delete

**Solution**:
```tsx
const handleDelete = (id: string) => {
  // Need to add confirmation
  if (confirm('Chắc không?')) {
    deleteQuery.mutate(id)
  }
}
```

### Issue 4: Redirect doesn't work after delete

**Problem**: Delete succeeds but page doesn't navigate

**Solution**:
```tsx
deleteQuery.mutate(id, {
  onSuccess: () => {
    navigate('/[feature-name]')  // ← Add this
  },
})
```

---

## Styling Notes

### Delete Button Colors

```tsx
// In List - delete action (table row)
<Icon className="w-4 h-4 text-red-600" />

// In Detail - delete button
<Button variant="ghost" className="text-red-600">
  <Trash2 className="w-4 h-4" />
</Button>
```

### Confirmation Dialog

```tsx
// Dialog action button (confirm delete)
<AlertDialogAction className="bg-red-600 hover:bg-red-700">
  Xóa
</AlertDialogAction>
```

---

## See Also

- **Reference**: `src/features/organizations/` (delete implementation)
- **API Layer**: `src/api/organizations.ts` (delete API call)
- **Hooks**: `src/features/organizations/hooks/useOrganizations.ts` (delete hook)
- **Previous Steps**: STEP_1 through STEP_4
- **Full Implementation Guide**: docs/IMPLEMENT_GUIDE.md

---

## Congratulations! 🎉

You've completed the full CRUD implementation:
- ✅ STEP_0: Setup API & structure
- ✅ STEP_1: List page with search
- ✅ STEP_2: Detail page
- ✅ STEP_3: Create form
- ✅ STEP_4: Edit form
- ✅ STEP_5: Delete functionality

Your feature is now production-ready!

**Next Steps**:
- Test all functionality end-to-end
- Add additional filters if needed
- Implement advanced features (bulk actions, exports, etc.)
- Refactor other features to use same pattern
