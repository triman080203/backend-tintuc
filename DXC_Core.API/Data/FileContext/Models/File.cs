namespace DXC_Core.API.Data.FileContext.Models;

public class File
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public Guid? EntityPublicId { get; set; }
    public required string FileName { get; set; }
    public required string StoredFileName { get; set; }
    public required string FilePath { get; set; }
    public long FileSize { get; set; }
    public required string ContentType { get; set; }
    public int? EntityId { get; set; }
    public string? EntityType { get; set; }
    public string? Description { get; set; }
    public int Ordinal { get; set; } = 0;
    public int? UploadedById { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}