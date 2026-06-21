using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Restaurants;

public static class DeleteRestaurant
{
    public class Command : IRequest<ApiResult>
    {
        public Guid PublicId { get; set; }
    }

    public class Validator : AbstractValidator<Command>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Validator(ZaloMiniAppDbContext context)
        {
            _context = context;

            RuleFor(x => x.PublicId)
                .NotEmpty()
                .WithMessage("PublicId phải khác rỗng")
                .MustAsync(RestaurantExists)
                .WithMessage("Nhà hàng không tồn tại");
        }

        private async Task<bool> RestaurantExists(Guid publicId, CancellationToken cancellationToken)
        {
            return await _context.Restaurants.AnyAsync(r => r.PublicId == publicId, cancellationToken);
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
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.PublicId == request.PublicId, cancellationToken);

            if (restaurant == null)
            {
                return new ApiResult
                {
                    Success = false,
                    Message = "Nhà hàng không tồn tại"
                };
            }

            restaurant.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa mềm nhà hàng thành công"
            };
        }
    }
}