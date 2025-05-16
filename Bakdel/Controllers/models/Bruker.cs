namespace Back.Models;

public class Bruker
{
    public int id { get; set; }
    public required string fornavn { get; set; }
    public required string etternavn { get; set; }
    public required string førerkortNummer { get; set; }
};