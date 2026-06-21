namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;

public class Survey
{
    public int Id { get; set; }
    public string TenKhaoSat { get; set; } = string.Empty;
    public DateTime ThoiGian { get; set; }
    public string? DisplayWebsite { get; set; }
    public string? Header { get; set; }
    public string? Footer { get; set; }
    public string? VeViec { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
    public virtual ICollection<EssayQuestion> EssayQuestions { get; set; } = new List<EssayQuestion>();
    public virtual ICollection<OtherOpinion> OtherOpinions { get; set; } = new List<OtherOpinion>();
    public virtual ICollection<SurveyResponse> Responses { get; set; } = new List<SurveyResponse>();
}

