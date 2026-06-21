using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using DXC_Core.API.Data.ZaloMiniAppContext;

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    [DbContext(typeof(ZaloMiniAppDbContext))]
    [Migration("20251128100500_AddImagePublicIdToOcopProductImages")]
    public partial class AddImagePublicIdToOcopProductImages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ImagePublicId",
                schema: "PRODUCTS",
                table: "OcopProductImages",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePublicId",
                schema: "PRODUCTS",
                table: "OcopProductImages");
        }
    }
}

