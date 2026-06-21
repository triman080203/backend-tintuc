namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;

public class OtherOpinion
{
    public int Id { get; set; }
    public int SurveyId { get; set; }
    public string UserID { get; set; } = string.Empty;
    public string YKienKhac { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public virtual Survey? Survey { get; set; }
}

