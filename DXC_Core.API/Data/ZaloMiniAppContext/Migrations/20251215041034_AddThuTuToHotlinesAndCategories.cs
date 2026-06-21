using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Data.ZaloMiniAppContext.Migrations
{
    /// <inheritdoc />
    public partial class AddThuTuToHotlinesAndCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ThuTu",
                schema: "SERVICES",
                table: "Hotlines",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ThuTu",
                schema: "SERVICES",
                table: "HotlineCategories",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThuTu",
                schema: "SERVICES",
                table: "Hotlines");

            migrationBuilder.DropColumn(
                name: "ThuTu",
                schema: "SERVICES",
                table: "HotlineCategories");
        }
    }
}
