using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddWebsiteAndLinkVitriToHomestays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LinkVitri",
                schema: "PLACES",
                table: "Homestays",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Website",
                schema: "PLACES",
                table: "Homestays",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LinkVitri",
                schema: "PLACES",
                table: "Homestays");

            migrationBuilder.DropColumn(
                name: "Website",
                schema: "PLACES",
                table: "Homestays");
        }
    }
}
