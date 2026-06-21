using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddIsActiveToOcopProductImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "PRODUCTS",
                table: "OcopProductImages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "OcopEnterpriseDocuments",
                schema: "PRODUCTS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    EnterpriseId = table.Column<int>(type: "int", nullable: false),
                    DocumentUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DocumentName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OcopEnterpriseDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OcopEnterpriseDocuments_OcopEnterprises_EnterpriseId",
                        column: x => x.EnterpriseId,
                        principalSchema: "PRODUCTS",
                        principalTable: "OcopEnterprises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OcopEnterpriseDocuments_EnterpriseId",
                schema: "PRODUCTS",
                table: "OcopEnterpriseDocuments",
                column: "EnterpriseId");

            migrationBuilder.CreateIndex(
                name: "IX_OcopEnterpriseDocuments_EnterpriseId_DisplayOrder",
                schema: "PRODUCTS",
                table: "OcopEnterpriseDocuments",
                columns: new[] { "EnterpriseId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_OcopEnterpriseDocuments_PublicId",
                schema: "PRODUCTS",
                table: "OcopEnterpriseDocuments",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OcopEnterpriseDocuments",
                schema: "PRODUCTS");

            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "PRODUCTS",
                table: "OcopProductImages");
        }
    }
}
