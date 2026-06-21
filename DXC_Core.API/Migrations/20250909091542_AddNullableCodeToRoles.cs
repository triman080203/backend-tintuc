using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNullableCodeToRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                schema: "IDENTITY",
                table: "Roles",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Code",
                schema: "IDENTITY",
                table: "Roles",
                column: "Code",
                unique: true,
                filter: "[Code] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Roles_Code",
                schema: "IDENTITY",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "Code",
                schema: "IDENTITY",
                table: "Roles");
        }
    }
}
