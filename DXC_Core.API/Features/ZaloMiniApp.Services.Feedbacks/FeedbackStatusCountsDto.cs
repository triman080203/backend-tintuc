namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public class FeedbackStatusCountsDto
{
    public int SubmittedCount { get; set; }
    public int InProgressCount { get; set; }
    public int CompletedCount { get; set; }
    public int RejectedCount { get; set; }
    public int ConfirmCount { get; set; }
    public int TotalCount { get; set; }
}
