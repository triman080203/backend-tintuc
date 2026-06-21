using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Files;

public static class GetFilesByEntity
{
    public class Query : IRequest<ApiResult<List<FileInfoDto>>>
    {
        public Guid EntityPublicId { get; set; }
        public required string EntityType { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(q => q.EntityPublicId)
                .NotEmpty()
                .WithMessage("EntityPublicId không được rỗng.");

            RuleFor(q => q.EntityType)
                .NotEmpty()
                .WithMessage("EntityType không được để trống.")
                .MaximumLength(100)
                .WithMessage("EntityType không được vượt quá 100 ký tự.");
        }
    }
}

public class GetFilesByEntityHandler(FileDbContext dbContext) : IRequestHandler<GetFilesByEntity.Query, ApiResult<List<FileInfoDto>>>
{
    public async Task<ApiResult<List<FileInfoDto>>> Handle(GetFilesByEntity.Query request, CancellationToken cancellationToken)
    {
        var files = await dbContext.Files
            .Where(f => f.EntityPublicId == request.EntityPublicId && f.EntityType == request.EntityType)
            .OrderBy(f => f.Ordinal)
            .ThenBy(f => f.UploadedAt)
            .Select(f => new FileInfoDto
            {
                PublicId = f.PublicId,
                FileName = f.FileName,
                FileSize = f.FileSize,
                ContentType = f.ContentType,
                Description = f.Description,
                Ordinal = f.Ordinal,
                Url = $"/api/files/{f.PublicId}",
                UploadedAt = f.UploadedAt,
                UploadedById = f.UploadedById,
                UploadedByName = null // Có thể join với User table sau nếu cần
            })
            .ToListAsync(cancellationToken);

        return new ApiResult<List<FileInfoDto>>
        {
            Success = true,
            Data = files,
            Message = files.Count > 0 ? $"Tìm thấy {files.Count} file(s)." : "Không tìm thấy file nào."
        };
    }
}