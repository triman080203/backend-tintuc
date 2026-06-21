namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;

public class Answer
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public string TraLoi { get; set; } = string.Empty;

    public virtual Question? Question { get; set; }
}

