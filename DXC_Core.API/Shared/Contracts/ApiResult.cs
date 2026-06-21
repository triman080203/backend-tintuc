using System.Text.Json.Serialization;

namespace DXC_Core.API.Shared.Contracts;

/// <summary>
/// Represents a standard API response for single-item operations (Get, Create, Update, Delete).
/// </summary>
/// <typeparam name="T">The type of the data payload.</typeparam>
public class ApiResult<T>
{
    /// <summary>
    /// Indicates whether the request was successful.
    /// </summary>
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    /// <summary>
    /// The data payload. Can be null for operations like Delete.
    /// </summary>
    [JsonPropertyName("data")]
    public T? Data { get; set; }

    /// <summary>
    /// An optional message, providing more details about the result.
    /// </summary>
    [JsonPropertyName("message")]
    public string? Message { get; set; }
}

/// <summary>
/// A non-generic version of ApiResult, typically used for operations
/// where no data payload is returned (e.g., Delete, Update).
/// </summary>
public class ApiResult
{
    /// <summary>
    /// Indicates whether the request was successful.
    /// </summary>
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    /// <summary>
    /// An optional message, providing more details about the result.
    /// </summary>
    [JsonPropertyName("message")]
    public string? Message { get; set; }
}