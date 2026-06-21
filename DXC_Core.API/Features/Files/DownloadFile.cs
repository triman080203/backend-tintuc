using DXC_Core.API.Data.FileContext;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Files;

public static class DownloadFile
{
    public class Query : IRequest<IActionResult>
    {
        public Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(q => q.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không được rỗng.");
        }
    }

}

public class DownloadFileHandler(FileDbContext dbContext, IWebHostEnvironment environment) : IRequestHandler<DownloadFile.Query, IActionResult>
{
    public async Task<IActionResult> Handle(DownloadFile.Query request, CancellationToken cancellationToken)
    {
        var file = await dbContext.Files
            .FirstOrDefaultAsync(f => f.PublicId == request.PublicId, cancellationToken);

        if (file == null)
        {
            return new NotFoundObjectResult(new { message = "File không tồn tại." });
        }

        // Xây dựng đường dẫn đầy đủ đến file vật lý từ đường dẫn tương đối đã lưu
        // Giả định file.FilePath lưu đường dẫn tương đối kiểu "uploads/storedFileName"
        var fullPath = Path.Combine(environment.WebRootPath ?? environment.ContentRootPath, file.FilePath);

        if (!System.IO.File.Exists(fullPath))
        {
            return new NotFoundObjectResult(new { message = "File vật lý không tồn tại trên server." });
        }

        var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath, cancellationToken);

        return new FileContentResult(fileBytes, file.ContentType)
        {
            FileDownloadName = file.FileName
        };
    }
}