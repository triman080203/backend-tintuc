using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class RemoveFeedbackDepartmentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedback_Department_AssignedDepartmentId",
                schema: "FEEDBACK",
                table: "Feedback");

            migrationBuilder.DropForeignKey(
                name: "FK_FeedbackProcessing_Department_AssignedDepartmentId",
                schema: "FEEDBACK",
                table: "FeedbackProcessing");

            migrationBuilder.DropForeignKey(
                name: "FK_FeedbackResponse_Department_DepartmentId",
                schema: "FEEDBACK",
                table: "FeedbackResponse");

            migrationBuilder.DropTable(
                name: "Department",
                schema: "FEEDBACK");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Department",
                schema: "FEEDBACK",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ContactEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Feedback_Department_AssignedDepartmentId",
                schema: "FEEDBACK",
                table: "Feedback",
                column: "AssignedDepartmentId",
                principalSchema: "FEEDBACK",
                principalTable: "Department",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FeedbackProcessing_Department_AssignedDepartmentId",
                schema: "FEEDBACK",
                table: "FeedbackProcessing",
                column: "AssignedDepartmentId",
                principalSchema: "FEEDBACK",
                principalTable: "Department",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FeedbackResponse_Department_DepartmentId",
                schema: "FEEDBACK",
                table: "FeedbackResponse",
                column: "DepartmentId",
                principalSchema: "FEEDBACK",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
