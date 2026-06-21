using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Data.CoreContext.Models.Profile;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DXC_Core.API.Features.Profile;

public static class CreateProfile
{
    public class Command : IRequest<ApiResult<ProfileDto>>
    {
        public string? Address { get; set; }
        public string? Workplace { get; set; }
        public string? JobTitle { get; set; }
        public string? Position { get; set; }
        public bool? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.DateOfBirth)
                .Must(date => !date.HasValue || date.Value <= DateTime.Today)
                .WithMessage("Ngày sinh không thể là ngày trong tương lai");

            RuleFor(x => x.Address)
                .MaximumLength(500)
                .WithMessage("Địa chỉ không được vượt quá 500 ký tự");

            RuleFor(x => x.Workplace)
                .MaximumLength(200)
                .WithMessage("Cơ quan không được vượt quá 200 ký tự");

            RuleFor(x => x.JobTitle)
                .MaximumLength(100)
                .WithMessage("Chức danh không được vượt quá 100 ký tự");

            RuleFor(x => x.Position)
                .MaximumLength(100)
                .WithMessage("Chức vụ không được vượt quá 100 ký tự");
        }
    }

    public class Handler(CoreDbContext dbContext, IHttpContextAccessor httpContextAccessor) 
        : IRequestHandler<Command, ApiResult<ProfileDto>>
    {
        public async Task<ApiResult<ProfileDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var userIdClaim = httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return new ApiResult<ProfileDto> 
                { 
                    Success = false, 
                    Message = "User not authenticated" 
                };
            }

            var userId = int.Parse(userIdClaim.Value);

            // Check if profile already exists
            var existingProfile = await dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == userId, cancellationToken);

            if (existingProfile != null)
            {
                return new ApiResult<ProfileDto> 
                { 
                    Success = false, 
                    Message = "Profile already exists for this user" 
                };
            }

            var profile = new UserProfile
            {
                UserId = userId,
                Address = request.Address,
                Workplace = request.Workplace,
                JobTitle = request.JobTitle,
                Position = request.Position,
                Gender = request.Gender,
                DateOfBirth = request.DateOfBirth,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            dbContext.UserProfiles.Add(profile);
            await dbContext.SaveChangesAsync(cancellationToken);

            var result = new ProfileDto
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
            };

            return new ApiResult<ProfileDto> { Success = true, Data = result };
        }
    }
}
