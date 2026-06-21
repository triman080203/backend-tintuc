# STEP 1: Create List Page with Search & Pagination

## Overview

Build the list page where users see all items, with:
- Table display with columns
- Pagination (previous/next, page size)
- Search/filter with dialog
- Action bar with Create + Search buttons
- Loading and empty states

**Estimated time**: 45-60 minutes  
**Depends on**: STEP_0_SETUP.md completed

---

## Files to Create

```
src/features/[feature-name]/
├── components/
│   └── [Feature]Table.tsx            ← Table component (new)
└── pages/
    └── [Feature]ListPage.tsx         ← List page (new)
```

## Files to Modify

```
src/app/router/
├── routes.tsx                        ← Add list route
└── navigationConfig.ts               ← Add navigation item
```

---

## Step-by-Step Instructions

### Step 1: Create Table Component

**File**: `src/features/[feature-name]/components/[Feature]Table.tsx`

This component displays items in a table format using the shared `DataTable` component.

**Template**:
```typescript
import { useNavigate } from 'react-router-dom'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { DataTable, Column } from '@/shared/components'
import type { [Feature]TableRow } from '../types'

interface [Feature]TableProps {
  items: [Feature]TableRow[]
  isLoading?: boolean
  pagination: {
    current: number
    total: number
    pageSize: number
    onChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  onDelete?: (id: string) => void
}

export const [Feature]Table = ({
  items,
  isLoading,
  pagination,
  onDelete,
}: [Feature]TableProps) => {
  const navigate = useNavigate()

  // Define columns to display
  const columns: Column<[Feature]TableRow>[] = [
    {
      key: 'name',
      label: 'Tên',
      width: '200px',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Mô tả',
      width: '300px',
      render: (value) => value?.substring(0, 100) + (value?.length > 100 ? '...' : '') || '-',
    },
    {
      key: 'createdDate',
      label: 'Ngày tạo',
      width: '150px',
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    },
  ]

  // Define actions
  const actions = [
    {
      label: 'Xem',
      icon: Eye,
      onClick: (row: [Feature]TableRow) => {
        navigate(`/[feature-name]/${row.publicId}`)
      },
    },
    {
      label: 'Sửa',
      icon: Edit,
      onClick: (row: [Feature]TableRow) => {
        navigate(`/[feature-name]/${row.publicId}/edit`)
      },
    },
    {
      label: 'Xóa',
      icon: Trash2,
      variant: 'destructive',
      onClick: (row: [Feature]TableRow) => {
        onDelete?.(row.publicId)
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      actions={actions}
      pagination={pagination}
      rowKey="publicId"
      emptyState={{
        icon: null,
        title: 'Không có dữ liệu',
        description: 'Hãy tạo [đối tượng] đầu tiên của bạn',
      }}
    />
  )
}

export default [Feature]Table
```

**Key Points**:
- `columns` define what data to show and how to display
- `actions` define row action buttons (View, Edit, Delete)
- `width` controls column width
- `render` can transform data (format date, truncate text)
- `sortable: true` if backend supports sorting
- `actions` pass row data to navigate or delete

**Column Render Examples**:
```tsx
// Format date
{
  key: 'createdDate',
  render: (value) => new Date(value).toLocaleDateString('vi-VN')
}

// Truncate text
{
  key: 'description',
  render: (value) => value?.substring(0, 50) + '...' || '-'
}

// Custom component
{
  key: 'status',
  render: (value) => (
    <span className={value === 'active' ? 'text-green-600' : 'text-gray-600'}>
      {value}
    </span>
  )
}

// Show "-" if empty
{
  key: 'email',
  render: (value) => value || '-'
}
```

---

### Step 2: Create List Page Component

**File**: `src/features/[feature-name]/pages/[Feature]ListPage.tsx`

This page uses `ListPageLayout` and manages search/pagination state.

