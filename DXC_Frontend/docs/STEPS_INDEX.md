# Feature Implementation Steps - Complete Guide

Complete step-by-step guide to add a new feature to DXC Frontend project.

**Total Time**: 2-3 hours  
**Final Result**: Full CRUD feature (Create, Read, Update, Delete)

---

## 📋 Overview

This guide walks you through building a complete feature with:
- List page with search & pagination
- Detail/view page
- Create form
- Edit form
- Delete functionality

## 🎯 Prerequisites

Before starting:
- [ ] Node.js and pnpm installed
- [ ] Project cloned and dependencies installed
- [ ] Familiar with React, TypeScript, react-router-dom
- [ ] API endpoints documented (from backend team)
- [ ] Backend API schema available (Swagger/OpenAPI)

---

## 📚 Complete Steps

### [STEP 0: Setup API & Feature Structure](./STEP_0_SETUP.md) (20-30 min)

**What you'll do**:
- Generate API types using Orval
- Create API call layer
- Setup data hooks (TanStack Query)
- Create feature folder structure

**Key files created**:
- `src/api/[feature-name].ts` - API calls
- `src/features/[feature-name]/hooks/use[Features].ts` - Data hooks
- `src/features/[feature-name]/types/index.ts` - Types

**Outcome**: Foundation for all other steps

---

### [STEP 1: Create List Page with Search & Pagination](./STEP_1_LIST_PAGE.md) (45-60 min)

**What you'll do**:
- Create table component to display items
- Implement pagination (next/previous, page size)
- Add search/filter with dialog
- Style action bar (Create + Search buttons)

**Key files created**:
- `src/features/[feature-name]/components/[Feature]Table.tsx`
- `src/features/[feature-name]/pages/[Feature]ListPage.tsx`

**Features**:
- ✅ List all items with pagination
- ✅ Search dialog with text input
- ✅ Create button (navigates to create page)
- ✅ Loading states
- ✅ Empty states

---

### [STEP 2: Create Detail Page](./STEP_2_DETAIL_PAGE.md) (30-40 min)

**What you'll do**:
- Create profile component for displaying details
- Setup detail page layout
- Add Back + Edit navigation buttons

**Key files created**:
- `src/features/[feature-name]/components/[Feature]Profile.tsx`
- `src/features/[feature-name]/pages/[Feature]DetailPage.tsx`

**Features**:
- ✅ View single item details
- ✅ Back button (returns to list)
- ✅ Edit button (navigates to edit page)
- ✅ 404 handling (not found state)

---

### [STEP 3: Create Form & Create Page](./STEP_3_CREATE_FORM.md) (45-60 min)

**What you'll do**:
- Create reusable form component with validation
- Setup create page
- Implement form submission

**Key files created**:
- `src/features/[feature-name]/components/[Feature]Form.tsx`
- `src/features/[feature-name]/pages/[Feature]CreatePage.tsx`

**Features**:
- ✅ Form with Zod validation
- ✅ Create new items
- ✅ Success notification & redirect
- ✅ Error handling

---

### [STEP 4: Create Edit Page](./STEP_4_EDIT_FORM.md) (20-30 min)

**What you'll do**:
- Create edit page component
- Load existing data into form
- Handle form submission for updates

**Key files created**:
- `src/features/[feature-name]/pages/[Feature]EditPage.tsx`

**Features**:
- ✅ Reuses form component from STEP_3
- ✅ Loads existing data
- ✅ Updates item on submit
- ✅ Redirects to list on success

---

### [STEP 5: Delete Functionality](./STEP_5_DELETE.md) (20-30 min)

**What you'll do**:
- Add delete buttons detail pages
- Implement confirmation dialogs
- Handle cache invalidation

**Key changes**:
- Add delete button to detail page
- Implement confirmation before delete

**Features**:
- ✅ Delete from detail page
- ✅ Confirmation before delete
- ✅ Success notification
- ✅ List refreshes after delete

---

### [STEP 6: Optional Image Upload](./STEP_6_UPLOAD_IMAGE_OPTIONAL.md) (30-45 min) **OPTIONAL**

**When to use**: Only if feature has image-related fields (`images[]`, `imageUrl`, etc.)

