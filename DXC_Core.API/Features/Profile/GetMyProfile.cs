using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DXC_Core.API.Features.Profile;

public static class GetMyProfile
{
    public class Query : IRequest<ApiResult<UserProfileDto>>
    {
    }

    public class Handler(CoreDbContext dbContext, IHttpContextAccessor httpContextAccessor) 
        : IRequestHandler<Query, ApiResult<UserProfileDto>>
    {
        public async Task<ApiResult<UserProfileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var userIdClaim = httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return new ApiResult<UserProfileDto> 
                { 
                    Success = false, 
                    Message = "User not authenticated" 
                };
            }

            var userId = int.Parse(userIdClaim.Value);

            var user = await dbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

            if (user == null)
            {
                return new ApiResult<UserProfileDto> 
                { 
                    Success = false, 
                    Message = "User not found" 
                };
            }

            var profile = await dbContext.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(up => up.UserId == userId, cancellationToken);

            var result = new UserProfileDto
            {
                UserName = user.UserName,
                Email = user.Email,
                FullName = user.FullName,
                IsActive = user.IsActive,
                UserCreatedAt = user.CreatedAt,
                Profile = profile != null ? new ProfileDto
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
                } : null
            };

            return new ApiResult<UserProfileDto> { Success = true, Data = result };
        }
    }
}
