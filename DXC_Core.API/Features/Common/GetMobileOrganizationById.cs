using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Common;

public static class GetMobileOrganizationById
{
    public class Query : IRequest<ApiResult<OrganizationMobileDto>>
    {
        public required Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(q => q.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không hợp lệ.");
        }
    }

    public class Handler : IRequestHandler<Query, ApiResult<OrganizationMobileDto>>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult<OrganizationMobileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var organization = await _dbContext.Organizations
                .AsNoTracking()
                .Where(o => o.PublicId == request.PublicId && o.IsActive)
                .Select(o => new OrganizationMobileDto
                {
                    PublicId = o.PublicId,
                    Code = o.Code,
                    Name = o.Name,
                    Description = o.Description
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (organization == null)
            {
                return new ApiResult<OrganizationMobileDto>
                {
                    Success = false,
                    Message = "Không tìm thấy tổ chức"
                };
            }

            return new ApiResult<OrganizationMobileDto>
            {
                Success = true,
                Data = organization
            };
        }
    }
}
