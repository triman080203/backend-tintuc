using MediatR;
using Microsoft.AspNetCore.Mvc;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

[ApiController]
[Route("api/zalo-mini-app/mobile/khaosat")]
public class KhaoSatMobileController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<SurveyDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSurveys([FromQuery] GetSurveys.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResult<SurveyDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSurveyDetail(int id)
    {
        var result = await _sender.Send(new GetSurveyDetail.Query { Id = id });
        return Ok(result);
    }

    [HttpPost("responses")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitResponses([FromBody] ResponseKhaoSat.Command command)
    {
        if (command == null)
        {
            return Ok(new ApiResult { Success = false, Message = "Dữ liệu không hợp lệ: body rỗng hoặc không đúng định dạng" });
        }
        if (command.CauHoi == null || command.DapAn == null || command.CauHoi.Count == 0 || command.DapAn.Count == 0)
        {
            return Ok(new ApiResult { Success = false, Message = "Danh sách câu hỏi/đáp án trống hoặc không hợp lệ" });
        }
        var result = await _sender.Send(command);
        return Ok(result);
    }

    public class EssayItem
    {
        public int EssayQuestionId { get; set; }
        public string Content { get; set; } = string.Empty;
    }

    public class SubmitEssayRequest : IRequest<ApiResult>
    {
        public int SurveyId { get; set; }
        public long IDUser { get; set; }
        public List<EssayItem> Items { get; set; } = new();
    }

    [HttpPost("responses/essay")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitEssayResponses([FromBody] SubmitEssayRequest request)
    {
        if (request == null || request.Items.Count == 0)
        {
            return Ok(new ApiResult { Success = false, Message = "Dữ liệu không hợp lệ" });
        }
        var result = await _sender.Send(new SubmitEssayResponses.Command
        {
            SurveyId = request.SurveyId,
            IDUser = request.IDUser,
            Items = request.Items.Select(i => new SubmitEssayResponses.EssayItem { EssayQuestionId = i.EssayQuestionId, Content = i.Content }).ToList()
        });
        return Ok(result);
    }

    [HttpGet("questions")]
    [ProducesResponseType(typeof(ApiResult<List<QuestionDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetChoiceQuestions([FromQuery] GetChoiceQuestions.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("tuluan")]
    [ProducesResponseType(typeof(PagedResult<EssayQuestionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEssayQuestions([FromQuery] GetEssayQuestions.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }
}
