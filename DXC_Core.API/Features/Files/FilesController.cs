using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DXC_Core.API.Shared.Contracts;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace DXC_Core.API.Features.Files;

[ApiController]
[Route("api/files")]
[Tags("Files")]
//[Authorize] // Bảo vệ tất cả endpoint trong controller này
public class FilesController : ControllerBase
{
    private readonly ISender _sender;

    public FilesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpPost("upload")]
    [ProducesResponseType(typeof(ApiResult<List<UploadFileResponseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadFiles(
        [FromForm] List<IFormFile> files,
        [FromForm] Guid? entityPublicId,
        [FromForm] int? entityId, // Giữ lại để tương thích ngược nếu cần
        [FromForm] string? entityType,
        [FromForm] string? description)
    {
        var command = new UploadFiles.Command
        {
            Files = files,
            EntityPublicId = entityPublicId,
            EntityId = entityId,
            EntityType = entityType,
            Description = description
        };

        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("by-entity")]
    [ProducesResponseType(typeof(ApiResult<List<FileInfoDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFilesByEntity(
        [FromQuery] Guid entityPublicId,
        [FromQuery] string entityType)
    {
        var query = new GetFilesByEntity.Query
        {
            EntityPublicId = entityPublicId,
            EntityType = entityType
        };

        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("{publicId:guid}")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Produces("application/octet-stream")]
    public async Task<IActionResult> DownloadFile(Guid publicId)
    {
        var query = new DownloadFile.Query
        {
            PublicId = publicId
        };

        var result = await _sender.Send(query);
        return result;
    }
}
