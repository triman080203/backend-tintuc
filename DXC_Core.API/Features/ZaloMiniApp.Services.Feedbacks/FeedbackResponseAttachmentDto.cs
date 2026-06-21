namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class FeedbackResponseAttachmentDto
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public Guid FilePublicId { get; set; }
    public required string FileName { get; set; }
    public long FileSize { get; set; }
    public string? FileType { get; set; }
    public int SortOrder { get; set; }
    public string? DownloadUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}