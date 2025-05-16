using Microsoft.EntityFrameworkCore;
using Back.Models;
namespace Back.Data;

public class AppDbContext : DbContext
{
    public DbSet<Bil> Biler { get; set; }
    public DbSet<Bruker> Brukere { get; set; }
    public DbSet<Låneavtale> Låneavtaler { get; set; }
    public DbSet<Login> LoginBrukere { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
};