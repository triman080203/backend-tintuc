using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using DXC_Core.API.Data.ZaloMiniAppContext;
using DXC_Core.API.Shared.Contracts;

namespace DXC_Core.API.Features.ZaloMiniApp.News.Articles;

public static class DeleteArticle
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
            var article = await _context.Articles.FirstOrDefaultAsync(x => x.PublicId == request.PublicId, cancellationToken);
            
            if (article == null)
            {
                return new ApiResult { Success = false, Message = "Không tìm thấy bài viết" };
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync(cancellationToken);

            return new ApiResult
            {
                Success = true,
                Message = "Xóa bài viết thành công"
            };
        }
    }
}
