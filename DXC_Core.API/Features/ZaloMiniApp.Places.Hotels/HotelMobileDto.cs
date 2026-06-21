namespace DXC_Core.API.Features.ZaloMiniApp.Places.Hotels;


// DTO tối ưu cho mobile app - chỉ chứa thông tin cần thiết
public class HotelMobileDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Address { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Website { get; set; }
    public decimal? Rating { get; set; }
    public int ReviewCount { get; set; }
    public decimal? PriceFrom { get; set; }
    public string? PriceFromCurrency { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    
    // Khoảng cách từ vị trí hiện tại (tính bằng km)
    public double? DistanceKm { get; set; }
    
    // Các tiện ích nổi bật (tối đa 5 tiện ích)
    public List<string> TopAmenities { get; set; } = new();
    
    // Trạng thái hoạt động hiển thị
    public string StatusDisplay => IsActive ? "Đang hoạt động" : "Tạm đóng cửa";
    
    // URL deep link để mở chi tiết khách sạn trong app
    public string DeepLink => $"zaloapp://hotels/{PublicId}";
}

// DTO danh sách khách sạn tối ưu cho mobile (list view)
public class HotelMobileListDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public required string Address { get; set; }
    public decimal? Rating { get; set; }
    public int ReviewCount { get; set; }
    public decimal? PriceFrom { get; set; }
    public string? PriceFromCurrency { get; set; }
    public double? DistanceKm { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    
    // Hiển thị giá ngắn gọn
    public string PriceDisplay => PriceFrom.HasValue 
        ? $"Từ {PriceFrom:N0} {PriceFromCurrency ?? "VND"}" 
        : "Liên hệ";
    
    // Hiển thị đánh giá ngắn gọn
    public string RatingDisplay => Rating.HasValue 
        ? $"{Rating:F1} ⭐ ({ReviewCount} đánh giá)" 
        : "Chưa có đánh giá";
    
    // Hiển thị khoảng cách ngắn gọn
    public string DistanceDisplay => DistanceKm.HasValue 
        ? $"{DistanceKm:F1} km" 
        : "";
}

// DTO tìm kiếm khách sạn cho mobile
public class HotelMobileSearchDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public required string Address { get; set; }
    public decimal? Rating { get; set; }
    public decimal? PriceFrom { get; set; }
    public double? DistanceKm { get; set; }
    
    // Highlight text cho search results
    public string HighlightedName { get; set; } = "";
    public string HighlightedAddress { get; set; } = "";
}

// DTO khách sạn gần đây cho mobile
public class HotelMobileNearbyDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public required string Address { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public decimal? Rating { get; set; }
    public double DistanceKm { get; set; }
    public bool IsActive { get; set; }
    
    // Thời gian đi bộ ước tính (phút)
    public int WalkingTimeMinutes => (int)Math.Ceiling(DistanceKm * 12); // ~5km/h walking speed
    
    // Hiển thị thời gian di chuyển
    public string TravelTimeDisplay => WalkingTimeMinutes <= 15 
        ? $"{WalkingTimeMinutes} phút đi bộ" 
        : $"{DistanceKm:F1} km";
}

// DTO khách sạn yêu thích cho mobile
public class HotelMobileFavoriteDto
{
    public Guid PublicId { get; set; }
    public required string Name { get; set; }
    public required string Address { get; set; }
    public decimal? Rating { get; set; }
    public decimal? PriceFrom { get; set; }
    public DateTime FavoriteAddedAt { get; set; }
    public bool IsActive { get; set; }
    
    // Hiển thị thời gian thêm vào yêu thích
    public string FavoriteTimeDisplay
    {
        get
        {
            var timeSpan = DateTime.Now - FavoriteAddedAt;
            if (timeSpan.TotalDays < 1)
                return "Hôm nay";
            if (timeSpan.TotalDays < 7)
                return $"{(int)timeSpan.TotalDays} ngày trước";
            if (timeSpan.TotalDays < 30)
                return $"{(int)(timeSpan.TotalDays / 7)} tuần trước";
            return FavoriteAddedAt.ToString("dd/MM/yyyy");
        }
    }
}