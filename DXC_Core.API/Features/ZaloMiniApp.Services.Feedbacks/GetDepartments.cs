using DXC_Core.API.Shared.Contracts;
using MediatR;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

/// <summary>
/// DEPRECATED: Use Common feature endpoints instead
/// GET /api/admin/common/departments
/// GET /api/mobile/common/departments
/// </summary>
[Obsolete("Department management has been moved to Common feature. Use Common.GetDepartments instead.")]
public static class GetDepartments
{
    public class Query : IRequest<PagedResult<FeedbackDepartmentDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Name { get; set; }
        public string? Code { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<FeedbackDepartmentDto>>
    {
        public Task<PagedResult<FeedbackDepartmentDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException(
                "Department management has been moved to Common feature. " +
                "Use GET /api/admin/common/departments instead.");
        }
    }
}
