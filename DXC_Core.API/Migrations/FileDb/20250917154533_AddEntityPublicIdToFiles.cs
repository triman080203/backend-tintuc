using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations.FileDb
{
    /// <inheritdoc />
    public partial class AddEntityPublicIdToFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EntityPublicId",
                schema: "FILES",
                table: "Files",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Files_EntityPublicId_EntityType",
                schema: "FILES",
                table: "Files",
                columns: new[] { "EntityPublicId", "EntityType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Files_EntityPublicId_EntityType",
                schema: "FILES",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "EntityPublicId",
                schema: "FILES",
                table: "Files");
        }
    }
}
