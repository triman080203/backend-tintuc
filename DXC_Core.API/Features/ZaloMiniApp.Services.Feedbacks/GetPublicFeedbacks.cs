using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DXC_Core.API.Features.ZaloMiniApp.Services.Feedbacks;

public static class GetPublicFeedbacks
{
    public class Query : IRequest<PagedResult<FeedbackMobileDto>>
    {
        public int Current { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Filter parameters
        public string? Title { get; set; }
        public string? FullName { get; set; }
        public string? Location { get; set; }

        // Date range filters
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
            var query = _context.Feedbacks
                .Include(f => f.CurrentStatus)
                .Include(f => f.Responses.Where(r => r.IsActive && r.IsApproved == true))
                .Where(f => f.IsActive && f.IsPublic) // Only public feedbacks
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrWhiteSpace(request.Title))
            {
                query = query.Where(f => f.Title.Contains(request.Title));
            }

            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                query = query.Where(f => f.FullName.Contains(request.FullName));
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

            // Get total count
            var total = await query.CountAsync(cancellationToken);

            // Apply pagination
            var feedbacks = await query
                .OrderByDescending(f => f.CreatedAt)
                .Skip((request.Current - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Map to DTOs
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
                Message = $"Tìm thấy {total} phản ánh công khai"
            };
        }
    }
}