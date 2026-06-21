using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddKhaoSatSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "KHAOSAT");

            migrationBuilder.CreateTable(
                name: "KhaoSats",
                schema: "KHAOSAT",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenKhaoSat = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ThoiGian = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DisplayWebsite = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Header = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Footer = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    VeViec = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhaoSats", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CauHois",
                schema: "KHAOSAT",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CauHoiTuLuan = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    STT = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHois", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CauHois_KhaoSats_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "KHAOSAT",
                        principalTable: "KhaoSats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TuLuans",
                schema: "KHAOSAT",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    CauHoiTuLuan = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TuLuans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TuLuans_KhaoSats_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "KHAOSAT",
                        principalTable: "KhaoSats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "YKienKhacs",
                schema: "KHAOSAT",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    YKienKhac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YKienKhacs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_YKienKhacs_KhaoSats_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "KHAOSAT",
                        principalTable: "KhaoSats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TraLois",
                schema: "KHAOSAT",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    TraLoi = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TraLois", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TraLois_CauHois_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "KHAOSAT",
                        principalTable: "CauHois",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Responses",
                schema: "KHAOSAT",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    IDUser = table.Column<long>(type: "bigint", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    AnswerId = table.Column<int>(type: "int", nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Responses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Responses_CauHois_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "KHAOSAT",
                        principalTable: "CauHois",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Responses_KhaoSats_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "KHAOSAT",
                        principalTable: "KhaoSats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Responses_TraLois_AnswerId",
                        column: x => x.AnswerId,
                        principalSchema: "KHAOSAT",
                        principalTable: "TraLois",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CauHois_SurveyId",
                schema: "KHAOSAT",
                table: "CauHois",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_Responses_AnswerId",
                schema: "KHAOSAT",
                table: "Responses",
                column: "AnswerId");

            migrationBuilder.CreateIndex(
                name: "IX_Responses_QuestionId",
                schema: "KHAOSAT",
                table: "Responses",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Responses_SurveyId_IDUser",
                schema: "KHAOSAT",
                table: "Responses",
                columns: new[] { "SurveyId", "IDUser" });

            migrationBuilder.CreateIndex(
                name: "IX_TraLois_QuestionId",
                schema: "KHAOSAT",
                table: "TraLois",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_TuLuans_SurveyId",
                schema: "KHAOSAT",
                table: "TuLuans",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_YKienKhacs_SurveyId",
                schema: "KHAOSAT",
                table: "YKienKhacs",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_YKienKhacs_UserID",
                schema: "KHAOSAT",
                table: "YKienKhacs",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Responses",
                schema: "KHAOSAT");

            migrationBuilder.DropTable(
                name: "TuLuans",
                schema: "KHAOSAT");

            migrationBuilder.DropTable(
                name: "YKienKhacs",
                schema: "KHAOSAT");

            migrationBuilder.DropTable(
                name: "TraLois",
                schema: "KHAOSAT");

            migrationBuilder.DropTable(
                name: "CauHois",
                schema: "KHAOSAT");

            migrationBuilder.DropTable(
                name: "KhaoSats",
                schema: "KHAOSAT");
        }
    }
}
