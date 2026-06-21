namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.News;

public class Article
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Title { get; set; }
    public string? Slug { get; set; }
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string? CoverImagePublicId { get; set; }
    public string? AuthorName { get; set; }
    public int ViewCount { get; set; } = 0;
    public DateTime? PublishedAt { get; set; }
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
