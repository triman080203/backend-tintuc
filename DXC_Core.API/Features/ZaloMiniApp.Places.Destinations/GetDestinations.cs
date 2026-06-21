using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.Places.Destinations;

public static class GetDestinations
{
    public class Query : IRequest<PagedResult<DestinationDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Keyword { get; set; }
        public string? Tag { get; set; }
        public bool? IsActive { get; set; }
    }

    public class Validator : AbstractValidator<Query>
    {
        public Validator()
        {
            RuleFor(x => x.Current).GreaterThan(0);
            RuleFor(x => x.PageSize).GreaterThan(0).LessThanOrEqualTo(100);
        }
    }

    public class Handler : IRequestHandler<Query, PagedResult<DestinationDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<DestinationDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.Destinations.Include(x => x.Images).AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(x => x.Name.Contains(request.Keyword) || (x.Description != null && x.Description.Contains(request.Keyword)));
            }
            
            if (!string.IsNullOrWhiteSpace(request.Tag))
            {
                query = query.Where(x => x.Tag == request.Tag);
            }

            if (request.IsActive.HasValue)
            {
                query = query.Where(x => x.IsActive == request.IsActive.Value);
            }

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderBy(x => x.ThuTu)
                .ThenByDescending(x => x.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
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
                .ToListAsync(cancellationToken);

            return new PagedResult<DestinationDto>
            {
                Success = true,
                Data = items,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = "Lấy danh sách địa điểm thành công"
            };
        }
    }
}
