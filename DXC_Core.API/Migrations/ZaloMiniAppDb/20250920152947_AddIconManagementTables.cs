using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddIconManagementTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IconCategories",
                schema: "SERVICES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IconCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IconGroups",
                schema: "SERVICES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    IconCategoryId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IconGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IconGroups_IconCategories_IconCategoryId",
                        column: x => x.IconCategoryId,
                        principalSchema: "SERVICES",
                        principalTable: "IconCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Icons",
                schema: "SERVICES",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    IconCategoryId = table.Column<int>(type: "int", nullable: true),
                    IconGroupId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IconImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IconType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ScreenParams = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    WebLink = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Icons", x => x.Id);
                    table.CheckConstraint("CK_Icons_Parent", "([IconCategoryId] IS NOT NULL AND [IconGroupId] IS NULL) OR ([IconCategoryId] IS NULL AND [IconGroupId] IS NOT NULL) OR ([IconCategoryId] IS NOT NULL AND [IconGroupId] IS NOT NULL)");
                    table.CheckConstraint("CK_Icons_Type", "[IconType] IN ('native', 'web')");
                    table.ForeignKey(
                        name: "FK_Icons_IconCategories_IconCategoryId",
                        column: x => x.IconCategoryId,
                        principalSchema: "SERVICES",
                        principalTable: "IconCategories",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Icons_IconGroups_IconGroupId",
                        column: x => x.IconGroupId,
                        principalSchema: "SERVICES",
                        principalTable: "IconGroups",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_IconCategories_Name",
                schema: "SERVICES",
                table: "IconCategories",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IconCategories_PublicId",
                schema: "SERVICES",
                table: "IconCategories",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IconGroups_IconCategoryId",
                schema: "SERVICES",
                table: "IconGroups",
                column: "IconCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_IconGroups_PublicId",
                schema: "SERVICES",
                table: "IconGroups",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Icons_IconCategoryId",
                schema: "SERVICES",
                table: "Icons",
                column: "IconCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Icons_IconCategoryId_DisplayOrder",
                schema: "SERVICES",
                table: "Icons",
                columns: new[] { "IconCategoryId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Icons_IconGroupId",
                schema: "SERVICES",
                table: "Icons",
                column: "IconGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Icons_IconGroupId_DisplayOrder",
                schema: "SERVICES",
                table: "Icons",
                columns: new[] { "IconGroupId", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Icons_PublicId",
                schema: "SERVICES",
                table: "Icons",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Icons",
                schema: "SERVICES");

            migrationBuilder.DropTable(
                name: "IconGroups",
                schema: "SERVICES");

            migrationBuilder.DropTable(
                name: "IconCategories",
                schema: "SERVICES");
        }
    }
}
