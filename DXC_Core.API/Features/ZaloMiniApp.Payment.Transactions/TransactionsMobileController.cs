using Microsoft.AspNetCore.Mvc;
using MediatR;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Payment.Transactions;

[ApiController]
[Route("api/zalo-mini-app/mobile/transactions")]
[Tags("ZaloMiniAppTransactionsMobile")]
public class TransactionsMobileController : ControllerBase
{
    private readonly ISender _sender;

    public TransactionsMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("create")]
    [ProducesResponseType(typeof(ApiResult<PaymentTransactionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransaction.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("webhook/update")]
    [ProducesResponseType(typeof(ApiResult<PaymentTransactionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateTransactionWebhook([FromBody] UpdateTransaction.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Endpoint được nhúng vào QR code — khi điện thoại quét sẽ mở URL này,
    /// backend tự động xác nhận thanh toán và trả về trang HTML thông báo.
    /// </summary>
    [HttpGet("confirm/{publicId:guid}")]
    [ApiExplorerSettings(IgnoreApi = false)]
    public async Task<IActionResult> ConfirmPaymentViaQR(Guid publicId)
    {
        var result = await _sender.Send(new ConfirmTransaction.Query { PublicId = publicId });

        var amountFormatted = result.Amount.HasValue
            ? result.Amount.Value.ToString("N0") + " ₫"
            : "N/A";

        string icon, color, title, subtitle;

        if (!result.Success)
        {
            icon = "✗"; color = "#ef4444"; title = "Giao dịch không hợp lệ"; subtitle = result.Message;
        }
        else if (result.AlreadyPaid)
        {
            icon = "ℹ"; color = "#3b82f6"; title = "Đã thanh toán trước đó"; subtitle = result.Message;
        }
        else
        {
            icon = "✓"; color = "#22c55e"; title = "Thanh toán thành công!"; subtitle = result.Message;
        }

        var css = $@"
                * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background: #f8fafc; min-height: 100vh; display: flex;
                        align-items: center; justify-content: center; padding: 1rem; }}
                .card {{ background: #fff; border-radius: 1.5rem; padding: 2.5rem 2rem;
                         max-width: 400px; width: 100%; text-align: center;
                         box-shadow: 0 10px 40px rgba(0,0,0,0.1); }}
                .icon {{ width: 80px; height: 80px; border-radius: 50%; background: {color}1a;
                          display: flex; align-items: center; justify-content: center;
                          font-size: 2.5rem; color: {color}; margin: 0 auto 1.5rem; }}
                h1 {{ font-size: 1.4rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }}
                p.sub {{ color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem; }}
                .info-box {{ background: #f1f5f9; border-radius: 0.75rem; padding: 1rem; text-align: left; }}
                .info-row {{ display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; }}
                .info-row:not(:last-child) {{ border-bottom: 1px solid #e2e8f0; }}
                .info-label {{ color: #94a3b8; font-size: 0.85rem; }}
                .info-value {{ font-weight: 600; color: #1e293b; font-size: 0.95rem; }}
                .info-value.green {{ color: {color}; }}
                .footer {{ margin-top: 1.5rem; color: #94a3b8; font-size: 0.8rem; }}";

        var html = $@"<!DOCTYPE html>
<html lang=""vi"">
<head>
  <meta charset=""UTF-8"" />
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
  <title>{title}</title>
  <style>{css}</style>
</head>
<body>
  <div class=""card"">
    <div class=""icon"">{icon}</div>
    <h1>{title}</h1>
    <p class=""sub"">{subtitle}</p>
    <div class=""info-box"">
      <div class=""info-row"">
        <span class=""info-label"">Mã đơn hàng</span>
        <span class=""info-value"">{result.BookingCode ?? "N/A"}</span>
      </div>
      <div class=""info-row"">
        <span class=""info-label"">Số tiền</span>
        <span class=""info-value green"">{amountFormatted}</span>
      </div>
      <div class=""info-row"">
        <span class=""info-label"">Phương thức</span>
        <span class=""info-value"">Quét mã QR</span>
      </div>
    </div>
    <p class=""footer"">Hệ thống quản trị du lịch Tây Ninh</p>
  </div>
</body>
</html>";

        return Content(html, "text/html");
    }
}