**What you'll do**:
- Create image URL utility
- Create image upload hook
- Create image uploader component (drag-drop)
- Create image gallery component (lightbox)
- Integrate into form (create/edit)
- Integrate into detail page

**Key files created**:
- `src/features/[feature-name]/utils/imageUrl.ts`
- `src/features/[feature-name]/hooks/use[Feature]ImageUpload.ts`
- `src/features/[feature-name]/components/[Feature]ImageUploader.tsx`
- `src/features/[feature-name]/components/ImageGallery.tsx`

**Features**:
- ✅ Drag-and-drop upload with validation
- ✅ File size enforcement (5MB max per image)
- ✅ Full-screen lightbox gallery
- ✅ Keyboard navigation (Escape, Arrow keys)
- ✅ Existing vs new image display
- ✅ Thumbnail strip navigation

---

## 🔄 Workflow

### Before Starting

1. **Identify feature scope**:
   - What data model? (Organization, User, Product, etc.)
   - What operations? (List, Create, Read, Update, Delete)
   - What filters/search? (By name, status, etc.)

2. **Get API documentation**:
   - Endpoints from backend team
   - Request/response formats
   - Filter parameters

3. **Set naming convention**:
   - Feature name: `[feature-name]` (lowercase, kebab-case)
   - Component names: `[Feature]` (PascalCase)
   - Folder: `src/features/[feature-name]/`

### During Implementation

1. **STEP 0**: Setup foundation (do this first)
2. **STEP 1**: Build list page (users need to see data)
3. **STEP 2**: Build detail page (enrich viewing experience)
4. **STEP 3**: Build create form (enable creation)
5. **STEP 4**: Build edit form (enable updates)
6. **STEP 5**: Add delete (cleanup functionality)
7. **STEP 6** (Optional): Add image upload (only if feature has images)

### After Each Step

- Run `npm run build` to verify no TypeScript errors
- Test in browser
- Check console for warnings/errors
- Verify functionality against checklist in each step

---

## 📁 Final Folder Structure

After all steps (STEP 0-5), your feature folder looks like:

```
src/features/[feature-name]/
├── pages/
│   ├── [Feature]ListPage.tsx
│   ├── [Feature]DetailPage.tsx
│   ├── [Feature]CreatePage.tsx
│   └── [Feature]EditPage.tsx
├── components/
│   ├── [Feature]Table.tsx
│   ├── [Feature]Form.tsx
│   └── [Feature]Profile.tsx
├── hooks/
│   └── use[Features].ts
├── types/
│   └── index.ts
└── index.ts

src/api/
└── [feature-name].ts
```

### With STEP 6 (Optional - If Feature Has Images)

Additional files:

```
src/features/[feature-name]/
├── utils/
│   └── imageUrl.ts                 ← URL builder utility
├── hooks/
│   └── use[Feature]ImageUpload.ts  ← Upload hook
└── components/
    ├── [Feature]ImageUploader.tsx  ← Uploader UI
    └── ImageGallery.tsx            ← Gallery lightbox
```

Plus routes in:
- `src/app/router/routes.tsx` (4 routes)
- `src/app/router/navigationConfig.ts` (1 nav item)

---

## 🎨 Shared Components Used

### Layout Components

- **ListPageLayout**: List page template
  - Breadcrumb, title, action bar, content
  - Requires: `actionBarContent` prop

- **DetailPageLayout**: Detail page template
  - Breadcrumb, card with title, action bar, content
  - Requires: `actionBarContent` prop

- **FormPageLayout**: Form page template
  - Breadcrumb, card with title, action bar, content
  - Requires: `actionBarContent` prop

### UI Components

- **DataTable**: Render table with columns, actions, pagination
- **Button**: Action buttons (Create, Edit, Delete, etc.)
- **Input**: Text input for search/forms
- **Textarea**: Multi-line text for forms
- **Dialog**: Search dialog, modals
- **Card**: Container for content

### Patterns

- **ActionBar**: Container for buttons
- **ActionBarDivider**: Separator between button groups
- **ActionBarContent**: Custom button groups defined by feature

---

## 🚀 Quick Reference

### Shared Hooks

