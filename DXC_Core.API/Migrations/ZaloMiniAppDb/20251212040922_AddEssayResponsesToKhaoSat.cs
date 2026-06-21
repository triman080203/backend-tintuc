using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddEssayResponsesToKhaoSat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EssayResponses",
                schema: "KHAOSAT",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    IDUser = table.Column<long>(type: "bigint", nullable: false),
                    EssayQuestionId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EssayResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EssayResponses_KhaoSats_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "KHAOSAT",
                        principalTable: "KhaoSats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EssayResponses_TuLuans_EssayQuestionId",
                        column: x => x.EssayQuestionId,
                        principalSchema: "KHAOSAT",
                        principalTable: "TuLuans",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_EssayResponses_EssayQuestionId",
                schema: "KHAOSAT",
                table: "EssayResponses",
                column: "EssayQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EssayResponses_SurveyId_IDUser",
                schema: "KHAOSAT",
                table: "EssayResponses",
                columns: new[] { "SurveyId", "IDUser" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EssayResponses",
                schema: "KHAOSAT");
        }
    }
}
