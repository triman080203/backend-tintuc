using System.Text.Json.Serialization;

namespace DXC_Core.API.Shared.Contracts;

/// <summary>
/// Represents a paginated API response.
/// </summary>
/// <typeparam name="T">The type of data items.</typeparam>
public class PagedResult<T>
{
    /// <summary>
    /// Indicates whether the request was successful.
    /// </summary>
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    /// <summary>
    /// The list of data items for the current page.
    /// </summary>
    [JsonPropertyName("data")]
    public IEnumerable<T> Data { get; set; } = Enumerable.Empty<T>();

    /// <summary>
    /// The total number of records.
    /// </summary>
    [JsonPropertyName("total")]
    public long Total { get; set; }

    /// <summary>
    /// The current page number.
    /// </summary>
    [JsonPropertyName("current")]
    public int Current { get; set; }

    /// <summary>
    /// The number of items per page.
    /// </summary>
    [JsonPropertyName("pageSize")]
    public int PageSize { get; set; }

    /// <summary>
    /// An optional message, typically used for errors.
    /// </summary>
    [JsonPropertyName("message")]
    public string? Message { get; set; }
}
