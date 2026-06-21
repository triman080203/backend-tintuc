using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Text;

namespace DXC_Core.API.Shared.Diagnostics;

public class SqlCommandLoggingInterceptor : DbCommandInterceptor
{
    private readonly ILogger<SqlCommandLoggingInterceptor> _logger;
    private readonly IHttpContextAccessor _http;

    public SqlCommandLoggingInterceptor(ILogger<SqlCommandLoggingInterceptor> logger, IHttpContextAccessor http)
    {
        _logger = logger;
        _http = http;
    }

    public override void CommandFailed(DbCommand command, CommandErrorEventData eventData)
    {
        var traceId = _http.HttpContext?.TraceIdentifier ?? System.Guid.NewGuid().ToString();
        var paramsText = BuildParams(command);
        _logger.LogError(eventData.Exception, "SQL failed [{TraceId}] {CommandText} params: {Params}", traceId, command.CommandText, paramsText);
        base.CommandFailed(command, eventData);
    }

    private static string BuildParams(DbCommand command)
    {
        if (command.Parameters.Count == 0) return "[]";
        var sensitive = new[] { "password", "secret", "key", "token" };
        var items = command.Parameters.Cast<DbParameter>().Select(p =>
        {
            var name = p.ParameterName ?? "";
            var val = p.Value?.ToString() ?? "";
            var lower = name.ToLowerInvariant();
            if (sensitive.Any(s => lower.Contains(s))) val = "***";
            if (val.Length > 256) val = val.Substring(0, 256) + "...";
            return $"{name}={val}";
        });
        var sb = new StringBuilder();
        sb.Append('[');
        sb.Append(string.Join(", ", items));
        sb.Append(']');
        return sb.ToString();
    }
}
