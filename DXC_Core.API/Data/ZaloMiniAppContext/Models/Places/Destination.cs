namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;

public class Destination
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? TimeLimit { get; set; }
    public string? Tag { get; set; } // e.g. "Tâm linh", "Sinh thái"
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? VR360Link { get; set; }
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<DestinationImage> Images { get; set; } = new List<DestinationImage>();
}
