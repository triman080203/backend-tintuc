using System;

namespace DXC_Core.API.Features.TinTuc;

public class ArticleDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Title { get; set; }
    public string? Summary { get; set; }
    public string? ThumbnailUrl { get; set; }
    
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    
    public int CurrentStatusId { get; set; }
    public string? CurrentStatusCode { get; set; }
    public string? CurrentStatusName { get; set; }
    public string? CurrentStatusColor { get; set; }
    
    public Guid? AuthorUserPublicId { get; set; }
    public string? AuthorName { get; set; }
    
    public int ViewCount { get; set; }
    public bool IsPublic { get; set; }
    public DateTime? PublishedAt { get; set; }
    
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class ArticleDetailDto : ArticleDto
{
    public required string Content { get; set; }
    public string? Tags { get; set; }
    public string? Slug { get; set; }
    public Guid? EditorUserPublicId { get; set; }

    public List<ArticleAttachmentDto> Attachments { get; set; } = new();
    public List<ArticleProcessingHistoryDto> ProcessingHistories { get; set; } = new();
}

public class ArticleAttachmentDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public Guid FilePublicId { get; set; }
    public required string FileName { get; set; }
    public long FileSize { get; set; }
    public string? FileType { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ArticleProcessingHistoryDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    
    public int FromStatusId { get; set; }
    public string? FromStatusName { get; set; }
    public string? FromStatusCode { get; set; }
    
    public int ToStatusId { get; set; }
    public string? ToStatusName { get; set; }
    public string? ToStatusCode { get; set; }
    
    public string? Action { get; set; }
    public Guid? ActorUserPublicId { get; set; }
    public string? ActorName { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}
