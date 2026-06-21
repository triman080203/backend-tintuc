using DXC_Core.API.Data.CoreContext;
using DXC_Core.API.Shared.Contracts;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.Profile;

public static class DeleteProfile
{
    public class Command : IRequest<ApiResult>
    {
        public required Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly CoreDbContext _dbContext;

        public Validator(CoreDbContext dbContext)
        {
            _dbContext = dbContext;

            RuleFor(c => c.PublicId)
                .NotEmpty()
                .WithMessage("PublicId không hợp lệ.");

            RuleFor(c => c.PublicId)
                .MustAsync(ProfileMustExist)
                .WithMessage("Không tìm thấy hồ sơ người dùng.");
        }

        private async Task<bool> ProfileMustExist(Guid publicId, CancellationToken cancellationToken)
        {
            return await _dbContext.UserProfiles
                .AnyAsync(up => up.PublicId == publicId, cancellationToken);
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly CoreDbContext _dbContext;

        public Handler(CoreDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var profile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.PublicId == request.PublicId && up.IsActive, cancellationToken);

            if (profile == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Không tìm thấy hồ sơ người dùng hoặc hồ sơ đã bị xóa"
                };
            }

            // Xóa mềm hồ sơ người dùng
            profile.IsActive = false;
            profile.UpdatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa hồ sơ người dùng thành công"
            };
        }
    }
}
