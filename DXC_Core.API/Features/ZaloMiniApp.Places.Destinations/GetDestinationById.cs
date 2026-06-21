using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Destinations;

public static class GetDestinationById
{
    public class Query : IRequest<ApiResult<DestinationDto>>
    {
        public Guid PublicId { get; set; }
    }

    public class Handler : IRequestHandler<Query, ApiResult<DestinationDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResult<DestinationDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var destination = await _context.Destinations
                .Include(x => x.Images)
                .Where(x => x.PublicId == request.PublicId)
                .Select(x => new DestinationDto
                {
                    PublicId = x.PublicId,
                    Name = x.Name,
                    Description = x.Description,
                    Address = x.Address,
                    TimeLimit = x.TimeLimit,
                    Tag = x.Tag,
                    Latitude = x.Latitude,
                    Longitude = x.Longitude,
                    VR360Link = x.VR360Link,
                    ThuTu = x.ThuTu,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    Images = x.Images.Select(img => new DestinationImageDto
                    {
                        PublicId = img.PublicId,
                        ImageUrl = $"/api/files/{img.ImagePublicId}",
                        ImagePublicId = img.ImagePublicId,
                        DisplayOrder = img.DisplayOrder,
                        IsPrimary = img.IsPrimary,
                        Caption = img.Caption
                    }).OrderBy(i => i.DisplayOrder).ToList()
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (destination == null)
            {
                return new ApiResult<DestinationDto> { Success = false, Message = "Không tìm thấy địa điểm" };
            }

            return new ApiResult<DestinationDto> { Success = true, Data = destination };
        }
    }
}
