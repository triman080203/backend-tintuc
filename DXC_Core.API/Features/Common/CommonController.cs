using DXC_Core.API.Shared.Contracts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace DXC_Core.API.Features.Common;

[ApiController]
[Route("api/admin/common")]
[Authorize]
public class CommonAdminController : ControllerBase
{
    private readonly ISender _sender;

    public CommonAdminController(ISender sender)
    {
        _sender = sender;
    }

    // Organizations endpoints
    [HttpGet("organizations")]
    [ProducesResponseType(typeof(PagedResult<OrganizationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrganizations([FromQuery] GetOrganizations.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("organizations/{publicId}")]
    [ProducesResponseType(typeof(ApiResult<OrganizationWithDepartmentsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<OrganizationWithDepartmentsDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOrganizationById(Guid publicId)
    {
        var query = new GetOrganizationById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("organizations/create")]
    [ProducesResponseType(typeof(ApiResult<OrganizationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<OrganizationDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateOrganization([FromBody] CreateOrganization.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("organizations/update")]
    [ProducesResponseType(typeof(ApiResult<OrganizationWithDepartmentsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<OrganizationWithDepartmentsDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<OrganizationWithDepartmentsDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateOrganization([FromBody] UpdateOrganization.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Departments endpoints
    [HttpGet("departments")]
    [ProducesResponseType(typeof(PagedResult<DepartmentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDepartments([FromQuery] GetDepartments.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("departments/{publicId}")]
    [ProducesResponseType(typeof(ApiResult<DepartmentWithOrganizationDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<DepartmentWithOrganizationDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDepartmentById(Guid publicId)
    {
        var query = new GetDepartmentById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpPost("departments/create")]
    [ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartment.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("departments/update")]
    [ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResult<DepartmentDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateDepartment([FromBody] UpdateDepartment.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // Delete endpoints
    [HttpPost("organizations/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteOrganization([FromBody] DeleteOrganization.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("departments/delete")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteDepartment([FromBody] DeleteDepartment.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    // User-Department assignment endpoints
    [HttpPost("departments/users/assign")]
    [ProducesResponseType(typeof(ApiResult<UserDepartmentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<UserDepartmentDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignUserToDepartment([FromBody] AssignUserToDepartment.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpPost("departments/users/remove")]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveUserFromDepartment([FromBody] RemoveUserFromDepartment.Command command)
    {
        var result = await _sender.Send(command);
        return Ok(result);
    }

    [HttpGet("departments/{departmentPublicId}/users")]
    [ProducesResponseType(typeof(PagedResult<DepartmentUserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDepartmentUsers(Guid departmentPublicId, [FromQuery] GetDepartmentUsers.Query query)
    {
        query.DepartmentPublicId = departmentPublicId;
        var result = await _sender.Send(query);
        return Ok(result);
    }
}

[ApiController]
[Route("api/mobile/common")]
[AllowAnonymous]
public class CommonMobileController : ControllerBase
{
    private readonly ISender _sender;

    public CommonMobileController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("organizations")]
    [ProducesResponseType(typeof(PagedResult<OrganizationMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMobileOrganizations([FromQuery] GetMobileOrganizations.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("organizations/{publicId}")]
    [ProducesResponseType(typeof(ApiResult<OrganizationMobileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<OrganizationMobileDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMobileOrganizationById(Guid publicId)
    {
        var query = new GetMobileOrganizationById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("departments")]
    [ProducesResponseType(typeof(PagedResult<DepartmentMobileDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMobileDepartments([FromQuery] GetMobileDepartments.Query query)
    {
        var result = await _sender.Send(query);
        return Ok(result);
    }

    [HttpGet("departments/{publicId}")]
    [ProducesResponseType(typeof(ApiResult<DepartmentMobileDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResult<DepartmentMobileDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMobileDepartmentById(Guid publicId)
    {
        var query = new GetMobileDepartmentById.Query { PublicId = publicId };
        var result = await _sender.Send(query);
        return Ok(result);
    }
}
