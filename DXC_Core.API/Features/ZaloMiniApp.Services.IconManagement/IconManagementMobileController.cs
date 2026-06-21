using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.IconManagement;

[ApiController]
[Route("api/zalo-mini-app/mobile/services")]
[AllowAnonymous]
public class IconManagementMobileController : ControllerBase
{
    private readonly ISender _sender;
    private static readonly string[] AllowedHosts = new[] { "apps.apple.com", "itunes.apple.com" };

    public IconManagementMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("icons/ios-redirect")]
    public async Task<IActionResult> RedirectIos([FromQuery] string url)
    {
        if (string.IsNullOrWhiteSpace(url)) return BadRequest("Thiếu url");
        try
        {
            var cleaned = url.Trim().Trim('`');
            var uri = new Uri(cleaned);
            var isSchemeValid = uri.Scheme == Uri.UriSchemeHttps || uri.Scheme == Uri.UriSchemeHttp;
            if (!isSchemeValid) return BadRequest("URL không hợp lệ hoặc host không được phép");
            if (AllowedHosts.Contains(uri.Host, StringComparer.OrdinalIgnoreCase)) return Redirect(uri.ToString());
            var resolved = await ResolveFinalUrlAsync(uri);
            if (resolved is null) return BadRequest("Không thể phân giải URL đích");
            if (!AllowedHosts.Contains(resolved.Host, StringComparer.OrdinalIgnoreCase)) return BadRequest("Host đích không được phép");
            return Redirect(resolved.ToString());
        }
        catch
        {
            return BadRequest("URL không hợp lệ");
        }
    }

    // Get icon configuration for mobile app
    [HttpGet("icon-config")]
    [ProducesResponseType(typeof(ApiResult<IconConfigDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetIconConfig()
    {
        var result = await _sender.Send(new GetIconConfig.Query());
        return Ok(result);
    }

    // Get all active icons (flattened list)
    [HttpGet("icons/active")]
    [ProducesResponseType(typeof(ApiResult<List<IconMobileDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActiveIcons()
    {
        var result = await _sender.Send(new GetActiveIcons.Query());
        return Ok(result);
    }

    private static async Task<Uri?> ResolveFinalUrlAsync(Uri start)
    {
        using var handler = new HttpClientHandler
        {
            AllowAutoRedirect = false
        };
        using var client = new HttpClient(handler);
        var current = start;
        for (var i = 0; i < 5; i++)
        {
            using var req = new HttpRequestMessage(HttpMethod.Get, current);
            using var resp = await client.SendAsync(req, HttpCompletionOption.ResponseHeadersRead);
            if ((int)resp.StatusCode >= 300 && (int)resp.StatusCode < 400)
            {
                var location = resp.Headers.Location;
                if (location is null) return current;
                current = location.IsAbsoluteUri ? location : new Uri(current, location);
                continue;
            }
            return current;
        }
        return current;
    }
}
