# AGENTS.md - Hướng dẫn cho AI Agents

Tài liệu này định nghĩa các quy tắc bắt buộc cho tất cả AI agents khi làm việc với DXC_Frontend project.

---

## 1. Tuân thủ Nghiêm Ngặt Hướng Dẫn trong `/docs`

### Bắt buộc

Khi thực hiện bất kỳ nhiệm vụ nào liên quan đến feature implementation, **PHẢI** tuân thủ **100%** các hướng dẫn chi tiết trong thư mục `/docs`:

```
docs/
├── STEP_0_SETUP.md              # API setup, hooks, folder structure
├── STEP_1_LIST_PAGE.md          # List page: ListPageLayout, DataTable, search, pagination
├── STEP_2_DETAIL_PAGE.md        # Detail page: DetailPageLayout, back + edit buttons
├── STEP_3_CREATE_FORM.md        # Create form: FormPageLayout, submitRef pattern
├── STEP_4_EDIT_FORM.md          # Edit form: reuse form component
├── STEP_5_DELETE.md             # Delete functionality with confirmation
├── STEPS_INDEX.md               # Overview and workflow
└── IMPLEMENT_GUIDE.md           # Generic implementation guide with placeholders
```

### Nguyên tắc

- **Không** tự ý thay đổi hoặc "cải thiện" pattern từ tài liệu
- **Không** thêm các component hay logic không được đề cập trong STEP files
- **Không** sử dụng các UI component khác ngoài danh sách recommend
- **Không** thay đổi styling, icons, button variants từ tài liệu

### Ví dụ Tuân Thủ

✅ **Đúng:**
- STEP_1: Sử dụng `ChevronLeft` icon cho back button
- STEP_1: Button style `variant="ghost" size="sm" className="gap-2"`
- STEP_1: Icons màu `text-blue-600`
- STEP_3: Sử dụng `submitRef` pattern để expose submit function

❌ **Sai:**
- Dùng `ArrowLeft` thay vì `ChevronLeft`
- Dùng `variant="outline"` thay vì `variant="ghost"`
- Dùng icon màu `text-gray-600` thay vì `text-blue-600`
- Implement form submission logic trực tiếp trong page component

---

## 2. Luôn Chạy Build và Lint Sau Mỗi Step

### Bắt buộc

Sau mỗi bước hoặc nhóm thay đổi liên quan, **PHẢI**:

#### 2.1 Chạy TypeScript Compiler

```bash
pnpm run build
```

**Yêu cầu:**
- ✅ 0 errors
- ✅ Build hoàn thành thành công ("✓ built in X.XXs")
- ❌ Không chấp nhận warnings hoặc errors

**Nếu có lỗi:**
1. Dừng ngay
2. Phân tích lỗi chi tiết
3. Fix tất cả lỗi
4. Chạy lại build để xác nhận
5. **Không** commit nếu build fail

#### 2.2 Kiểm Tra Type Safety

```bash
pnpm run build
```

Xác nhận:
- ✅ Tất cả TypeScript types chính xác
- ✅ Không có `any` types không cần thiết
- ✅ Imports/exports đúng
- ✅ Props types match usage

### Quy Trình

```
Thay đổi code
    ↓
pnpm run build
    ↓
Lỗi? → Fix → Chạy lại build
    ↓
Không lỗi
    ↓
Code Ready
```

### Ví Dụ

```
1. Create RoleTable.tsx
2. pnpm run build → Error: Column import không đúng
3. Fix: import type { Column }
4. pnpm run build → ✓ Success
5. Tiếp tục step tiếp theo
```

---

## 3. Không Tự Commit - Để Người Dùng Tự Commit

### Bắt buộc

**KHÔNG** chạy `git commit` hoặc `git push` tự động. Tất cả commits phải do người dùng quyết định.

### Quy Trình

```
Hoàn thành thay đổi
    ↓
pnpm run build → ✓ Success
    ↓
Tạo summary chi tiết
    ↓
IN RA: "Ready for commit. Người dùng có thể chạy:"
    ↓
git status
git diff
git add -A && git commit -m "..."
```

### Không Làm

❌ **Không** chạy:
- `git commit -m "..."`
- `git push`
- `git push --force`
- Bất kỳ git command nào có side effect

### Làm

✅ **Thay vào đó:**

1. **Hiển thị status:**
   ```
   git status
   ```

2. **Hiển thị changes:**
   ```
   git diff
   ```

3. **Cung cấp commit message suggestion:**
   ```
   Suggested commit:
   git add -A
   git commit -m "feat(roles): implement STEP_1 list page
   
   - Created RoleTable with DataTable
   - Refactored RoleListPage with ListPageLayout
   - Added search dialog pattern
   - Implemented pagination with usePagination
   
   Build: ✓ Passes"
   ```

4. **Hỏi người dùng:**
   > "Sẵn sàng để commit. Bạn có muốn tôi tiếp tục với bước tiếp theo không?"

### Lý Do

- **Control**: Người dùng kiểm soát commit history
- **Review**: Người dùng có cơ hội review trước khi commit
- **Traceability**: Mỗi commit là quyết định có ý thức
- **Safety**: Không có unexpected pushes

---

## 4. Tóm Tắt Quy Tắc

| Quy tắc | Làm | Không Làm |
|---------|-----|-----------|
| **Docs** | Tuân thủ 100% STEP files | Thay đổi pattern, icons, styling |
| **Build** | Chạy build sau mỗi step | Commit với build errors |
| **Commit** | Provide suggestions | Chạy git commit tự động |
| **Icons** | ChevronLeft, Check, X | ArrowLeft, Save, Plus |
| **Buttons** | `variant="ghost" text-blue-600` | Các style khác |
| **Layout** | ListPageLayout, FormPageLayout | Custom layouts |

---

## 5. Workflow Tiêu Chuẩn

### Ví Dụ: Implement STEP_1 List Page

```
1. Read STEP_1_LIST_PAGE.md chi tiết
   ↓
2. Create RoleTable.tsx theo template
   ↓
3. pnpm run build → Check errors
   ↓
4. Create RoleListPage.tsx theo template
   ↓
5. pnpm run build → Check errors
   ↓
6. Add route trong AppRoutes.tsx
   ↓
7. pnpm run build → Final check
   ↓
8. Show status: 
   - git status
   - git diff
   ↓
9. Suggest commit message
   ↓
10. Hỏi: "Ready? Bạn có muốn commit?"
   ↓
11. Chờ người dùng commit hoặc request tiếp tục
```

---

## 6. Checklist Trước Khi Hoàn Thành

- [ ] Tất cả thay đổi tuân thủ docs
- [ ] `pnpm run build` pass (0 errors)
- [ ] Không có unused imports
- [ ] Tất cả types chính xác
- [ ] Icons màu `text-blue-600`
- [ ] Buttons style nhất quán
- [ ] Error states được handle
- [ ] Loading states được show
- [ ] Not created any accidental files
- [ ] Ready summary được prepare

---

**Ngày cập nhật**: 2025  
**Version**: 1.0  
**Áp dụng cho**: Tất cả AI agents làm việc với DXC_Frontend

