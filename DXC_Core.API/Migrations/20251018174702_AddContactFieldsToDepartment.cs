using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations
{
    /// <inheritdoc />
    public partial class AddContactFieldsToDepartment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                schema: "COMMON",
                table: "Departments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                schema: "COMMON",
                table: "Departments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactEmail",
                schema: "COMMON",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                schema: "COMMON",
                table: "Departments");
        }
    }
}
