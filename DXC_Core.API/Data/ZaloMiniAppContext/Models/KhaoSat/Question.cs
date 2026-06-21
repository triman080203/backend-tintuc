namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;

public class Question
{
    public int Id { get; set; }
    public int SurveyId { get; set; }
    public string NoiDung { get; set; } = string.Empty;
    public string? CauHoiTuLuan { get; set; }
    public int? STT { get; set; }

    public virtual Survey? Survey { get; set; }
    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
}

