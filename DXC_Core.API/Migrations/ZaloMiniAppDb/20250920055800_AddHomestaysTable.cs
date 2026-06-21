using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddHomestaysTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Tạo bảng Homestays
            migrationBuilder.CreateTable(
                name: "Homestays",
                schema: "PLACES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    AveragePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AveragePriceCurrency = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(10,8)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(11,8)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Homestays", x => x.Id);
                });

            // Tạo bảng HomestayImages
            migrationBuilder.CreateTable(
                name: "HomestayImages",
                schema: "PLACES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    HomestayId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Caption = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomestayImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HomestayImages_Homestays_HomestayId",
                        column: x => x.HomestayId,
                        principalSchema: "PLACES",
                        principalTable: "Homestays",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Tạo indexes
            migrationBuilder.CreateIndex(
                name: "IX_Homestays_PublicId",
                schema: "PLACES",
                table: "Homestays",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HomestayImages_PublicId",
                schema: "PLACES",
                table: "HomestayImages",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HomestayImages_HomestayId",
                schema: "PLACES",
                table: "HomestayImages",
                column: "HomestayId");

            migrationBuilder.CreateIndex(
                name: "IX_HomestayImages_HomestayId_DisplayOrder",
                schema: "PLACES",
                table: "HomestayImages",
                columns: new[] { "HomestayId", "DisplayOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HomestayImages",
                schema: "PLACES");

            migrationBuilder.DropTable(
                name: "Homestays",
                schema: "PLACES");
        }
    }
}