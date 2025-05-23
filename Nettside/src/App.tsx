import "./style.css";
import LoginSide from "./components/LoginSide";
import KundeSeksjon from "./components/KundeSeksjon";
import BilerSeksjon from "./components/BilerSeksjon";
import { useEffect, useState } from "react";
import LaanSeksjon from "./components/LaanSeksjon";
import * as CryptoJS from "crypto-js";

interface bil {
  bildePlassering: string;
  id: number;
  merke: string;
  modell: string;
  registreringsNummer: string;
  tilgjengelig: boolean;
  pris:number;
}
interface kunde {
  id: number;
  brukernavn: string;
  passord: string;
  forerkortnummer: string;
}
interface laan {
  id: number;
  registreringsNummer: string;
  førerkortNummer: string;
  startDato: Date;
  sluttDato: Date;
  avsluttet:boolean;
  pris:number;
}

const BASE_URL = "https://localhost:7200/laan";

function App() {
  const [brukernavn, setBrukernavn] = useState("");
  const [passord, setPassord] = useState("");
  const [forerkortnummer, setForerkortnummer] = useState("");
  const [loggetPaa, setLoggetPaa] = useState(false);
  const [lagerBruker, setLagerBruker] = useState(false);

  const [biler, setBiler] = useState<bil[]>([]);
  const [redigererBil, setRedigererBil] = useState(-1);

  const [kunder, setKunder] = useState<kunde[]>([]);
  const [redigererKunde, setRedigererKunde] = useState(-1);

  const [laaneAvtaler, setLaaneAvtaler] = useState<laan[]>([]);
  const [redigererLaan, setRedigererLaan] = useState(-1);

  const [laster, setLaster] = useState(false);
  const [error, setError] = useState(null);
  const [side, setSide] = useState(0);

  const [bilde, setBilde] = useState<File | null>(null);

  const hemmeligNøkkel = "Your32ByteLongPassphraseHere";
  const nøkkel = CryptoJS.SHA256(hemmeligNøkkel);

  const krypterData = (brukernavn: string, passord: string, forerkortnummer:string) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const data = JSON.stringify({ brukernavn, passord, forerkortnummer });
    const encrypted = CryptoJS.AES.encrypt(data, nøkkel, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
  };

  const login = async () => {
    try {
      const Data = krypterData(brukernavn, passord, "00000");
      const loginData = { data: Data };
      console.log("Sender: ", loginData);
      const svar = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: Data }),
      });
      if (!svar.ok) {
        console.log("Kunne ikke logge inn");
        const melding = await svar.text();
        console.log(melding);
      } else {
        const data = await svar.json();
        console.log(data);
        setForerkortnummer(data.forerkortnummer);
        setLoggetPaa(true);
        console.log("Innlogget");
      }
    } catch (e) {
      console.error("Noe skjedde mens du prøvde å logge på: ", e);
    }
  };

  const LoggUt = () => {
    setBrukernavn("");
    setPassord("");
    setLoggetPaa(false);
  };

  const lagBruker = async() =>
  {
    if(brukernavn !== "admin")
      {
    try {
      const Data = krypterData(brukernavn, passord,forerkortnummer);
      const loginData = { data: Data };
      console.log("Sender: ", loginData);
      const svar = await fetch(`${BASE_URL}/lagBruker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: Data }),
      });
      if (!svar.ok) {
        console.log("Kunne ikke lage bruker");
      } else {
        setLagerBruker(false);
        console.log("Bruker laget");
      }
    } catch (e) {
      console.error("Noe skjedde mens du prøvde å logge på: ", e);
    }
  }
  }

  const sendBilde = async () => {
    if (bilde) {
      const data = new FormData();
      data.append("bilde", bilde);

      const svar = await fetch(`${BASE_URL}/bilde`, {
        method: "POST",
        body: data,
      });

      if (svar.ok) {
        const data = await svar.json();
        console.log("Bilde lastet opp", data);
        return data.filPlassering;
      } else {
        const errorTekst = await svar.text();
        console.log("Bilde lastet ikke opp: ", errorTekst);
      }
      setBilde(null);
    } else {
      console.log("Ingen bilde valgt");
    }
  };

  const haandterBildeEndring = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBilde(e.target.files[0]);
    }
  };

  const leggTilBil = async () => {
    if (redigererBil === -1) {
      console.log("Legger til bil");
      const nyBil = {
        registreringsNummer: "",
        bildePlassering: "",
        merke: "",
        modell: "",
        tilgjengelig: true,
        pris:0
      };
      try {
        const svar = await fetch(`${BASE_URL}/bil`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nyBil),
        });
        if (!svar.ok) {
          throw new Error(`serveren svarte med status: ${svar.status}`);
        } else {
          const data = await svar.json();
          setBiler((prev) => [...prev, data]);
          setRedigererBil(data.id);
        }
      } catch (e: any) {
        console.error("Feil oppstod ved oppretting av bil: ", e);
      }
    }else{
      console.log("Kan ikke redigere 2 ting samtidig");
    }
  };
  const redigerBil = async (id: number) => {
    if (redigererBil === -1) {
      console.log("Redigerer bil")
      setRedigererBil(id);
    } else if (redigererBil === id) {
      setRedigererBil(-1);
      const plass = await sendBilde();
      if (plass) {
        const oppdaterteBiler = biler.map((bil) =>
          bil.id === id
            ? { ...bil, bildePlassering: `https://localhost:7200${plass}` }
            : bil
        );
        setBiler(oppdaterteBiler);
        const oppdatertBil = oppdaterteBiler.find((bil) => bil.id === id);
        console.log(oppdaterteBiler.find((bil) => bil.id === id));
        if (oppdatertBil) {
          oppdaterBil(oppdatertBil);
        }
      } else {
        const bilUtenBilde = biler.find((bil) => bil.id === id);
        if (bilUtenBilde) {
          oppdaterBil(bilUtenBilde);
        }
      }
    }
  };
  const oppdaterBil = async (b: bil) => {
    try {
      const svar = await fetch(`${BASE_URL}/bil/${b.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(b),
      });
      if (!svar.ok) {
        throw new Error(`serveren svarte med status: ${svar.status}`);
      }
      const data = await svar.json();
      console.log("Oppdatert bil: ", data);
    } catch (e: any) {
      console.error("Feil ved oppdatering av bil: ", e);
    }
  };

  const leggTilLaan = async () => {
    if (redigererLaan === -1) {
      const nyttLån = {
        registreringsNummer: "999999",
        førerkortNummer: "999999",
        startDato: new Date(Date.now()),
        sluttDato: new Date("2025-05-12T14:30:00"),
        avluttet:false,
      };
      console.log(`Sender følgende data til server: `, nyttLån);
      try {
        const svar = await fetch(`${BASE_URL}/laan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nyttLån),
        });
        if (!svar.ok) {
          throw new Error(`serveren svarte med status: ${svar.status}`);
        } else {
          const data = await svar.json();
          setRedigererLaan(data.id);
          setLaaneAvtaler((prev) => [...prev, data]);
        }
      } catch (e: any) {
        console.error("Feil ved oppretting av lån: ", e);
      }
    }
  };
  const redigerLaan = (id: number) => {
    if (redigererLaan === -1) {
      setRedigererLaan(id);
    } else if (redigererLaan === id) {
      oppdaterLaan(id);
      setRedigererLaan(-1);
    }
  };
  const oppdaterLaan = async (id: number) => {
    try {
      const avtale = laaneAvtaler.find((lån) => lån.id === id);
      if(!avtale)
        {
          throw new Error();
        }
      avtale.pris = (avtale.sluttDato.getUTCDate() - avtale.startDato.getUTCDate()) * biler.find(bil=>bil.registreringsNummer===avtale.registreringsNummer)!.pris;
      console.log(avtale);
      const svar = await fetch(`${BASE_URL}/laan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(avtale),
      });
      if (!svar.ok) {
        throw new Error(`serveren svarte med status: ${svar.status}`);
      }
      const data = await svar.json();
      console.log("Oppdatert låneavtale: ", data);
      if(!data.avsluttet){
      setBiler((prev) =>
        prev.map((bil) =>
          bil.registreringsNummer === data.registreringsNummer
            ? { ...bil, tilgjengelig: false}
            : bil
        )
      );
      }else{
        setBiler((prev) =>
        prev.map((bil) =>
          bil.registreringsNummer === data.registreringsNummer
            ? { ...bil, tilgjengelig: true }
            : bil
        ));
      }
    } catch (e: any) {
      console.error("Feil ved oppdatering av lån: ", e);
    }
  };

  const leggTilKunde = async () => {
    const nyBruker = {
      fornavn: "Kjell",
      etternavn: "Roar",
      førerkortNummer: "556545",
    };
    console.log(`Sender følgende data til server: `, nyBruker);
    try {
      const svar = await fetch(`${BASE_URL}/bruker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nyBruker),
      });
      if (!svar.ok) {
        throw new Error(`Serveren svarte med status: ${svar.status}`);
      } else {
        const data = await svar.json();
        setRedigererKunde(data.id);
        setKunder((prev) => [...prev, data]);
      }
    } catch (e: any) {
      console.error("Feil ved oppretting av bruker: ", e);
    }
  };
  const redigerKunde = (id: number) => {
    if (redigererKunde === -1) {
      setRedigererKunde(id);
    } else if (redigererKunde === id) {
      setRedigererKunde(-1);
      oppdaterKunde(id);
    }
  };
  const oppdaterKunde = async (id: number) => {
    try {
      const svar = await fetch(`${BASE_URL}/bruker/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kunder.find((kunde) => kunde.id === id)),
      });
      if (!svar.ok) {
        throw new Error(`serveren svarte med status: ${svar.status}`);
      }
      const data = await svar.json();
      console.log("Oppdatert kunde: ", data);
    } catch (e: any) {
      console.error("Feil ved oppdatering av kunde: ", e);
    }
  };

  useEffect(() => {
    login();
    const hentData = async () => {
      
      setLaster(true);
      try {
        const bilSvar = await fetch(`${BASE_URL}/biler`);
        const brukerSvar = await fetch(`${BASE_URL}/brukere`);
        const laanSvar = await fetch(`${BASE_URL}/laan`);
        const biler = (await bilSvar.json()) as bil[];
        const kunder = (await brukerSvar.json()) as kunde[];
        const laan = (await laanSvar.json()) as laan[];
        console.log(biler);
        
        setBiler(biler);
        setKunder(kunder);
        setLaaneAvtaler(laan);
        
      } catch (e: any) {
        setError(e);
      }
      setLaster(false);
    };
    hentData();
  }, [side]);

  return (
    <>
      {loggetPaa ? (
        <>
          <h1 className="tittel">Logget inn som: {brukernavn}</h1>
          <button className="loggUtKnapp" onClick={() => LoggUt()}>
            Logg ut
          </button>
          

          <LaanSeksjon
            leggTilLaan={leggTilLaan}
            redigerLaan={redigerLaan}
            laster={laster}
            laaneAvtaler={laaneAvtaler}
            redigererLaan={redigererLaan}
            setLaaneAvtaler={setLaaneAvtaler}
            kunder={kunder}
            biler={biler}
            forerkortnummer={forerkortnummer}
            brukernavn={brukernavn}
          />

          <BilerSeksjon
            leggTilBil={leggTilBil}
            laster={laster}
            biler={biler}
            redigererBil={redigererBil}
            håndterBildeEndring={haandterBildeEndring}
            bilde={bilde}
            redigerBil={redigerBil}
            setBiler={setBiler}
            brukernavn={brukernavn}
            laan={laaneAvtaler}
          />
        {brukernavn === "admin" &&
          <KundeSeksjon
            laster={laster}
            leggTilKunde={leggTilKunde}
            kunder={kunder}
            redigerKunde={redigerKunde}
            redigererKunde={redigererKunde}
            setKunder={setKunder}
            laan={laaneAvtaler}
          />
          }
        </>
      ) : (
        <>
        <LoginSide
          setBrukernavn={setBrukernavn}
          setPassord={setPassord}
          login={login}
          lagBruker={lagBruker}
          lagerBruker={lagerBruker}
          setLagerBruker={setLagerBruker}
          setForerkortnummer={setForerkortnummer}
        />

        <h1 hidden>{error}</h1>
        <h1 onClick={()=>setSide(1)}>Noe</h1>
        </>
      )}
    </>
  );
}

export default App;
