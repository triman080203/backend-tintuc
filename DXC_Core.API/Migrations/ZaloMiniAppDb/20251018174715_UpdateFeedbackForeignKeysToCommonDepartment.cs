using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class UpdateFeedbackForeignKeysToCommonDepartment : Migration
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

            migrationBuilder.DropIndex(
                name: "IX_Department_Code",
                schema: "FEEDBACK",
                table: "Department");

            migrationBuilder.DropIndex(
                name: "IX_Department_PublicId",
                schema: "FEEDBACK",
                table: "Department");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "FEEDBACK",
                table: "Department",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<Guid>(
                name: "PublicId",
                schema: "FEEDBACK",
                table: "Department",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldDefaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "FEEDBACK",
                table: "Department",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "FEEDBACK",
                table: "Department",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                schema: "FEEDBACK",
                table: "Department",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<Guid>(
                name: "PublicId",
                schema: "FEEDBACK",
                table: "Department",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()",
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                schema: "FEEDBACK",
                table: "Department",
                type: "bit",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                schema: "FEEDBACK",
                table: "Department",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateIndex(
                name: "IX_Department_Code",
                schema: "FEEDBACK",
                table: "Department",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Department_PublicId",
                schema: "FEEDBACK",
                table: "Department",
                column: "PublicId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Feedback_Department_AssignedDepartmentId",
                schema: "FEEDBACK",
                table: "Feedback",
                column: "AssignedDepartmentId",
                principalSchema: "FEEDBACK",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_FeedbackProcessing_Department_AssignedDepartmentId",
                schema: "FEEDBACK",
                table: "FeedbackProcessing",
                column: "AssignedDepartmentId",
                principalSchema: "FEEDBACK",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_FeedbackResponse_Department_DepartmentId",
                schema: "FEEDBACK",
                table: "FeedbackResponse",
                column: "DepartmentId",
                principalSchema: "FEEDBACK",
                principalTable: "Department",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
