using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using DXC_Core.API.Data.ZaloMiniAppContext;

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    [DbContext(typeof(ZaloMiniAppDbContext))]
    [Migration("20251128091500_ChangeTotalUserIdToString")]
    public partial class ChangeTotalUserIdToString : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TotalUsers_UserId",
                schema: "SERVICES",
                table: "TotalUsers");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                schema: "SERVICES",
                table: "TotalUsers",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_TotalUsers_UserId",
                schema: "SERVICES",
                table: "TotalUsers",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TotalUsers_UserId",
                schema: "SERVICES",
                table: "TotalUsers");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                schema: "SERVICES",
                table: "TotalUsers",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateIndex(
                name: "IX_TotalUsers_UserId",
                schema: "SERVICES",
                table: "TotalUsers",
                column: "UserId");
        }
    }
}
