# Feature: Quản lý Phản ánh (Feedback Management)

## 📋 Tổng quan

Feature quản lý phản ánh với workflow hoàn chỉnh từ tạo mới → điều phối → xử lý → phê duyệt → công khai.

## 🔄 Workflow

```
1. TẠO MỚI (Draft)
   ↓ Admin/User tạo phản ánh
   
2. ĐIỀU PHỐI (Assign)
   ↓ Admin chỉ định phòng ban xử lý
   
3. XỬ LÝ (Processing)
   ↓ Phòng ban tạo response + đính kèm files
   
4. CHỜ DUYỆT (Pending Approval)
   ↓ Chuyển trạng thái chờ phê duyệt
   
5. PHÊ DUYỆT (Approval)
   ↓ Lãnh đạo approve/reject
   
6. CÔNG KHAI (Published)
   ↓ Hiển thị công khai
```

## 📁 Cấu trúc thư mục

```
src/features/feedback/
├── components/          # UI Components (Phase 3)
├── hooks/              # Custom Hooks ✅
│   ├── useFeedbackList.ts
│   ├── useFeedbackMutations.ts
│   ├── useFeedbackProcessing.ts
│   └── useFeedbackApproval.ts
├── pages/              # Pages (Phase 4)
├── schemas/            # Validation Schemas ✅
│   ├── feedbackSchema.ts
│   └── responseSchema.ts
├── types/              # TypeScript Types ✅
└── index.ts            # Main exports
```

## 🎣 Hooks Usage

### 1. Query Hooks (Fetching Data)

#### `useFeedbackList(params)`
Lấy danh sách phản ánh với pagination và filtering.

```typescript
import { useFeedbackList } from '@/features/feedback'

const { data, isLoading, error } = useFeedbackList({
  Current: 1,
  PageSize: 10,
  Title: 'search query',
  StatusCode: 'PROCESSING',
  DepartmentId: 123,
  IsPublic: true,
})

// data.data[] - Array of FeedbackAdminDto
// data.total - Total count
// data.current - Current page
// data.pageSize - Page size
```

#### `useFeedbackDetail(publicId, enabled)`
Lấy chi tiết phản ánh theo publicId.

```typescript
import { useFeedbackDetail } from '@/features/feedback'

const { data, isLoading } = useFeedbackDetail('feedback-uuid-here')

// data.data - FeedbackDetailDto with attachments, processings, responses
```

#### `usePendingApprovalList(params)`
Lấy danh sách phản hồi cần phê duyệt.

```typescript
import { usePendingApprovalList } from '@/features/feedback'

const { data, isLoading } = usePendingApprovalList({
  Current: 1,
  PageSize: 10,
  DepartmentId: 123,
})
```

#### `useApprovedList(params)`
Lấy danh sách phản hồi đã được phê duyệt.

```typescript
import { useApprovedList } from '@/features/feedback'

const { data } = useApprovedList({ Current: 1, PageSize: 10 })
```

---

### 2. Mutation Hooks (Modifying Data)

#### `useCreateFeedback()`
Tạo phản ánh mới.

```typescript
import { useCreateFeedback } from '@/features/feedback'

const createMutation = useCreateFeedback()

const handleCreate = (formData) => {
  createMutation.mutate({
    title: 'Tiêu đề phản ánh',
    content: 'Nội dung chi tiết',
    fullName: 'Nguyễn Văn A',
    phoneNumber: '0912345678',
    location: 'Hà Nội',
    isPublic: false,
    attachmentPublicIds: ['file-uuid-1', 'file-uuid-2'],
  })
}

// Auto navigate to detail page on success
// Auto invalidate feedback-list query
```

#### `useUpdateFeedback()`
Cập nhật thông tin phản ánh.

```typescript
import { useUpdateFeedback } from '@/features/feedback'

const updateMutation = useUpdateFeedback()

updateMutation.mutate({
  publicId: 'feedback-uuid',
  title: 'Tiêu đề mới',
  content: 'Nội dung mới',
  // ... other fields
})
```

#### `useDeleteFeedback()`
Xóa phản ánh (soft delete).

```typescript
import { useDeleteFeedback } from '@/features/feedback'

const deleteMutation = useDeleteFeedback()

deleteMutation.mutate('feedback-uuid')
// Auto navigate to /feedback on success
```

#### `useAssignFeedback()`
Điều phối phản ánh cho phòng ban xử lý.

```typescript
import { useAssignFeedback } from '@/features/feedback'

const assignMutation = useAssignFeedback()

assignMutation.mutate({
  feedbackPublicId: 'feedback-uuid',
  departmentId: 123,
  toStatusId: 2, // Status: ASSIGNED
  processingNote: 'Chuyển phòng Công thương xử lý',
})
```

#### `useProcessFeedback()`
Cập nhật trạng thái phản ánh trong quá trình xử lý.

```typescript
import { useProcessFeedback } from '@/features/feedback'

const processMutation = useProcessFeedback()

processMutation.mutate({
  feedbackPublicId: 'feedback-uuid',
  fromStatusId: 2, // Current status
  toStatusId: 3, // New status: PROCESSING
  processingNote: 'Đang xử lý',
})
```

