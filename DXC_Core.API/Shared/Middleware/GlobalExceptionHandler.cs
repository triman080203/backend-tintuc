using System.Net;
using System.Text.Json;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;

namespace DXC_Core.API.Shared.Middleware;

public class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Ghi log lỗi ra console hoặc file
            _logger.LogError(ex, "An unhandled exception has occurred.");
            _logger.LogError("Request {method} {path} qs={qs} trace={trace}", context.Request.Method, context.Request.Path.Value, context.Request.QueryString.Value, context.TraceIdentifier);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Theo quy chuẩn Ant Design Pro, lỗi nghiệp vụ vẫn trả về HTTP 200 OK
        var httpStatusCode = HttpStatusCode.OK;
        ApiResult<object> response;

        switch (exception)
        {
            case ValidationException validationException:
                response = new ApiResult<object>
                {
                    Success = false,
                    Message = "Một hoặc nhiều lỗi xác thực đã xảy ra.",
                    Data = validationException.Errors.Select(e => new { field = e.PropertyName, message = e.ErrorMessage })
                };
                break;
            case Microsoft.EntityFrameworkCore.DbUpdateException dbUpdateException:
                response = new ApiResult<object>
                {
                    Success = false,
                    Message = dbUpdateException.InnerException?.Message ?? dbUpdateException.Message
                };
                break;
            case Microsoft.Data.SqlClient.SqlException sqlException:
                response = new ApiResult<object>
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi truy vấn dữ liệu",
                    Data = new { code = sqlException.Number, traceId = context.TraceIdentifier }
                };
                break;
            default:
                response = new ApiResult<object>
                {
                    Success = false,
                    Message = exception.Message
                };
                break;
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)httpStatusCode;

        var jsonResponse = JsonSerializer.Serialize(response);
        return context.Response.WriteAsync(jsonResponse);
    }
}
