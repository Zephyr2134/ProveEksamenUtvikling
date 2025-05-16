using Back.Data;
using Back.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Back.Controllers;

[ApiController]
[Route("[controller]")]
public class LaanController : ControllerBase
{
    private readonly AppDbContext _context;

    public LaanController(AppDbContext context)
    {
        _context = context;
    }

    public static string Dekrypter(string kryptertData, string frase)
    {
        byte[] nøkkel;
        using (SHA256 sha256 = SHA256.Create())
        {
            nøkkel = sha256.ComputeHash(Encoding.UTF8.GetBytes(frase));
        }

        byte[] kombinertBytes = Convert.FromBase64String(kryptertData);
        byte[] iv = new byte[16];
        byte[] sifferTekst = new byte[kombinertBytes.Length - 16];
        Array.Copy(kombinertBytes, 0, iv, 0, 16);
        Array.Copy(kombinertBytes, 16, sifferTekst, 0, sifferTekst.Length);

        using (var aes = Aes.Create())
        {
            aes.Key = nøkkel;
            aes.IV = iv;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using (var ms = new MemoryStream(sifferTekst))
            using (var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read))
            using (var leser = new StreamReader(cs))
            {
                return leser.ReadToEnd();
            }
        }
    }


    [HttpPost("login")]
    public async Task<ActionResult<Login>> login([FromBody] LoginForespørsel loginStreng)
    {
        var dekryptertStreng = Dekrypter(loginStreng.Data, "Your32ByteLongPassphraseHere");
        Login loginInfo = JsonSerializer.Deserialize<Login>(dekryptertStreng);
        var bruker = await _context.LoginBrukere.FirstOrDefaultAsync(u => u.brukernavn == loginInfo.brukernavn && u.passord == loginInfo.passord);
        if (bruker == null)
        {
            return BadRequest();
        }
        return Ok(bruker);
    }
    [HttpPost("lagBruker")]
    public async Task<ActionResult> lagBruker([FromBody] LoginForespørsel nyBruker)
    {
        var dekryptertStreng = Dekrypter(nyBruker.Data, "Your32ByteLongPassphraseHere");
        Login loginInfo = JsonSerializer.Deserialize<Login>(dekryptertStreng);

        if (loginInfo.brukernavn == "" || loginInfo.passord == "")
        {
            return BadRequest();
        }
        var bruker = await _context.LoginBrukere.FirstOrDefaultAsync(u => u.brukernavn == loginInfo.brukernavn || u.passord == loginInfo.passord || u.forerkortnummer == loginInfo.forerkortnummer);
        if (bruker == null)
        {
            _context.LoginBrukere.Add(loginInfo);
            await _context.SaveChangesAsync();
            return Ok(); 
        }
        return BadRequest();
    }

    [HttpPost("bilde")]
    public async Task<IActionResult> LastOppBilde([FromForm] IFormFile bilde)
    {
        if (bilde == null || bilde.Length == 0)
        {
            return BadRequest("Ingen bilde gitt");
        }
        var mappe = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(mappe))
        {
            Directory.CreateDirectory(mappe);
        }
        var filNavn = Path.GetFileName(bilde.FileName);
        var filPlassering = Path.Combine(mappe, filNavn);

        using (var strøm = new FileStream(filPlassering, FileMode.Create))
        {
            await bilde.CopyToAsync(strøm);
        }
        return Ok(new { filPlassering = $"/uploads/{filNavn}" });
    }

    [HttpGet("brukere")]
    public async Task<ActionResult<IEnumerable<Bruker>>> HentBrukere()
    {
        var brukere = await _context.Brukere.ToListAsync();
        return Ok(brukere);
    }
    [HttpGet("bruker/{id}")]
    public async Task<ActionResult<Bruker>> HentBruker(int id)
    {
        var bruker = await _context.Brukere.FindAsync(id);
        if (bruker == null)
        {
            return NotFound();
        }
        return Ok(bruker);
    }
    [HttpPost("bruker")]
    public async Task<ActionResult<Bruker>> LagBruker([FromBody] Bruker bruker)
    {
        _context.Brukere.Add(bruker);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(HentBruker), new { id = bruker.id }, bruker);
    }
    [HttpPut("bruker/{id}")]
    public async Task<ActionResult<Bruker>> OppdaterBruker(int id, [FromBody] Bruker oppdatertBruker)
    {
        if (id != oppdatertBruker.id)
        {
            return BadRequest("ID-ene stemmer ikke");
        }

        var bruker = await _context.Brukere.FindAsync(id);
        if (bruker == null)
        {
            return NotFound("Låneavtale ble ikke funnet");
        }
        if (bruker.førerkortNummer != oppdatertBruker.førerkortNummer)
        {
            bruker.førerkortNummer = oppdatertBruker.førerkortNummer;
        }

        if (bruker.fornavn != oppdatertBruker.fornavn)
        {
            bruker.fornavn = oppdatertBruker.fornavn;
        }

        if (bruker.etternavn != oppdatertBruker.etternavn)
        {
            bruker.etternavn = oppdatertBruker.etternavn;
        }


        await _context.SaveChangesAsync();

        return Ok(bruker);
    }


    [HttpGet("biler")]
    public async Task<ActionResult<IEnumerable<Bil>>> HentBiler()
    {
        var biler = await _context.Biler.ToListAsync();
        return Ok(biler);
    }
    [HttpGet("bil/{id}")]
    public async Task<ActionResult<Bil>> HentBil(int id)
    {
        var bil = await _context.Biler.FindAsync(id);
        if (bil == null)
        {
            return NotFound();
        }
        return Ok(bil);
    }
    [HttpPost("bil")]
    public async Task<ActionResult<Bil>> LagBil([FromBody] Bil bil)
    {
        _context.Biler.Add(bil);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(HentBil), new { id = bil.id }, bil);
    }
    [HttpPut("bil/{id}")]
    public async Task<ActionResult<Bil>> OppdaterBil(int id, [FromBody] Bil oppdatertBil)
    {
        if (id != oppdatertBil.id)
        {
            return BadRequest("ID-ene stemmer ikke");
        }

        var bil = await _context.Biler.FindAsync(id);
        if (bil == null)
        {
            return NotFound("Låneavtale ble ikke funnet");
        }
        if (bil.registreringsNummer != oppdatertBil.registreringsNummer)
        {
            bil.registreringsNummer = oppdatertBil.registreringsNummer;
        }

        if (bil.bildePlassering != oppdatertBil.bildePlassering)
        {
            bil.bildePlassering = oppdatertBil.bildePlassering;
        }

        if (bil.merke != oppdatertBil.merke)
        {
            bil.merke = oppdatertBil.merke;
        }

        if (bil.modell != oppdatertBil.modell)
        {
            bil.modell = oppdatertBil.modell;
        }

        if (bil.tilgjengelig != oppdatertBil.tilgjengelig)
        {
            bil.tilgjengelig = oppdatertBil.tilgjengelig;
        }

        if (bil.pris != oppdatertBil.pris)
        {
            bil.pris = oppdatertBil.pris;
        }

        await _context.SaveChangesAsync();

        return Ok(bil);
    }


    [HttpGet("laan")]
    public async Task<ActionResult<IEnumerable<Låneavtale>>> HentLåneavtaler()
    {
        var låneavtaler = await _context.Låneavtaler.ToListAsync();
        return Ok(låneavtaler);
    }
    [HttpGet("laan/{id}")]
    public async Task<ActionResult<Låneavtale>> HentLåneavtale(int id)
    {
        var lån = await _context.Låneavtaler.FindAsync(id);
        if (lån == null)
        {
            return NotFound();
        }
        return Ok(lån);
    }
    [HttpPost("laan")]
    public async Task<ActionResult<Låneavtale>> LagLåneavtale([FromBody] Låneavtale avtale)
    {
        _context.Låneavtaler.Add(avtale);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(HentLåneavtale), new { id = avtale.id }, avtale);
    }
    [HttpPut("laan/{id}")]
    public async Task<ActionResult<Låneavtale>> OppdaterLåneAvtale(int id, [FromBody] Låneavtale oppdatertAvtale)
    {

        if (id != oppdatertAvtale.id)
        {
            return BadRequest("ID-ene stemmer ikke");
        }
        _context.ChangeTracker.DetectChanges();
        var bil = await _context.Biler.FirstOrDefaultAsync(b => b.registreringsNummer == oppdatertAvtale.registreringsNummer);
        if (bil == null)
        {
            return NotFound("Bil ble ikke funnet");
        }
        bil.tilgjengelig = false;
        _context.Entry(bil).State = EntityState.Modified;
        await _context.SaveChangesAsync();


        var avtale = await _context.Låneavtaler.FindAsync(id);
        if (avtale == null)
        {
            return NotFound("Låneavtale ble ikke funnet");
        }
        if (avtale.registreringsNummer != oppdatertAvtale.registreringsNummer)
        {
            avtale.registreringsNummer = oppdatertAvtale.registreringsNummer;
        }
        if (avtale.førerkortNummer != oppdatertAvtale.førerkortNummer)
        {
            avtale.førerkortNummer = oppdatertAvtale.førerkortNummer;
        }
        if (avtale.startDato != oppdatertAvtale.startDato)
        {
            avtale.startDato = oppdatertAvtale.startDato;
        }
        if (avtale.sluttDato != oppdatertAvtale.sluttDato)
        {
            avtale.sluttDato = oppdatertAvtale.sluttDato;
        }
        if(avtale.avsluttet != oppdatertAvtale.avsluttet)
        {
            avtale.avsluttet = oppdatertAvtale.avsluttet;
        }
        if (avtale.pris != oppdatertAvtale.pris)
        {
            avtale.pris = oppdatertAvtale.pris;
        }

        await _context.SaveChangesAsync();

        return Ok(avtale);
    }
}