```tsx
// Pagination management
const { page, pageSize, setPage, setPageSize, getPaginationParams } = usePagination(10)

// Delete confirmation
const deleteConfirm = useDeleteConfirm()

// Delete with ref pattern
const submitRef = useRef<(() => void) | null>(null)
```

### Common Patterns

**Search Dialog**:
```tsx
const [searchTerm, setSearchTerm] = useState('')
const [isSearchOpen, setIsSearchOpen] = useState(false)
const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm)

const handleSearch = () => {
  setSearchTerm(tempSearchTerm)
  setIsSearchOpen(false)
}
```

**Form Submission via Ref**:
```tsx
const submitRef = useRef<(() => void) | null>(null)

const handleSave = () => {
  submitRef.current?.()
}

// In form component
useEffect(() => {
  onSave?.(() => form.handleSubmit(onSubmit)())
}, [form, onSave])
```

**Navigation Buttons**:
```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={() => navigate('/path')}
  className="gap-2"
>
  <Icon className="w-4 h-4 text-blue-600" />
  Label
</Button>
```

---

## ✅ Checklist for Production Ready

- [ ] All STEP 0-5 completed
- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] List page: pagination works, search works
- [ ] Detail page: loads data, navigation works
- [ ] Create page: validation works, submit works
- [ ] Edit page: loads data, submit works
- [ ] Delete: confirmation shows, item deleted, list refreshes
- [ ] All toast notifications appear
- [ ] Error handling tested
- [ ] Mobile responsive
- [ ] Routes added to router
- [ ] Navigation added to menu
- [ ] Feature exported from barrel exports

---

## 🆘 Help & Reference

### Quick Links

- [Full Implementation Guide](./IMPLEMENT_GUIDE.md) - Conceptual overview
- [Organization Feature](../src/features/organizations/) - Real example
- [Shared Components](../src/shared/components/) - Layout components

### Common Questions

**Q: Where do I find API endpoints?**  
A: Ask backend team, or check `src/api/generated/` for generated types

**Q: How do I handle validation?**  
A: Use Zod schema in form component (see STEP_3)

**Q: How do I add more form fields?**  
A: Add to Zod schema and add FormField in form JSX (see STEP_3)

**Q: How do I add filters?**  
A: Add state in list page, pass to API query, add UI controls (see STEP_1)

**Q: Can I reorder steps?**  
A: STEP_0 must be first. Others can be flexible, but STEP_1 before others recommended

**Q: Can I modify shared components?**  
A: No, they're shared across features. Extend via props instead (ask team for help)

---

## 📊 Progress Tracking

Track your progress:

```
STEP 0: Setup API & Structure       [ ] Complete
STEP 1: List Page                   [ ] Complete
STEP 2: Detail Page                 [ ] Complete
STEP 3: Create Form                 [ ] Complete
STEP 4: Edit Form                   [ ] Complete
STEP 5: Delete                      [ ] Complete
STEP 6: Image Upload (if needed)    [ ] Complete (optional)

Testing & Verification:
[ ] Build passes
[ ] All features work
[ ] No console errors
[ ] Mobile responsive
[ ] Images upload/display correctly (if STEP 6)
[ ] Ready for PR
```

---

## 🎓 Learning Resources

**First time with this architecture?**
1. Read [IMPLEMENT_GUIDE.md](./IMPLEMENT_GUIDE.md) first
2. Study [Organization feature](../src/features/organizations/) implementation
3. Follow these steps in order
4. Reference specific step when stuck

**Need help?**
- Check "Common Issues" section in each step file
- Look at Organization feature for reference
- Ask team lead or senior developer

---

## 🚀 Next Steps After Completion

After completing this feature:

1. **Code Review**: Submit PR for code review
2. **Testing**: QA tests the feature
3. **Refactor**: Apply same pattern to other features
4. **Optimize**: Add advanced features (bulk actions, exports, etc.)
5. **Document**: Document feature-specific business logic

---

## 📝 Notes

- Times are estimates, may vary based on experience
- All examples use placeholder names - replace with actual feature names
- Organization feature is the reference implementation
- Ask if anything is unclear

**Happy coding! 🎉**
