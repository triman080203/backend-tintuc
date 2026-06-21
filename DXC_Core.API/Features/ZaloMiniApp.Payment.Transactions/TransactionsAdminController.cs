using Microsoft.AspNetCore.Mvc;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DXC_Core.API.Features.ZaloMiniApp.Payment.Transactions;

[ApiController]
[Route("api/zalo-mini-app/admin/transactions")]
[Tags("ZaloMiniAppTransactionsAdmin")]
[Authorize] // Admin only
public class TransactionsAdminController : ControllerBase
{
    private readonly ISender _sender;

    public TransactionsAdminController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<PaymentTransactionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTransactions([FromQuery] GetTransactions.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(ApiResult<PaymentTransactionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTransactionById(Guid publicId)
    {
        var result = await _sender.Send(new GetTransactionById.Query { PublicId = publicId });
        return Ok(result);
    }
}
