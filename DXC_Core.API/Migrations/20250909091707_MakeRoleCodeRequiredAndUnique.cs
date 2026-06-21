using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations
{
    /// <inheritdoc />
    public partial class MakeRoleCodeRequiredAndUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Roles_Code",
                schema: "IDENTITY",
                table: "Roles");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "IDENTITY",
                table: "Roles",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Code",
                schema: "IDENTITY",
                table: "Roles",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Roles_Code",
                schema: "IDENTITY",
                table: "Roles");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                schema: "IDENTITY",
                table: "Roles",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Code",
                schema: "IDENTITY",
                table: "Roles",
                column: "Code",
                unique: true,
                filter: "[Code] IS NOT NULL");
        }
    }
}
