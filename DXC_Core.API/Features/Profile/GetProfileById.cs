using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Profile;

public static class GetProfileById
{
    public class Query : IRequest<ApiResult<UserProfileDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId)
                .NotEmpty()
                .WithMessage("Public ID không được để trống");
        }
    }

    public class Handler(CoreDbContext dbContext) : IRequestHandler<Query, ApiResult<UserProfileDto>>
    {
        public async Task<ApiResult<UserProfileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profile = await dbContext.UserProfiles
                .Include(p => p.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.PublicId == request.PublicId, cancellationToken);

            if (profile == null)
            {
                return new ApiResult<UserProfileDto> 
                { 
                    Success = false, 
                    Message = "Profile not found" 
                };
            }

            var result = new UserProfileDto
            {
                UserName = profile.User.UserName,
                Email = profile.User.Email,
                FullName = profile.User.FullName,
                IsActive = profile.User.IsActive,
                UserCreatedAt = profile.User.CreatedAt,
                Profile = new ProfileDto
                {
                    PublicId = profile.PublicId,
                    Address = profile.Address,
                    Workplace = profile.Workplace,
                    JobTitle = profile.JobTitle,
                    Position = profile.Position,
                    Gender = profile.Gender,
                    DateOfBirth = profile.DateOfBirth,
                    CreatedAt = profile.CreatedAt,
                    UpdatedAt = profile.UpdatedAt
                }
            };

            return new ApiResult<UserProfileDto> { Success = true, Data = result };
        }
    }
}
