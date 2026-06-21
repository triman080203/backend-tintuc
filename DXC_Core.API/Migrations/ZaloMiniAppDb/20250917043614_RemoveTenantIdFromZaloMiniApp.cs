using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class RemoveTenantIdFromZaloMiniApp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Hotels_TenantId",
                schema: "PLACES",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_TenantId_IsActive",
                schema: "PLACES",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_HotelImages_TenantId",
                schema: "PLACES",
                table: "HotelImages");

            migrationBuilder.DropColumn(
                name: "TenantId",
                schema: "PLACES",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "TenantId",
                schema: "PLACES",
                table: "HotelImages");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                schema: "PLACES",
                table: "Hotels",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                schema: "PLACES",
                table: "HotelImages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_TenantId",
                schema: "PLACES",
                table: "Hotels",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_TenantId_IsActive",
                schema: "PLACES",
                table: "Hotels",
                columns: new[] { "TenantId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_HotelImages_TenantId",
                schema: "PLACES",
                table: "HotelImages",
                column: "TenantId");
        }
    }
}
