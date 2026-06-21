namespace DXC_Core.API.Features.Files;

public class FileInfoDto
{
    public Guid PublicId { get; set; }
    public required string FileName { get; set; }
    public long FileSize { get; set; }
    public required string ContentType { get; set; }
    public string? Description { get; set; }
    public int Ordinal { get; set; }
    public string? Url { get; set; }
    public DateTime UploadedAt { get; set; }
    public int? UploadedById { get; set; }
    public string? UploadedByName { get; set; }
}