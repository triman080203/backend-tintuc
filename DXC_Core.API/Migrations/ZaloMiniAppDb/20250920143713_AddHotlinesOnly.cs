using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddHotlinesOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "SERVICES");
    
            migrationBuilder.CreateTable(
                name: "HotlineCategories",
                schema: "SERVICES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HotlineCategories", x => x.Id);
                });
    
            migrationBuilder.CreateTable(
                name: "Hotlines",
                schema: "SERVICES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ContactName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hotlines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hotlines_HotlineCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "SERVICES",
                        principalTable: "HotlineCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
    
            migrationBuilder.CreateIndex(
                name: "IX_HotlineCategories_Name",
                schema: "SERVICES",
                table: "HotlineCategories",
                column: "Name",
                unique: true);
    
            migrationBuilder.CreateIndex(
                name: "IX_HotlineCategories_PublicId",
                schema: "SERVICES",
                table: "HotlineCategories",
                column: "PublicId",
                unique: true);
    
            migrationBuilder.CreateIndex(
                name: "IX_Hotlines_CategoryId",
                schema: "SERVICES",
                table: "Hotlines",
                column: "CategoryId");
    
            migrationBuilder.CreateIndex(
                name: "IX_Hotlines_PublicId",
                schema: "SERVICES",
                table: "Hotlines",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Hotlines",
                schema: "SERVICES");
    
            migrationBuilder.DropTable(
                name: "HotlineCategories",
                schema: "SERVICES");
        }
    }
}
