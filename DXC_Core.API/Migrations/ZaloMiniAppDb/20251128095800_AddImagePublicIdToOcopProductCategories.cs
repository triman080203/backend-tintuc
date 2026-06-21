using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using DXC_Core.API.Data.ZaloMiniAppContext;

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    [DbContext(typeof(ZaloMiniAppDbContext))]
    [Migration("20251128095800_AddImagePublicIdToOcopProductCategories")]
    public partial class AddImagePublicIdToOcopProductCategories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ImagePublicId",
                schema: "PRODUCTS",
                table: "OcopProductCategories",
                type: "uniqueidentifier",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePublicId",
                schema: "PRODUCTS",
                table: "OcopProductCategories");
        }
    }
}

