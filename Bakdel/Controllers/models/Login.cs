using Microsoft.AspNetCore.SignalR;

namespace Back.Models;

public class Login
{
    public int id { get; set; }
    public required string brukernavn { get; set; }
    public required string passord { get; set; }
};