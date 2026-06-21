namespace DXC_Core.API.Features.TinTuc;

public class TinTucCategoryDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
