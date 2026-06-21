using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Infrastructure;
using DXC_Core.API.Data.ZaloMiniAppContext;

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    [DbContext(typeof(ZaloMiniAppDbContext))]
    [Migration("20251128090000_AddTotalUsersTable")]
    public partial class AddTotalUsersTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TotalUsers",
                schema: "SERVICES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PhanQuyen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TotalUsers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TotalUsers_UserId",
                schema: "SERVICES",
                table: "TotalUsers",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TotalUsers",
                schema: "SERVICES");
        }
    }
}
