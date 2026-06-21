using DXC_Core.API.Data.FileContext;
using FileModel = DXC_Core.API.Data.FileContext.Models;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using System.Security.Claims;

namespace DXC_Core.API.Features.Files;

public static class UploadFiles
{
    public class Command : IRequest<ApiResult<List<UploadFileResponseDto>>>
    {
        public required List<IFormFile> Files { get; set; }
        public Guid? EntityPublicId { get; set; }
        public int? EntityId { get; set; }
        public string? EntityType { get; set; }
        public string? Description { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private static readonly HashSet<string> AllowedContentTypes = new()
        {
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/svg+xml",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
        private static readonly HashSet<string> AllowedExtensions = new()
        {
            ".jpg", ".jpeg", ".png", ".webp", ".svg",
            ".pdf", ".doc", ".docx"
        };
        public Validator()
        {
            RuleFor(c => c.Files)
                .NotEmpty()
                .WithMessage("Danh sách file không được để trống.");

            RuleForEach(c => c.Files)
                .NotNull()
                .WithMessage("File không được null.")
                .Must(file => file.Length > 0)
                .WithMessage("File không được rỗng.")
                .Must(file => file.Length <= 10 * 1024 * 1024) // 10MB
                .WithMessage("Kích thước file không được vượt quá 10MB.")
                .Must(file =>
                {
                    var hasContentType = !string.IsNullOrEmpty(file.ContentType);
                    var contentTypeOk = hasContentType && AllowedContentTypes.Contains(file.ContentType);
                    var ext = Path.GetExtension(file.FileName)?.ToLowerInvariant();
                    var extensionOk = !string.IsNullOrEmpty(ext) && AllowedExtensions.Contains(ext);
                    return contentTypeOk || extensionOk;
                })
                .WithMessage("Loại file không hợp lệ. Chỉ cho phép: hình ảnh (jpg, png, webp, svg), PDF, DOC, DOCX.");

            RuleFor(c => c.EntityType)
                .NotEmpty()
                .When(c => c.EntityId.HasValue || c.EntityPublicId.HasValue)
                .WithMessage("EntityType không được để trống khi có EntityId hoặc EntityPublicId.")
                .MaximumLength(100)
                .WithMessage("EntityType không được vượt quá 100 ký tự.");

            RuleFor(c => c.Description)
                .MaximumLength(500)
                .WithMessage("Mô tả không được vượt quá 500 ký tự.");
        }
    }

}

public class UploadFilesHandler(FileDbContext dbContext, IWebHostEnvironment environment, IHttpContextAccessor httpContextAccessor) : IRequestHandler<UploadFiles.Command, ApiResult<List<UploadFileResponseDto>>>
{
    public async Task<ApiResult<List<UploadFileResponseDto>>> Handle(UploadFiles.Command request, CancellationToken cancellationToken)
    {
        // Lấy user ID từ JWT token
        var userIdString = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        int? uploadedById = null;

        if (!string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out var userId))
        {
            uploadedById = userId;
        }

        var responseDtos = new List<UploadFileResponseDto>();
        var uploadPath = Path.Combine(environment.WebRootPath ?? environment.ContentRootPath, "uploads");

        // Tạo thư mục uploads nếu chưa tồn tại
        if (!Directory.Exists(uploadPath))
        {
            Directory.CreateDirectory(uploadPath);
        }

        foreach (var file in request.Files)
        {
            // Tạo tên file unique để tránh trùng lặp
            var storedFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var physicalFilePath = Path.Combine(uploadPath, storedFileName);

            // Lưu file vật lý
            using (var stream = new FileStream(physicalFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream, cancellationToken);
            }

            // Tạo entity File - Lưu đường dẫn tương đối
            var fileEntity = new FileModel.File
            {
                PublicId = Guid.NewGuid(), // Tạo PublicId mới cho file
                FileName = file.FileName,
                StoredFileName = storedFileName,
                // Lưu đường dẫn tương đối từ thư mục gốc web
                FilePath = Path.Combine("uploads", storedFileName).Replace('\\', '/'), // Đảm bảo dấu phân cách là "/"
                FileSize = file.Length,
                ContentType = file.ContentType ?? "application/octet-stream",
                EntityId = request.EntityId,
                EntityPublicId = request.EntityPublicId,
                EntityType = request.EntityType,
                Description = request.Description,
                Ordinal = responseDtos.Count + 1,
                UploadedById = uploadedById // Tự động điền user ID
            };

            dbContext.Files.Add(fileEntity);
            await dbContext.SaveChangesAsync(cancellationToken);

            responseDtos.Add(new UploadFileResponseDto
            {
                Uid = fileEntity.PublicId,
                PublicId = fileEntity.PublicId,
                Name = fileEntity.FileName,
                Status = "done",
                Url = $"/api/files/{fileEntity.PublicId}"
            });
        }

        return new ApiResult<List<UploadFileResponseDto>>
        {
            Success = true,
            Data = responseDtos,
            Message = $"Upload thành công {responseDtos.Count} file(s)."
        };
    }
}
