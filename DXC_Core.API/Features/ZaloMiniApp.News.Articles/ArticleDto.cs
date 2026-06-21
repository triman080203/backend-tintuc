namespace DXC_Core.API.Features.ZaloMiniApp.News.Articles;

public class ArticleDto
{
    public Guid PublicId { get; set; }
    public string Title { get; set; } = null!;
    public string? Slug { get; set; }
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string? CoverImagePublicId { get; set; }
    public string? CoverImageUrl { get; set; }
    public string? AuthorName { get; set; }
    public int ViewCount { get; set; }
    public DateTime? PublishedAt { get; set; }
    public int ThuTu { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
