using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DXC_Core.API.Data.ZaloMiniAppContext.Models.Services;

[Table("TotalUsers", Schema = "SERVICES")]
public class TotalUser
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public required string UserId { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Username { get; set; }

    [MaxLength(500)]
    public string? Avatar { get; set; }

    [MaxLength(100)]
    public string? PhanQuyen { get; set; }
    
    [MaxLength(20)]
    public string? PhoneNumber { get; set; }
}