#### `useCreateFeedbackResponse()`
Tạo phản hồi cho phản ánh (kết quả xử lý của phòng ban).

```typescript
import { useCreateFeedbackResponse } from '@/features/feedback'

const createResponseMutation = useCreateFeedbackResponse()

createResponseMutation.mutate({
  feedbackPublicId: 'feedback-uuid',
  data: {
    responseContent: 'Kết quả xử lý từ phòng ban...',
    filePublicIds: ['result-file-uuid-1', 'result-file-uuid-2'],
  },
})
```

#### `useUpdateFeedbackResponse()`
Cập nhật phản hồi đã tạo.

```typescript
import { useUpdateFeedbackResponse } from '@/features/feedback'

const updateResponseMutation = useUpdateFeedbackResponse()

updateResponseMutation.mutate({
  responseId: 123,
  data: {
    responseContent: 'Nội dung phản hồi đã chỉnh sửa',
    filePublicIds: ['updated-file-uuid'],
  },
})
```

#### `useApproveFeedbackResponse()`
Phê duyệt phản hồi của phòng ban (Lãnh đạo).

```typescript
import { useApproveFeedbackResponse } from '@/features/feedback'

const approveMutation = useApproveFeedbackResponse()

approveMutation.mutate({
  responseId: 123,
  data: {
    approvalNote: 'Đồng ý công khai',
  },
})
```

#### `useRejectFeedbackResponse()`
Từ chối phản hồi của phòng ban (Lãnh đạo).

```typescript
import { useRejectFeedbackResponse } from '@/features/feedback'

const rejectMutation = useRejectFeedbackResponse()

rejectMutation.mutate({
  responseId: 123,
  data: {
    rejectionReason: 'Cần bổ sung thêm thông tin kết quả xử lý',
  },
})
```

---

## 📝 Validation Schemas

### `feedbackSchema`
Validation cho form tạo/sửa phản ánh.

```typescript
import { feedbackSchema, type FeedbackFormData } from '@/features/feedback'

const form = useForm<FeedbackFormData>({
  resolver: zodResolver(feedbackSchema),
  defaultValues: {
    title: '',
    content: '',
    fullName: '',
    phoneNumber: '',
    location: '',
    isPublic: false,
  },
})
```

### `assignFeedbackSchema`
Validation cho form điều phối.

```typescript
import { assignFeedbackSchema, type AssignFeedbackFormData } from '@/features/feedback'
```

### `feedbackResponseSchema`
Validation cho form tạo phản hồi.

```typescript
import { feedbackResponseSchema, type FeedbackResponseFormData } from '@/features/feedback'
```

### `approveFeedbackResponseSchema`
Validation cho form phê duyệt.

```typescript
import { approveFeedbackResponseSchema, type ApproveFeedbackResponseFormData } from '@/features/feedback'
```

---

## 🎨 Types & Constants

### Status Codes

```typescript
import { FeedbackStatusCodes, getStatusColor } from '@/features/feedback'

console.log(FeedbackStatusCodes.DRAFT)             // 'DRAFT'
console.log(FeedbackStatusCodes.ASSIGNED)          // 'ASSIGNED'
console.log(FeedbackStatusCodes.PROCESSING)        // 'PROCESSING'
console.log(FeedbackStatusCodes.PENDING_APPROVAL)  // 'PENDING_APPROVAL'
console.log(FeedbackStatusCodes.APPROVED)          // 'APPROVED'
console.log(FeedbackStatusCodes.PUBLISHED)         // 'PUBLISHED'

// Get color for status badge
const color = getStatusColor('PROCESSING') // 'cyan'
```

### TypeScript Types

```typescript
import type {
  FeedbackAdminDto,
  FeedbackDetailDto,
  FeedbackResponseDto,
  CreateFeedbackDto,
  // ... more types
} from '@/features/feedback'
```

---

## ✅ Auto Features

Tất cả hooks đã có sẵn các tính năng:

- ✅ **Auto Toast Notifications**: Success/Error messages
- ✅ **Auto Query Invalidation**: Tự động refetch data sau mutations
- ✅ **Auto Navigation**: Redirect sau create/delete
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Loading States**: Built-in với TanStack Query
- ✅ **Caching**: Smart caching với staleTime
- ✅ **TypeScript**: Full type safety

---

## 📊 Progress

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Completed | Cấu trúc thư mục |
| Phase 2 | ✅ Completed | Hooks & API integration |
| Phase 3 | 🔄 Next | Components implementation |
| Phase 4 | ⏳ Pending | Pages implementation |
| Phase 5 | ⏳ Pending | Routing & Navigation |
| Phase 6 | ⏳ Pending | Advanced features |

---

## 🚀 Next Steps

1. **Phase 3**: Implement components (FeedbackTable, FeedbackForm, etc.)
2. **Phase 4**: Implement pages using components and hooks
3. **Phase 5**: Add routes to router
4. **Phase 6**: File upload integration, role-based access control

---

## 📚 References

- API Endpoints: `src/api/endpoints/feedback-*.ts`
- API Models: `src/api/models/`
- Users Feature: `src/features/users/` (template reference)
