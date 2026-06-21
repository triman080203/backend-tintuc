using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class FixHotelImageForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HotelImages_Hotels_HotelId1",
                schema: "PLACES",
                table: "HotelImages");

            migrationBuilder.DropIndex(
                name: "IX_HotelImages_HotelId1",
                schema: "PLACES",
                table: "HotelImages");

            migrationBuilder.DropColumn(
                name: "HotelId1",
                schema: "PLACES",
                table: "HotelImages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HotelId1",
                schema: "PLACES",
                table: "HotelImages",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HotelImages_HotelId1",
                schema: "PLACES",
                table: "HotelImages",
                column: "HotelId1");

            migrationBuilder.AddForeignKey(
                name: "FK_HotelImages_Hotels_HotelId1",
                schema: "PLACES",
                table: "HotelImages",
                column: "HotelId1",
                principalSchema: "PLACES",
                principalTable: "Hotels",
                principalColumn: "Id");
        }
    }
}
