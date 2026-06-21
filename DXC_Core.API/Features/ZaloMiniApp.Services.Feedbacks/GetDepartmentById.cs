using DXC_Core.API.Shared.Contracts;
using MediatR;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

/// <summary>
/// DEPRECATED: Use Common feature endpoints instead
/// GET /api/admin/common/departments/{id}
/// GET /api/mobile/common/departments/{id}
/// </summary>
[Obsolete("Department management has been moved to Common feature. Use Common.GetDepartmentById instead.")]
public static class GetDepartmentById
{
    public class Query : IRequest<ApiResult<FeedbackDepartmentDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<FeedbackDepartmentDto>>
    {
        public Task<ApiResult<FeedbackDepartmentDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException(
                "Department management has been moved to Common feature. " +
                "Use GET /api/admin/common/departments/{id} instead.");
        }
    }
}
