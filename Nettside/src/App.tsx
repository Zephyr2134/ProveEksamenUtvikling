import "./style.css";
import LoginSide from "./components/LoginSide";
import KundeSeksjon from "./components/KundeSeksjon";
import BilerSeksjon from "./components/BilerSeksjon";
import { useEffect, useState, useRef } from "react";
import LaanSeksjon from "./components/LaanSeksjon";
import * as CryptoJS from "crypto-js";

interface bil {
  bildePlassering: string;
  id: number;
  merke: string;
  modell: string;
  registreringsNummer: string;
  tilgjengelig: boolean;
}
interface kunde {
  id: number;
  fornavn: string;
  etternavn: string;
  førerkortNummer: string;
}
interface laan {
  id: number;
  registreringsNummer: string;
  førerkortNummer: string;
  startDato: Date;
  sluttDato: Date;
  avsluttet:boolean;
}
interface LoginForespørsel 
{
  forespørsel: string;
}

const BASE_URL = "https://localhost:7200/laan";

function App() {
  const [brukernavn, setBrukernavn] = useState("");
  const [passord, setPassord] = useState("");
  const [loggetPaa, setLoggetPaa] = useState(false);

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

  const krypterData = (brukernavn: string, passord: string) => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const data = JSON.stringify({ brukernavn, passord });
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
      const Data = krypterData(brukernavn, passord);
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
      const nyBil = {
        registreringsNummer: "",
        bildePlassering: "https://localhost:7200/uploads/standar.jpg",
        merke: "",
        modell: "",
        tilgjengelig: true,
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
    }
  };
  const redigerBil = async (id: number) => {
    if (redigererBil === -1) {
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
      const svar = await fetch(`${BASE_URL}/laan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(laaneAvtaler.find((lån) => lån.id === id)),
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
            ? { ...bil, tilgjengelig: false }
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
        const laan = (await laanSvar.json()) as laaneAvtale[];
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
          <h1 className="tittel">Administrasjon</h1>
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
          />

          <KundeSeksjon
            laster={laster}
            leggTilKunde={leggTilKunde}
            kunder={kunder}
            redigerKunde={redigerKunde}
            redigererKunde={redigererKunde}
            setKunder={setKunder}
          />
        </>
      ) : (
        <LoginSide
          setBrukernavn={setBrukernavn}
          setPassord={setPassord}
          login={login}
        />
      )}
    </>
  );
}

export default App;
