using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.FileContext;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Diagnostics;

[ApiController]
[Route("api/diagnostics")]
[Tags("Diagnostics")]
[Authorize(Roles = "admin")]
public class DiagnosticsController : ControllerBase
{
    private readonly CoreDbContext _core;
    private readonly FileDbContext _file;
    private readonly ZaloMiniAppDbContext _zalo;
    private readonly ILogger<DiagnosticsController> _logger;

    public DiagnosticsController(CoreDbContext core, FileDbContext file, ZaloMiniAppDbContext zalo, ILogger<DiagnosticsController> logger)
    {
        _core = core;
        _file = file;
        _zalo = zalo;
        _logger = logger;
    }

    [HttpGet("db-check")]
    [ProducesResponseType(typeof(ApiResult<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DbCheck()
    {
        var results = new List<object>();

        async Task Check(string name, Func<Task<int>> action)
        {
            try
            {
                var count = await action();
                results.Add(new { name, ok = true, count });
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "DbCheck {name} failed", name);
                results.Add(new { name, ok = false, code = ex.Number, message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DbCheck {name} failed", name);
                results.Add(new { name, ok = false, code = 0, message = ex.Message });
            }
        }

        await Check("Core.Users", async () => await _core.Users.AsNoTracking().CountAsync());
        await Check("Core.Roles", async () => await _core.Roles.AsNoTracking().CountAsync());
        await Check("Core.UserRoles", async () => await _core.UserRoles.AsNoTracking().CountAsync());
        await Check("Core.Organizations", async () => await _core.Organizations.AsNoTracking().CountAsync());
        await Check("Core.Departments", async () => await _core.Departments.AsNoTracking().CountAsync());
        await Check("Core.UserProfiles", async () => await _core.UserProfiles.AsNoTracking().CountAsync());

        await Check("Zalo.Places.Hotels", async () => await _zalo.Hotels.AsNoTracking().CountAsync());
        await Check("Zalo.Places.HotelImages", async () => await _zalo.HotelImages.AsNoTracking().CountAsync());
        await Check("Zalo.Places.Restaurants", async () => await _zalo.Restaurants.AsNoTracking().CountAsync());
        await Check("Zalo.Places.RestaurantImages", async () => await _zalo.RestaurantImages.AsNoTracking().CountAsync());
        await Check("Zalo.Places.Homestays", async () => await _zalo.Homestays.AsNoTracking().CountAsync());
        await Check("Zalo.Places.HomestayImages", async () => await _zalo.HomestayImages.AsNoTracking().CountAsync());

        await Check("Zalo.Products.OcopProductCategories", async () => await _zalo.OcopProductCategories.AsNoTracking().CountAsync());
        await Check("Zalo.Products.OcopEnterprises", async () => await _zalo.OcopEnterprises.AsNoTracking().CountAsync());
        await Check("Zalo.Products.OcopProductImages", async () => await _zalo.OcopProductImages.AsNoTracking().CountAsync());
        await Check("Zalo.Products.OcopProducts", async () => await _zalo.OcopProducts.AsNoTracking().CountAsync());

        await Check("Zalo.Services.FeedbackStatuses", async () => await _zalo.FeedbackStatuses.AsNoTracking().CountAsync());
        await Check("Zalo.Services.Feedbacks", async () => await _zalo.Feedbacks.AsNoTracking().CountAsync());
        await Check("Zalo.Services.FeedbackAttachments", async () => await _zalo.FeedbackAttachments.AsNoTracking().CountAsync());
        await Check("Zalo.Services.FeedbackProcessings", async () => await _zalo.FeedbackProcessings.AsNoTracking().CountAsync());
        await Check("Zalo.Services.FeedbackResponses", async () => await _zalo.FeedbackResponses.AsNoTracking().CountAsync());
        await Check("Zalo.Services.FeedbackResponseAttachments", async () => await _zalo.FeedbackResponseAttachments.AsNoTracking().CountAsync());
        await Check("Zalo.Services.HotlineCategories", async () => await _zalo.HotlineCategories.AsNoTracking().CountAsync());
        await Check("Zalo.Services.Hotlines", async () => await _zalo.Hotlines.AsNoTracking().CountAsync());
        await Check("Zalo.Services.SupportGroupCategories", async () => await _zalo.SupportGroupCategories.AsNoTracking().CountAsync());
        await Check("Zalo.Services.SupportGroups", async () => await _zalo.SupportGroups.AsNoTracking().CountAsync());
        await Check("Zalo.Services.Banners", async () => await _zalo.Banners.AsNoTracking().CountAsync());
        await Check("Zalo.Services.UserPhoneNumbers", async () => await _zalo.UserPhoneNumbers.AsNoTracking().CountAsync());
        await Check("Zalo.Services.TotalUsers", async () => await _zalo.TotalUsers.AsNoTracking().CountAsync());

        await Check("Zalo.KhaoSat.Surveys", async () => await _zalo.KhaoSats.AsNoTracking().CountAsync());
        await Check("Zalo.KhaoSat.Questions", async () => await _zalo.KhaoSatCauHois.AsNoTracking().CountAsync());
        await Check("Zalo.KhaoSat.Answers", async () => await _zalo.KhaoSatTraLois.AsNoTracking().CountAsync());
        await Check("Zalo.KhaoSat.EssayQuestions", async () => await _zalo.KhaoSatTuLuans.AsNoTracking().CountAsync());
        await Check("Zalo.KhaoSat.OtherOpinions", async () => await _zalo.KhaoSatYKienKhacs.AsNoTracking().CountAsync());
        await Check("Zalo.KhaoSat.Responses", async () => await _zalo.KhaoSatResponses.AsNoTracking().CountAsync());
        await Check("Zalo.KhaoSat.EssayResponses", async () => await _zalo.KhaoSatEssayResponses.AsNoTracking().CountAsync());

        return Ok(new ApiResult<object> { Success = true, Data = results });
    }
}
