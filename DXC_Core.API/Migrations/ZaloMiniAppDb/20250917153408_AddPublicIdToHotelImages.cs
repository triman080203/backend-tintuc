using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddPublicIdToHotelImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                schema: "PLACES",
                table: "HotelImages",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.CreateIndex(
                name: "IX_HotelImages_PublicId",
                schema: "PLACES",
                table: "HotelImages",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_HotelImages_PublicId",
                schema: "PLACES",
                table: "HotelImages");

            migrationBuilder.DropColumn(
                name: "PublicId",
                schema: "PLACES",
                table: "HotelImages");
        }
    }
}
