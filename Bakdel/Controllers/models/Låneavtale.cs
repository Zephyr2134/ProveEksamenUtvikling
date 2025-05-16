namespace Back.Models;
public class Låneavtale
{
    public int id { get; set; }
    public required string registreringsNummer { get; set; }
    public required string førerkortNummer { get; set; }
    public required DateTime startDato { get; set; }
    public required DateTime sluttDato { get; set; }
    public bool avsluttet { get; set; }
};