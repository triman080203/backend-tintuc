
using System;

namespace DXC_Core.API.Features.Files;

/// <summary>
/// DTO trả về cho mỗi file được upload, tương thích với Ant Design Upload component.
/// </summary>
public class UploadFileResponseDto
{
    /// <summary>
    /// ID duy nhất cho file ở phía client (sử dụng PublicId của file).
    /// </summary>
    public Guid Uid { get; set; }

    /// <summary>
    /// PublicId của file trong database, dùng để liên kết sau này.
    /// </summary>
    public Guid PublicId { get; set; }

    /// <summary>
    /// Tên file gốc.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Trạng thái upload, mặc định là "done" vì API chỉ trả về khi đã hoàn tất.
    /// </summary>
    public string Status { get; set; } = "done";

    /// <summary>
    /// URL để truy cập/tải file.
    /// </summary>
    public required string Url { get; set; }
}
