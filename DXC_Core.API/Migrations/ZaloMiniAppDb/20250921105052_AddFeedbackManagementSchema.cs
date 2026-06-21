using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.ZaloMiniAppDb
{
    /// <inheritdoc />
    public partial class AddFeedbackManagementSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "FEEDBACK");

            migrationBuilder.CreateTable(
                name: "Department",
                schema: "FEEDBACK",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ContactEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ContactPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FeedbackStatus",
                schema: "FEEDBACK",
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
                    table.PrimaryKey("PK_FeedbackStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                schema: "FEEDBACK",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Location = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsPublic = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CurrentStatusId = table.Column<int>(type: "int", nullable: false),
                    AssignedDepartmentId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedback", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Feedback_Department_AssignedDepartmentId",
                        column: x => x.AssignedDepartmentId,
                        principalSchema: "FEEDBACK",
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Feedback_FeedbackStatus_CurrentStatusId",
                        column: x => x.CurrentStatusId,
                        principalSchema: "FEEDBACK",
                        principalTable: "FeedbackStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FeedbackAttachment",
                schema: "FEEDBACK",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    FeedbackId = table.Column<int>(type: "int", nullable: false),
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
                    table.PrimaryKey("PK_FeedbackAttachment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeedbackAttachment_Feedback_FeedbackId",
                        column: x => x.FeedbackId,
                        principalSchema: "FEEDBACK",
                        principalTable: "Feedback",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FeedbackProcessing",
                schema: "FEEDBACK",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    FeedbackId = table.Column<int>(type: "int", nullable: false),
                    FromStatusId = table.Column<int>(type: "int", nullable: false),
                    ToStatusId = table.Column<int>(type: "int", nullable: false),
                    AssignedDepartmentId = table.Column<int>(type: "int", nullable: true),
                    AssignedByUserPublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ProcessingNote = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedbackProcessing", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeedbackProcessing_Department_AssignedDepartmentId",
                        column: x => x.AssignedDepartmentId,
                        principalSchema: "FEEDBACK",
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_FeedbackProcessing_FeedbackStatus_FromStatusId",
                        column: x => x.FromStatusId,
                        principalSchema: "FEEDBACK",
                        principalTable: "FeedbackStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeedbackProcessing_FeedbackStatus_ToStatusId",
                        column: x => x.ToStatusId,
                        principalSchema: "FEEDBACK",
                        principalTable: "FeedbackStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeedbackProcessing_Feedback_FeedbackId",
                        column: x => x.FeedbackId,
                        principalSchema: "FEEDBACK",
                        principalTable: "Feedback",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FeedbackResponse",
                schema: "FEEDBACK",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    FeedbackId = table.Column<int>(type: "int", nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    ResponseContent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ResponseAttachments = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsApproved = table.Column<bool>(type: "bit", nullable: true),
                    ApprovedByUserPublicId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovalNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedbackResponse", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeedbackResponse_Department_DepartmentId",
                        column: x => x.DepartmentId,
                        principalSchema: "FEEDBACK",
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeedbackResponse_Feedback_FeedbackId",
                        column: x => x.FeedbackId,
                        principalSchema: "FEEDBACK",
                        principalTable: "Feedback",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_AssignedDepartmentId",
                schema: "FEEDBACK",
                table: "Feedback",
                column: "AssignedDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_CurrentStatusId",
                schema: "FEEDBACK",
                table: "Feedback",
                column: "CurrentStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_Feedback_PublicId",
                schema: "FEEDBACK",
                table: "Feedback",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackAttachment_FeedbackId",
                schema: "FEEDBACK",
                table: "FeedbackAttachment",
                column: "FeedbackId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackAttachment_PublicId",
                schema: "FEEDBACK",
                table: "FeedbackAttachment",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackProcessing_AssignedDepartmentId",
                schema: "FEEDBACK",
                table: "FeedbackProcessing",
                column: "AssignedDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackProcessing_FeedbackId",
                schema: "FEEDBACK",
                table: "FeedbackProcessing",
                column: "FeedbackId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackProcessing_FromStatusId",
                schema: "FEEDBACK",
                table: "FeedbackProcessing",
                column: "FromStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackProcessing_PublicId",
                schema: "FEEDBACK",
                table: "FeedbackProcessing",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackProcessing_ToStatusId",
                schema: "FEEDBACK",
                table: "FeedbackProcessing",
                column: "ToStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackResponse_DepartmentId",
                schema: "FEEDBACK",
                table: "FeedbackResponse",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackResponse_FeedbackId",
                schema: "FEEDBACK",
                table: "FeedbackResponse",
                column: "FeedbackId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackResponse_PublicId",
                schema: "FEEDBACK",
                table: "FeedbackResponse",
                column: "PublicId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackStatus_Code",
                schema: "FEEDBACK",
                table: "FeedbackStatus",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackStatus_PublicId",
                schema: "FEEDBACK",
                table: "FeedbackStatus",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeedbackAttachment",
                schema: "FEEDBACK");

            migrationBuilder.DropTable(
                name: "FeedbackProcessing",
                schema: "FEEDBACK");

            migrationBuilder.DropTable(
                name: "FeedbackResponse",
                schema: "FEEDBACK");

            migrationBuilder.DropTable(
                name: "Feedback",
                schema: "FEEDBACK");

            migrationBuilder.DropTable(
                name: "Department",
                schema: "FEEDBACK");

            migrationBuilder.DropTable(
                name: "FeedbackStatus",
                schema: "FEEDBACK");
        }
    }
}
