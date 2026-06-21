using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DXC_Core.API.Data.ZaloMiniAppContext.Migrations
{
    /// <inheritdoc />
    public partial class AddTinTucSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "TINTUC");

            migrationBuilder.CreateTable(
                name: "ArticleCategories",
                schema: "TINTUC",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticleCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ArticleStatuses",
                schema: "TINTUC",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Color = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticleStatuses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Articles",
                schema: "TINTUC",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CurrentStatusId = table.Column<int>(type: "int", nullable: false),
                    AuthorUserPublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AuthorName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EditorUserPublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ViewCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsPublic = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    PublishedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Articles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Articles_ArticleCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalSchema: "TINTUC",
                        principalTable: "ArticleCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Articles_ArticleStatuses_CurrentStatusId",
                        column: x => x.CurrentStatusId,
                        principalSchema: "TINTUC",
                        principalTable: "ArticleStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ArticleAttachments",
                schema: "TINTUC",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    ArticleId = table.Column<int>(type: "int", nullable: false),
                    FilePublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticleAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArticleAttachments_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalSchema: "TINTUC",
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ArticleProcessingHistory",
                schema: "TINTUC",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    ArticleId = table.Column<int>(type: "int", nullable: false),
                    FromStatusId = table.Column<int>(type: "int", nullable: false),
                    ToStatusId = table.Column<int>(type: "int", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ActorUserPublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ActorName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Note = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArticleProcessingHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArticleProcessingHistory_ArticleStatuses_FromStatusId",
                        column: x => x.FromStatusId,
                        principalSchema: "TINTUC",
                        principalTable: "ArticleStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ArticleProcessingHistory_ArticleStatuses_ToStatusId",
                        column: x => x.ToStatusId,
                        principalSchema: "TINTUC",
                        principalTable: "ArticleStatuses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ArticleProcessingHistory_Articles_ArticleId",
                        column: x => x.ArticleId,
                        principalSchema: "TINTUC",
                        principalTable: "Articles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                schema: "TINTUC",
                table: "ArticleStatuses",
                columns: new[] { "Id", "Code", "Color", "CreatedAt", "Description", "IsActive", "Name", "PublicId", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "draft", "#6B7280", new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5693), null, true, "Bản nháp", new Guid("46cdf1cd-162a-46b8-bc13-1e239a235688"), 1, new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5694) },
                    { 2, "pending_review", "#F59E0B", new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5700), null, true, "Chờ duyệt", new Guid("0b2bed90-a5c2-489a-8854-047bc14df796"), 2, new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5701) },
                    { 3, "returned", "#EF4444", new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5705), null, true, "Trả lại", new Guid("86a02e13-e6ba-40e1-890c-24094cef7d96"), 3, new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5706) },
                    { 4, "approved", "#3B82F6", new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5719), null, true, "Đã duyệt", new Guid("200154d7-8899-4367-8a4a-bf1a2954043c"), 4, new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5720) },
                    { 5, "published", "#10B981", new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5724), null, true, "Đã xuất bản", new Guid("c68a8ab8-63c8-41a6-ab68-e550fe89cb42"), 5, new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5724) },
                    { 6, "archived", "#9CA3AF", new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5728), null, true, "Thu hồi", new Guid("9c007f39-0ffa-4d75-a813-b2d13cdf3931"), 6, new DateTime(2026, 6, 21, 14, 14, 53, 424, DateTimeKind.Utc).AddTicks(5729) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ArticleAttachments_ArticleId",
                schema: "TINTUC",
                table: "ArticleAttachments",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_ArticleAttachments_PublicId",
                schema: "TINTUC",
                table: "ArticleAttachments",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ArticleCategories_PublicId",
                schema: "TINTUC",
                table: "ArticleCategories",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ArticleCategories_Slug",
                schema: "TINTUC",
                table: "ArticleCategories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ArticleProcessingHistory_ArticleId",
                schema: "TINTUC",
                table: "ArticleProcessingHistory",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_ArticleProcessingHistory_FromStatusId",
                schema: "TINTUC",
                table: "ArticleProcessingHistory",
                column: "FromStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_ArticleProcessingHistory_PublicId",
                schema: "TINTUC",
                table: "ArticleProcessingHistory",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ArticleProcessingHistory_ToStatusId",
                schema: "TINTUC",
                table: "ArticleProcessingHistory",
                column: "ToStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_CategoryId",
                schema: "TINTUC",
                table: "Articles",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_CurrentStatusId",
                schema: "TINTUC",
                table: "Articles",
                column: "CurrentStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Articles_PublicId",
                schema: "TINTUC",
                table: "Articles",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Articles_Slug",
                schema: "TINTUC",
                table: "Articles",
                column: "Slug",
                unique: true,
                filter: "[Slug] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ArticleStatuses_Code",
                schema: "TINTUC",
                table: "ArticleStatuses",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ArticleStatuses_PublicId",
                schema: "TINTUC",
                table: "ArticleStatuses",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ArticleAttachments",
                schema: "TINTUC");

            migrationBuilder.DropTable(
                name: "ArticleProcessingHistory",
                schema: "TINTUC");

            migrationBuilder.DropTable(
                name: "Articles",
                schema: "TINTUC");

            migrationBuilder.DropTable(
                name: "ArticleCategories",
                schema: "TINTUC");

            migrationBuilder.DropTable(
                name: "ArticleStatuses",
                schema: "TINTUC");
        }
    }
}
