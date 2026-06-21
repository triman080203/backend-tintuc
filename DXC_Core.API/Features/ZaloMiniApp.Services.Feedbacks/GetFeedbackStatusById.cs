using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbackStatusById
{
    public class Query : IRequest<ApiResult<FeedbackStatusDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(q => q.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không được để trống.");
        }
    }

    public class Handler : IRequestHandler<Query, ApiResult<FeedbackStatusDto>>
    {
        private readonly ZaloMiniAppDbContext _dbContext;

        public Handler(ZaloMiniAppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<FeedbackStatusDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var status = await _dbContext.FeedbackStatuses
                .AsNoTracking()
                .Where(s => s.PublicId == request.PublicId)
                .Select(s => new FeedbackStatusDto
                {
                    PublicId = s.PublicId,
                    Code = s.Code,
                    Name = s.Name,
                    Description = s.Description,
                    Color = s.Color,
                    SortOrder = s.SortOrder,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (status == null)
            {
                return new ApiResult<FeedbackStatusDto> { Success = false, Message = "Không tìm thấy trạng thái phản ánh." };
            }

            return new ApiResult<FeedbackStatusDto> { Success = true, Data = status };
        }
    }
}
