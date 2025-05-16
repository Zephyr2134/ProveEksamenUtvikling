using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Back.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Biler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    registreringsNummer = table.Column<string>(type: "TEXT", nullable: false),
                    merke = table.Column<string>(type: "TEXT", nullable: false),
                    modell = table.Column<string>(type: "TEXT", nullable: false),
                    tilgjengelig = table.Column<bool>(type: "INTEGER", nullable: false),
                    bildePlassering = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Biler", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Brukere",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    fornavn = table.Column<string>(type: "TEXT", nullable: false),
                    etternavn = table.Column<string>(type: "TEXT", nullable: false),
                    førerkortNummer = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brukere", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Låneavtaler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    registreringsNummer = table.Column<string>(type: "TEXT", nullable: false),
                    førerkortNummer = table.Column<string>(type: "TEXT", nullable: false),
                    startDato = table.Column<DateTime>(type: "TEXT", nullable: false),
                    sluttDato = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Låneavtaler", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Biler");

            migrationBuilder.DropTable(
                name: "Brukere");

            migrationBuilder.DropTable(
                name: "Låneavtaler");
        }
    }
}
