using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetFeedbacksByStatus
{
    public class Query : IRequest<PagedResult<FeedbackMobileDto>>
    {
        public required string StatusCode { get; set; }
        public string? PhoneNumber { get; set; }
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Title { get; set; }
        public string? Location { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResult<FeedbackMobileDto>>
    {
        private readonly ZaloMiniAppDbContext _context;

        public Handler(ZaloMiniAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<FeedbackMobileDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var status = await _context.FeedbackStatuses
                .FirstOrDefaultAsync(s => s.Code == request.StatusCode, cancellationToken);

            if (status == null)
            {
                return new PagedResult<FeedbackMobileDto>
                {
                    Success = true,
                    Data = new List<FeedbackMobileDto>(),
                    Total = 0,
                    Current = request.Current,
                    PageSize = request.PageSize,
                    Message = "Trạng thái không hợp lệ"
                };
            }

            var query = _context.Feedbacks
                .Include(f => f.CurrentStatus)
                .Include(f => f.Responses.Where(r => r.IsActive && r.IsApproved == true))
                .Where(f => f.IsActive && f.CurrentStatusId == status.Id)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                query = query.Where(f => f.PhoneNumber == request.PhoneNumber);
            }
            else
            {
                query = query.Where(f => f.IsPublic);
            }

            if (!string.IsNullOrWhiteSpace(request.Title))
            {
                query = query.Where(f => f.Title.Contains(request.Title));
            }

            if (!string.IsNullOrWhiteSpace(request.Location))
            {
                query = query.Where(f => f.Location != null && f.Location.Contains(request.Location));
            }

            if (request.CreatedFrom.HasValue)
            {
                query = query.Where(f => f.CreatedAt >= request.CreatedFrom.Value);
            }

            if (request.CreatedTo.HasValue)
            {
                query = query.Where(f => f.CreatedAt <= request.CreatedTo.Value);
            }

            var total = await query.CountAsync(cancellationToken);

            var feedbacks = await query
                .OrderByDescending(f => f.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var feedbackDtos = feedbacks.Select(f => new FeedbackMobileDto
            {
                Id = f.Id,
                PublicId = f.PublicId,
                Title = f.Title,
                Content = f.Content,
                FullName = f.FullName,
                PhoneNumber = f.PhoneNumber,
                Location = f.Location,
                IsPublic = f.IsPublic,
                CurrentStatusId = f.CurrentStatusId,
                CurrentStatusCode = f.CurrentStatus.Code,
                CurrentStatusName = f.CurrentStatus.Name,
                CurrentStatusColor = f.CurrentStatus.Color,
                IsActive = f.IsActive,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt,
                AttachmentCount = f.Attachments.Count(a => a.IsActive),
                HasResponse = f.Responses.Any(r => r.IsApproved == true),
                LastResponseDate = f.Responses
                    .Where(r => r.IsApproved == true)
                    .OrderByDescending(r => r.ApprovedAt)
                    .Select(r => r.ApprovedAt)
                    .FirstOrDefault()
            }).ToList();

            return new PagedResult<FeedbackMobileDto>
            {
                Success = true,
                Data = feedbackDtos,
                Total = total,
                Current = request.Current,
                PageSize = request.PageSize,
                Message = $"Tìm thấy {total} phản ánh theo trạng thái '{status.Name}'"
            };
        }
    }
}

