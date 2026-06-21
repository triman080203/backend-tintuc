using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DXC_Core.API.Data.ZaloMiniAppContext.Migrations
{
    /// <inheritdoc />
    public partial class AddChildPriceAndQuantities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ChildPrice",
                schema: "BOOKING",
                table: "Tickets",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "AdultQuantity",
                schema: "BOOKING",
                table: "BookingOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ChildQuantity",
                schema: "BOOKING",
                table: "BookingOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "DepartureTime",
                schema: "BOOKING",
                table: "BookingOrders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChildPrice",
                schema: "BOOKING",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "AdultQuantity",
                schema: "BOOKING",
                table: "BookingOrders");

            migrationBuilder.DropColumn(
                name: "ChildQuantity",
                schema: "BOOKING",
                table: "BookingOrders");

            migrationBuilder.DropColumn(
                name: "DepartureTime",
                schema: "BOOKING",
                table: "BookingOrders");
        }
    }
}
