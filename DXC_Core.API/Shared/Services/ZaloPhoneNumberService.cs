using System.Net.Http.Json;
using System.Text.Json;

namespace DXC_Core.API.Shared.Services;

public class ZaloPhoneNumberService : IZaloPhoneNumberService
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly ILogger<ZaloPhoneNumberService> _logger;

    public ZaloPhoneNumberService(
        IConfiguration configuration,
        HttpClient httpClient,
        ILogger<ZaloPhoneNumberService> logger)
    {
        _configuration = configuration;
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<string> GetPhoneNumberAsync(string token, string accessToken)
    {
        try
        {
            var secretKey = _configuration["Zalo:SecretKey"];

            if (string.IsNullOrEmpty(secretKey))
            {
                throw new InvalidOperationException("Zalo SecretKey configuration is missing");
            }

            const string apiUrl = "https://graph.zalo.me/v2.0/me/info";

            _logger.LogInformation("Calling Zalo API to get phone number");

            var request = new HttpRequestMessage(HttpMethod.Get, apiUrl);
            request.Headers.Add("access_token", accessToken);
            request.Headers.Add("code", token);
            request.Headers.Add("secret_key", secretKey);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Zalo API error: {StatusCode}, Content: {Content}",
                    response.StatusCode, errorContent);
                throw new HttpRequestException($"Zalo API returned {response.StatusCode}: {errorContent}");
            }

            var result = await response.Content.ReadFromJsonAsync<ZaloPhoneNumberResponse>();

            if (result?.Error != 0)
            {
                _logger.LogError("Zalo API returned error code: {ErrorCode}, Message: {Message}",
                    result?.Error, result?.Message);
                throw new InvalidOperationException($"Zalo API error: {result?.Message}");
            }

            if (string.IsNullOrEmpty(result?.Data?.Number))
            {
                throw new InvalidOperationException("Phone number not found in Zalo API response");
            }

            _logger.LogInformation("Successfully retrieved phone number from Zalo API");
            return result.Data.Number;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting phone number from Zalo API");
            throw;
        }
    }
}

/// <summary>
/// Response model từ Zalo Open API
/// </summary>
public class ZaloPhoneNumberResponse
{
    public int Error { get; set; }
    public string? Message { get; set; }
    public ZaloPhoneNumberData? Data { get; set; }
}

public class ZaloPhoneNumberData
{
    public string? Number { get; set; }
}