using System.Text.Json.Serialization;
namespace DXC_Core.API.Shared.Contracts;
public class EnumResult<TValue>
{
    [JsonPropertyName("value")]
    public required Guid Value { get; set; }
    [JsonPropertyName("label")]
    public required string Label { get; set; }
}