namespace Back.Models;

public class Bil
{
    public int id { get; set; }
    public required string registreringsNummer { get; set; }
    public required string merke { get; set; }
    public required string modell { get; set; }
    public bool tilgjengelig { get; set; }
    public required string bildePlassering { get; set; }
};