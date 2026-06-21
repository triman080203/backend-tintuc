# Hướng dẫn về Features (Vertical Slices)

Thư mục `Features` là nơi chứa toàn bộ logic nghiệp vụ của ứng dụng, được tổ chức theo kiến trúc **Vertical Slice**.

## Nguyên tắc Thiết kế

1.  **Tổ chức theo Nghiệp vụ:** Mỗi thư mục con đại diện cho một chức năng nghiệp vụ hoặc một domain (ví dụ: `Identity`, `Places.Restaurants`).
2.  **Tính Đóng gói:** Mỗi "slice" (file `.cs` như `Login.cs`, `CreateRole.cs`) là một đơn vị độc lập, chứa đựng tất cả những gì cần thiết cho một hành động:
    * **Request Object:** Lớp `Command` (cho hành động ghi) hoặc `Query` (cho hành động đọc).
    * **Validator:** Lớp `Validator` (sử dụng FluentValidation) để xác thực request.
    * **Handler:** Lớp `Handler` (sử dụng MediatR) chứa logic xử lý chính.
3.  **Controller "mỏng":** Logic không nằm trong `Controller`. `Controller` chỉ có vai trò điều phối request tới MediatR.
4.  **Phản hồi Chuẩn hóa:** Mọi `Handler` **BẮT BUỘC** phải trả về đối tượng `ApiResponse<T>`.

## Quy trình Tạo Feature Mới

1.  **Tạo Thư mục Feature:** Nếu chưa có, tạo thư mục theo quy ước `[DomainPrefix].[FeatureName]`.
2.  **Tạo file Slice:** Tạo một file C# cho mỗi hành động (ví dụ: `GetRoles.cs`, `UpdateRole.cs`).
3.  **Triển khai CQRS:** Bên trong file, định nghĩa các lớp `Query`/`Command`, `Validator`, và `Handler`.
4.  **Thêm Endpoint:** Mở `Controller` tương ứng, thêm một action method để tiếp nhận request và gọi `_sender.Send(command)`.

Tham khảo file quy tắc chính tại `/.trae/rules/project_rules.md` để xem quy trình đầy đủ.