namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;

public class EssayQuestion
{
    public int Id { get; set; }
    public int SurveyId { get; set; }
    public string CauHoiTuLuan { get; set; } = string.Empty;

    public virtual Survey? Survey { get; set; }
}

