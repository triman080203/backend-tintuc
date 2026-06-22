namespace DXC_Core.API.Features.Dashboard;

public class DashboardStatsDto
{
    public int TotalFeedbacks { get; set; }
    public int ProcessingFeedbacks { get; set; }
    public int ApprovedFeedbackResponses { get; set; }
    public int TotalUsers { get; set; }
    
    // News stats
    public int TotalNews { get; set; }
    public int PendingNews { get; set; }
    public int ApprovedNews { get; set; }
    public int PublishedNews { get; set; }
}