**Template**:
```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ListPageLayout, ActionBarDivider } from '@/shared/components'
import { usePagination } from '@/shared/hooks'
import { Plus, Search } from 'lucide-react'
import [Feature]Table from '../components/[Feature]Table'
import { use[Features], useDelete[Feature] } from '../hooks/use[Features]'

export const [Feature]ListPage = () => {
  const navigate = useNavigate()

  // ====== STATE MANAGEMENT ======
  
  // Pagination
  const { page, pageSize, setPage, setPageSize, getPaginationParams } = 
    usePagination(10)
  
  // Search
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)
  
  // ====== DATA FETCHING ======
  const { data, isLoading } = use[Features]({
    ...getPaginationParams(),
    Name: searchTerm || undefined,
    // Add more filters here
  })
  
  const deleteQuery = useDelete[Feature]()

  // ====== EVENT HANDLERS ======

  // Apply search
  const handleSearch = () => {
    setSearchTerm(tempSearchTerm)
    setPage(1) // Reset to page 1 when searching
    setIsSearchOpen(false)
  }

  // Cancel search
  const handleCancelSearch = () => {
    setTempSearchTerm(searchTerm)
    setIsSearchOpen(false)
  }

  // Toggle search dialog
  const handleOpenSearch = (open: boolean) => {
    if (open) {
      // When opening, set temp to current value
      setTempSearchTerm(searchTerm)
    }
    setIsSearchOpen(open)
  }

  // Delete item
  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa?')) {
      deleteQuery.mutate(id)
    }
  }

  // ====== RENDER ======
  return (
    <>
      {/* Main List Page */}
      <ListPageLayout
        title="Quản lý [đối tượng]"
        description="Quản lý tất cả [đối tượng] trong hệ thống"
        breadcrumbItems={[
          { label: 'Quản lý [đối tượng]', current: true }
        ]}
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
              onClick={() => handleOpenSearch(true)}
              className="gap-2"
            >
              <Search className="w-4 h-4 text-blue-600" />
              Tìm kiếm
            </Button>
          </>
        }
      >
        {/* Table Component */}
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
          onDelete={handleDelete}
        />
      </ListPageLayout>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={handleOpenSearch}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tìm kiếm [đối tượng]</DialogTitle>
          </DialogHeader>

          {/* Search Input */}
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

          {/* Dialog Actions */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelSearch}
            >
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

export default [Feature]ListPage
```

**Key Points**:
- `usePagination(10)` provides page/pageSize state (default 10 items per page)
- Search has two states: `searchTerm` (applied) and `tempSearchTerm` (in dialog)
- `getPaginationParams()` returns `{ Current, PageSize }` for API
- Search resets to page 1 (shows most recent results first)
- Delete shows confirmation before calling API
- `isLoading` shows spinner in table
- Empty state shows when no items

**Adding More Filters**:
```tsx
// In state
const [statusFilter, setStatusFilter] = useState('')

// In query
const { data } = use[Features]({
  ...getPaginationParams(),
  Name: searchTerm,
  Status: statusFilter,  // Add here
})

// In JSX
<Select value={statusFilter} onValueChange={setStatusFilter}>
  <SelectItem value="active">Hoạt động</SelectItem>
  <SelectItem value="inactive">Không hoạt động</SelectItem>
</Select>
```

---

### Step 3: Add Route

**File**: `src/app/router/routes.tsx`

Add list page route:

```typescript
import { [Feature]ListPage } from '@/features/[feature-name]'

export const routes = [
  // ... other routes
  {
    path: '/[feature-name]',
    element: <[Feature]ListPage />,
  },
  // ... more routes
]
```

**Placement**: Add after other feature routes, organize by feature.

---

### Step 4: Add Navigation Item

**File**: `src/app/router/navigationConfig.ts`

Add navigation menu item:

```typescript
{
  label: 'Quản lý [đối tượng]',
  href: '/[feature-name]',
  icon: 'Box',  // or other lucide icon name
  // icon: 'Users', 'Settings', 'FileText', etc.
}
```

**Icon Options**:
- `Users` - for user management
- `Box` - for general items
- `Settings` - for configuration
- `FileText` - for documents
- `Building2` - for organizations
- Any Lucide icon name

---

## Code Snippets

### Real Example: Organization List Page

**Location**: `src/features/organizations/pages/OrganizationListPage.tsx`

Main features:
- Uses `usePagination` hook
- Search with dialog
- Table with actions (View, Edit, Delete)
- ActionBarDivider for button separation
- Blue icons (`text-blue-600`)

### Real Example: Organization Table

**Location**: `src/features/organizations/components/OrganizationTable.tsx`

Shows:
- Column definitions (name, description, created date)
- Actions (eye, edit, trash icons)
- Navigation on row click
- Delete callback

---

## Common Issues & Solutions

### Issue 1: "Cannot find module" [Feature]Table

**Problem**: Import fails

**Solution**:
```tsx
// Check file exists: src/features/[feature-name]/components/[Feature]Table.tsx
// Check export: export const [Feature]Table = ...
// Check import path: import [Feature]Table from '../components/[Feature]Table'
```

### Issue 2: Search doesn't filter results

**Problem**: Typing in search doesn't change table

**Solution**:
1. Check API supports `Name` parameter (ask backend)
2. Verify `handleSearch()` is called and updates `searchTerm`
3. Check query params in Network tab (DevTools)

