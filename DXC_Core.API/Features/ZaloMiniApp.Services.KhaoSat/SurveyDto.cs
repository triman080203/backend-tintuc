using DXC_Core.API.Data.ZaloMiniAppContext.Models.KhaoSat;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

public class SurveyDto
{
    public int Id { get; set; }
    public string TenKhaoSat { get; set; } = string.Empty;
    public DateTime ThoiGian { get; set; }
    public string? DisplayWebsite { get; set; }
    public string? Header { get; set; }
    public string? Footer { get; set; }
    public string? VeViec { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class AnswerDto
{
    public int Id { get; set; }
    public string TraLoi { get; set; } = string.Empty;
}

public class QuestionDto
{
    public int Id { get; set; }
    public string NoiDung { get; set; } = string.Empty;
    public string? CauHoiTuLuan { get; set; }
    public int? STT { get; set; }
    public List<AnswerDto> Answers { get; set; } = new();
}

public class SurveyDetailDto : SurveyDto
{
    public List<QuestionDto> Questions { get; set; } = new();
}

public class OtherOpinionDto
{
    public int Id { get; set; }
    public string UserID { get; set; } = string.Empty;
    public string YKienKhac { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class EssayQuestionDto
{
    public int Id { get; set; }
    public int SurveyId { get; set; }
    public string CauHoiTuLuan { get; set; } = string.Empty;
}

public class EssayResponseByUserDto
{
    public long IDUser { get; set; }
    public int SurveyId { get; set; }
    public int EssayQuestionId { get; set; }
    public string CauHoiTuLuan { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public static class KhaoSatMappings
{
    public static SurveyDto ToDto(Survey s) => new()
    {
        Id = s.Id,
        TenKhaoSat = s.TenKhaoSat,
        ThoiGian = s.ThoiGian,
        DisplayWebsite = s.DisplayWebsite,
        Header = s.Header,
        Footer = s.Footer,
        VeViec = s.VeViec,
        IsActive = s.IsActive,
        CreatedAt = s.CreatedAt,
        UpdatedAt = s.UpdatedAt
    };
}
