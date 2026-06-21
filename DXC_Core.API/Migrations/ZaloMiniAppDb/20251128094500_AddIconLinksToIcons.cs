using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using DXC_Core.API.Data.ZaloMiniAppContext;

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    [DbContext(typeof(ZaloMiniAppDbContext))]
    [Migration("20251128094500_AddIconLinksToIcons")]
    public partial class AddIconLinksToIcons : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LinkAndroid",
                schema: "SERVICES",
                table: "Icons",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkIOS",
                schema: "SERVICES",
                table: "Icons",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LinkAndroid",
                schema: "SERVICES",
                table: "Icons");

            migrationBuilder.DropColumn(
                name: "LinkIOS",
                schema: "SERVICES",
                table: "Icons");
        }
    }
}
