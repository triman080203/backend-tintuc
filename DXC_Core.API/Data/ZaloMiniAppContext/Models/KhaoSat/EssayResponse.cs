namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;

public class EssayResponse
{
    public int Id { get; set; }
    public int SurveyId { get; set; }
    public long IDUser { get; set; }
    public int EssayQuestionId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

