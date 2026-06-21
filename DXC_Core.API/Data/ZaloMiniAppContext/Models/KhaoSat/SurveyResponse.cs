namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;

public class SurveyResponse
{
    public int Id { get; set; }
    public int SurveyId { get; set; }
    public long IDUser { get; set; }
    public int QuestionId { get; set; }
    public int AnswerId { get; set; }
    public string? HoTen { get; set; }
    public string? DiaChi { get; set; }
    public DateTime CreatedAt { get; set; }

    public virtual Survey? Survey { get; set; }
    public virtual Question? Question { get; set; }
    public virtual Answer? Answer { get; set; }
}

