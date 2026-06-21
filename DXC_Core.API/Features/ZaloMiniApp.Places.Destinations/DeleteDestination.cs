using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Destinations;

public static class DeleteDestination
{
    public class Command : IRequest<ApiResult>
    {
        public Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        public Validator()
        {
            RuleFor(x => x.PublicId).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, ApiResult>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult> Handle(Command request, CancellationToken cancellationToken)
        {
            var destination = await _context.Destinations.FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);
            
            if (destination == null)
            {
                return new ApiResult { Success = false, Message = "Không tìm thấy địa điểm" };
            }

            _context.Destinations.Remove(destination);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa địa điểm thành công"
            };
        }
    }
}
