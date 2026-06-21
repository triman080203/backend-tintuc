# Feature: Identity

Module này chịu trách nhiệm quản lý tất cả các chức năng liên quan đến **Xác thực Người dùng**.

## Các chức năng chính

* `Register.cs`: Đăng ký người dùng mới.
* `Login.cs`: Đăng nhập và tạo JWT.
* `GetCurrentUser.cs`: Lấy thông tin người dùng đang đăng nhập dựa trên token.

## Controller

Các chức năng của module này được cung cấp qua `IdentityController.cs`.