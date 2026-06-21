using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.FileDb
{
    /// <inheritdoc />
    public partial class AddPublicIdToFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                schema: "FILES",
                table: "Files",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.CreateIndex(
                name: "IX_Files_PublicId",
                schema: "FILES",
                table: "Files",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Files_PublicId",
                schema: "FILES",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "PublicId",
                schema: "FILES",
                table: "Files");
        }
    }
}
