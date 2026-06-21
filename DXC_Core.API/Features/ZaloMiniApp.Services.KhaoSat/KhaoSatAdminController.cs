using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.KhaoSat;

[ApiController]
[Route("api/zalo-mini-app/admin/khaosat")]
[Tags("ZaloMiniAppKhaoSatAdmin")]
[Authorize]
public class KhaoSatAdminController(ISender sender) : ControllerBase
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

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<SurveyDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateSurvey([FromBody] CreateSurvey.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("update")]
    [ProducesResponseType(typeof(ApiResult<SurveyDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateSurvey([FromBody] UpdateSurvey.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteSurvey([FromBody] DeleteSurvey.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("questions/create")]
    [ProducesResponseType(typeof(ApiResult<QuestionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> InsertQuestion([FromBody] InsertQuestion.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("questions/update")]
    [ProducesResponseType(typeof(ApiResult<QuestionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateQuestion([FromBody] UpdateQuestion.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("questions/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteQuestion([FromBody] DeleteQuestion.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("answers/create")]
    [ProducesResponseType(typeof(ApiResult<AnswerDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> InsertAnswer([FromBody] InsertAnswer.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("tuluan")]
    [ProducesResponseType(typeof(PagedResult<EssayQuestionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEssayQuestions([FromQuery] GetEssayQuestions.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("tuluan/create")]
    [ProducesResponseType(typeof(ApiResult<EssayQuestionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateEssayQuestion([FromBody] CreateEssayQuestion.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("tuluan/update")]
    [ProducesResponseType(typeof(ApiResult<EssayQuestionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateEssayQuestion([FromBody] UpdateEssayQuestion.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("tuluan/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteEssayQuestion([FromBody] DeleteEssayQuestion.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("answers/update")]
    [ProducesResponseType(typeof(ApiResult<AnswerDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateAnswer([FromBody] UpdateAnswer.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("answers/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteAnswer([FromBody] DeleteAnswer.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("ykienkhac")]
    [ProducesResponseType(typeof(PagedResult<OtherOpinionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOtherOpinions([FromQuery] GetOtherOpinions.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("ykienkhac/insert")]
    [ProducesResponseType(typeof(ApiResult<OtherOpinionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> InsertOtherOpinion([FromBody] InsertOtherOpinion.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("responses/check")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> CheckResponse([FromBody] CheckResponseKhaoSat.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("responses")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> SubmitResponses([FromBody] ResponseKhaoSat.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("thongke")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ThongKe([FromBody] ThongKeKhaoSat.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("responses/users")]
    [ProducesResponseType(typeof(PagedResult<long>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRespondedUsers([FromQuery] GetRespondedUsers.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("thongke/chitiet")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ChiTietThongKe([FromQuery] GetChiTietThongKeKhaoSat.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("tuluan/responses/by-user")]
    [ProducesResponseType(typeof(ApiResult<List<EssayResponseByUserDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEssayResponsesByUser([FromQuery] GetEssayResponsesByUser.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }
}
