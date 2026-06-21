using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddOcopProductsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "PRODUCTS");

            migrationBuilder.CreateTable(
                name: "OcopEnterprises",
                schema: "PRODUCTS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Representative = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TaxCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    EstablishedYear = table.Column<int>(type: "int", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OcopCertificateNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(10,8)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(11,8)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OcopEnterprises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OcopProductCategories",
                schema: "PRODUCTS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OcopProductCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OcopProducts",
                schema: "PRODUCTS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    EnterpriseId = table.Column<int>(type: "int", nullable: false),
                    ReferencePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PromotionalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ContactPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ContactAddress = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Latitude = table.Column<decimal>(type: "decimal(10,8)", nullable: true),
                    Longitude = table.Column<decimal>(type: "decimal(11,8)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OcopProducts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OcopProducts_OcopEnterprises_EnterpriseId",
                        column: x => x.EnterpriseId,
                        principalSchema: "PRODUCTS",
                        principalTable: "OcopEnterprises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OcopProducts_OcopProductCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "PRODUCTS",
                        principalTable: "OcopProductCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OcopProductImages",
                schema: "PRODUCTS",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Caption = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OcopProductImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OcopProductImages_OcopProducts_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "PRODUCTS",
                        principalTable: "OcopProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OcopEnterprises_Latitude_Longitude",
                schema: "PRODUCTS",
                table: "OcopEnterprises",
                columns: new[] { "Latitude", "Longitude" });

            migrationBuilder.CreateIndex(
                name: "IX_OcopEnterprises_Name",
                schema: "PRODUCTS",
                table: "OcopEnterprises",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_OcopEnterprises_PublicId",
                schema: "PRODUCTS",
                table: "OcopEnterprises",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OcopEnterprises_TaxCode",
                schema: "PRODUCTS",
                table: "OcopEnterprises",
                column: "TaxCode");

            migrationBuilder.CreateIndex(
                name: "IX_OcopProductCategories_IsActive_DisplayOrder",
                schema: "PRODUCTS",
                table: "OcopProductCategories",
                columns: new[] { "IsActive", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_OcopProductCategories_Name",
                schema: "PRODUCTS",
                table: "OcopProductCategories",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OcopProductCategories_PublicId",
                schema: "PRODUCTS",
                table: "OcopProductCategories",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OcopProductImages_ProductId",
                schema: "PRODUCTS",
                table: "OcopProductImages",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_OcopProductImages_ProductId_DisplayOrder",
                schema: "PRODUCTS",
                table: "OcopProductImages",
                columns: new[] { "ProductId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_OcopProductImages_PublicId",
                schema: "PRODUCTS",
                table: "OcopProductImages",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OcopProducts_CategoryId",
                schema: "PRODUCTS",
                table: "OcopProducts",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_OcopProducts_EnterpriseId",
                schema: "PRODUCTS",
                table: "OcopProducts",
                column: "EnterpriseId");

            migrationBuilder.CreateIndex(
                name: "IX_OcopProducts_Latitude_Longitude",
                schema: "PRODUCTS",
                table: "OcopProducts",
                columns: new[] { "Latitude", "Longitude" });

            migrationBuilder.CreateIndex(
                name: "IX_OcopProducts_Name",
                schema: "PRODUCTS",
                table: "OcopProducts",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_OcopProducts_PublicId",
                schema: "PRODUCTS",
                table: "OcopProducts",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OcopProductImages",
                schema: "PRODUCTS");

            migrationBuilder.DropTable(
                name: "OcopProducts",
                schema: "PRODUCTS");

            migrationBuilder.DropTable(
                name: "OcopEnterprises",
                schema: "PRODUCTS");

            migrationBuilder.DropTable(
                name: "OcopProductCategories",
                schema: "PRODUCTS");
        }
    }
}
