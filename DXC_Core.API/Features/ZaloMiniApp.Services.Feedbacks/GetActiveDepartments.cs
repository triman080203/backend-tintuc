using DXC_Core.API.Shared.Contracts;
using MediatR;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

/// <summary>
/// DEPRECATED: Use Common feature endpoints instead
/// GET /api/admin/common/departments?isActive=true
/// GET /api/mobile/common/departments?isActive=true
/// </summary>
[Obsolete("Department management has been moved to Common feature. Use Common.GetActiveDepartments instead.")]
public static class GetActiveDepartments
{
    public class Query : IRequest<ApiResult<List<FeedbackDepartmentDto>>>
    {
        // Không có parameters, chỉ lấy danh sách active departments
    }

    public class Handler : IRequestHandler<Query, ApiResult<List<FeedbackDepartmentDto>>>
    {
        public Task<ApiResult<List<FeedbackDepartmentDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException(
                "Department management has been moved to Common feature. " +
                "Use GET /api/admin/common/departments?isActive=true instead.");
        }
    }
}
