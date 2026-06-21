namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Places;

public class Restaurant
{
    public int Id { get; set; }
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? OperatingHours { get; set; }
    public string? Schedule { get; set; } // JSON hoặc text mô tả lịch hoạt động
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public string? VR360Link { get; set; }
    public string? Category { get; set; } // Loại hình nhà hàng
    public string? AveragePriceRange { get; set; } // Khoảng giá trung bình
    public int ThuTu { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<RestaurantImage> Images { get; set; } = new List<RestaurantImage>();
}
