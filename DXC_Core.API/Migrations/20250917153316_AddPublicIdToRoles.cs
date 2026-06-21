using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicIdToRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PublicId",
                schema: "IDENTITY",
                table: "Roles",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWSEQUENTIALID()");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_PublicId",
                schema: "IDENTITY",
                table: "Roles",
                column: "PublicId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Roles_PublicId",
                schema: "IDENTITY",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "PublicId",
                schema: "IDENTITY",
                table: "Roles");
        }
    }
}