```tsx
// Debug: log query params
console.log('Query params:', { ...getPaginationParams(), Name: searchTerm })
```

### Issue 3: Pagination resets to page 1 unexpectedly

**Problem**: Clicking next page navigates back to page 1

**Solution**:
- Make sure `getPaginationParams()` is called correctly
- Check query key includes params: `queryKey: ['[features]', params]`
- Verify `onChange: setPage` is passed to DataTable

### Issue 4: Delete button doesn't work

**Problem**: Clicking delete does nothing

**Solution**:
1. Check `onDelete` prop is passed to Table:
```tsx
<[Feature]Table onDelete={handleDelete} />
```

2. Check `handleDelete` calls mutation:
```tsx
const handleDelete = (id: string) => {
  if (confirm('Chắc chứ?')) {
    deleteQuery.mutate(id)  // ← Call mutation
  }
}
```

3. Check `useDelete[Feature]` is implemented in hooks

### Issue 5: Search dialog closes but doesn't search

**Problem**: Dialog closes when clicking Search button but table doesn't update

**Solution**:
```tsx
const handleSearch = () => {
  setSearchTerm(tempSearchTerm)  // ← Must update searchTerm
  setPage(1)  // ← Reset pagination
  setIsSearchOpen(false)  // ← Then close dialog
}
```

---

## Testing Checklist

Before moving to next step:

- [ ] Page loads without errors
- [ ] List displays items from API
- [ ] Pagination buttons work (Previous/Next)
- [ ] Can change items per page (10/20/50)
- [ ] Page resets to 1 when navigating
- [ ] Search dialog opens when clicking Search button
- [ ] Can type in search input
- [ ] Pressing Enter searches
- [ ] Clicking Search button searches
- [ ] Table updates with search results
- [ ] Page resets to 1 after search
- [ ] Create button navigates to create page (`/[feature-name]/create`)
- [ ] View icon navigates to detail page (`/[feature-name]/{id}`)
- [ ] Edit icon navigates to edit page (`/[feature-name]/{id}/edit`)
- [ ] Delete button shows confirmation
- [ ] Delete removes item from list
- [ ] Toast notification shows on delete success
- [ ] Empty state shows when no items
- [ ] Loading spinner shows while fetching
- [ ] No console errors or warnings

---

## See Also

- **Reference Implementation**: 
  - List Page: `src/features/organizations/pages/OrganizationListPage.tsx`
  - Table: `src/features/organizations/components/OrganizationTable.tsx`
- **Shared Components**: `src/shared/components/ListPageLayout.tsx`
- **DataTable Docs**: `src/shared/components/DataTable.tsx`
- **Previous Step**: STEP_0_SETUP.md
- **Next Step**: STEP_2_DETAIL_PAGE.md

---

## Styling Notes

### ActionBar Styling (Automatic)

The `ListPageLayout` with `actionBarContent` automatically provides:
- Border: `border border-gray-200`
- Rounded corners: `rounded-lg`
- Shadow: `shadow-sm`
- Padding: `p-3`
- No additional styling needed

### Button Styling (Consistent)

All buttons follow this pattern:
```tsx
<Button
  variant="ghost"      // No filled background
  size="sm"           // Compact size
  className="gap-2"   // Space between icon and text
>
  <Icon className="w-4 h-4 text-blue-600" />
  Label
</Button>
```

### Icon Styling

Always add `text-blue-600` to icons:
```tsx
<Plus className="w-4 h-4 text-blue-600" />    // ✅ Correct
<Plus className="w-4 h-4" />                  // ❌ Wrong (no color)
<Plus className="w-4 h-4 text-red-600" />     // ❌ Wrong (wrong color)
```

### Table Styling

DataTable automatically provides:
- Blue header with white text
- Alternating row colors
- Hover effect on rows
- No additional styling needed

---

## Performance Tips

1. **Set appropriate staleTime**:
   - List pages: 5 minutes (shows fresh-ish data)
   - Detail pages: 5-10 minutes (user likely viewing one item)

2. **Lazy load long lists**:
   - Use pagination (10-25 items per page)
   - Avoid fetching thousands of items at once

3. **Debounce search** (advanced):
   ```tsx
   const [searchTerm, setSearchTerm] = useState('')
   
   const debouncedSearch = useCallback(
     debounce((term: string) => {
       setSearchTerm(term)
     }, 500),
     []
   )
   ```

4. **Use React.memo** for Table (advanced):
   ```tsx
   export const [Feature]Table = React.memo(({ items, isLoading, ... }) => {
     // ...
   })
   ```
