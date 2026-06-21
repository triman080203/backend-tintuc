using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddIconGroupImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ImagePublicId",
                schema: "SERVICES",
                table: "IconGroups",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                schema: "SERVICES",
                table: "IconGroups",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_IconGroups_ImagePublicId",
                schema: "SERVICES",
                table: "IconGroups",
                column: "ImagePublicId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_IconGroups_ImagePublicId",
                schema: "SERVICES",
                table: "IconGroups");

            migrationBuilder.DropColumn(
                name: "ImagePublicId",
                schema: "SERVICES",
                table: "IconGroups");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                schema: "SERVICES",
                table: "IconGroups");
        }
    }
}
