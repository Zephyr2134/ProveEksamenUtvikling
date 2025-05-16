interface laan {
  id: number;
  registreringsNummer: string;
  førerkortNummer: string;
  startDato: Date;
  sluttDato: Date;
  avsluttet:boolean;
  pris:number;
}

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

interface egenskaper {
  leggTilLaan: () => void;
  redigerLaan: (id: number) => void;
  laster: boolean;
  laaneAvtaler: laan[];
  redigererLaan: number;
  setLaaneAvtaler: (prev: any) => void;
  kunder: kunde[];
  biler: bil[];
  forerkortnummer:string;
  brukernavn:string;
}

const LaanSeksjon = ({
  leggTilLaan,
  redigerLaan,
  laster,
  laaneAvtaler,
  redigererLaan,
  setLaaneAvtaler,
  kunder,
  biler,
  forerkortnummer,
  brukernavn
}: egenskaper) => {
  return (
    <div className="seksjon">
      <h1 style={{ textAlign: "center" }}>Lån</h1>
      <div className="boks">
        <button className="LeggTilKnapp" onClick={() => leggTilLaan()}>
          Legg til lån
        </button>
        <div className="objekter" style={{ height: "500px" }}>
          {!laster ? (
            laaneAvtaler.map((l) => (
              (l.førerkortNummer === forerkortnummer || l.id === redigererLaan || brukernavn === "admin") && 
              <div key={l.id} className="laan">
                {l.avsluttet && <h1>Avsluttet</h1>}
                <button onClick={() => redigerLaan(l.id)}>
                  {redigererLaan === l.id ? <h3>Ferdig</h3> : <h3>Rediger</h3>}
                </button>
                {redigererLaan !== l.id && <h1>Pris: {l.pris}</h1>}
                <h1>Registreringsnummer: </h1>{" "}
                {redigererLaan === l.id ? (
                  <select
                    value={l.registreringsNummer}
                    onChange={(e) =>
                      setLaaneAvtaler((prev:any) =>
                        prev.map((laan:any) =>
                          laan.id === l.id
                            ? { ...laan, registreringsNummer: e.target.value }
                            : laan
                        )
                      )
                    }
                  >
                    {" "}
                    <option value="0">Velg bil registreringsnummer</option>{" "}
                    {biler.map(
                      (bil) =>
                        bil.tilgjengelig && (
                          <option
                            key={bil.registreringsNummer}
                            value={bil.registreringsNummer}
                          >
                            {bil.registreringsNummer}
                          </option>
                        )
                    )}{" "}
                  </select>
                ) : (
                  <h1>{l.registreringsNummer}</h1>
                )}
                <h1>Førerkortnummer: </h1>
                {redigererLaan === l.id ? (
                  <select
                    value={l.førerkortNummer}
                    onChange={(e) =>
                      setLaaneAvtaler((prev:any) =>
                        prev.map((laan:any) =>
                          laan.id === l.id
                            ? { ...laan, førerkortNummer: e.target.value }
                            : laan
                        )
                      )
                    }
                  >
                    {" "}
                    <option value="0">Velg førerkort nummer</option>{" "}

                    {brukernavn === "admin" ? 
                    kunder.map((k) =>(
                      <option key={k.forerkortnummer} value={k.forerkortnummer}>
                        {k.forerkortnummer}
                      </option>
                    )) : <option>{forerkortnummer}</option>}
                  </select>
                ) : (
                  <h1>{l.førerkortNummer}</h1>
                )}
                <div className="datoer">
                  <div className="dato">
                    <h1>Start dato: </h1>
                    {redigererLaan === l.id ? (
                      <input
                        type="datetime-local"
                        onChange={(e) =>
                          setLaaneAvtaler((prev:any) =>
                            prev.map((laan:any) =>
                              laan.id === l.id
                                ? {
                                    ...laan,
                                    startDato: new Date(e.target.value),
                                  }
                                : laan
                            )
                          )
                        }
                      />
                    ) : (
                      <h1>{new Date(l.startDato).toDateString()}</h1>
                    )}
                  </div>
                  <div className="dato">
                    <h1>Slutt dato: </h1>
                    {redigererLaan === l.id ? (
                      <input
                        type="datetime-local"
                        onChange={(e) =>
                          setLaaneAvtaler((prev:any) =>
                            prev.map((laan:any) =>
                              laan.id === l.id
                                ? {
                                    ...laan,
                                    sluttDato: new Date(e.target.value),
                                  }
                                : laan
                            )
                          )
                        }
                      />
                    ) : (
                      <h1>{new Date(l.sluttDato).toDateString()}</h1>
                    )}
                     
                  </div>
                </div>
                {redigererLaan === l.id && <button onClick={()=>setLaaneAvtaler((prev:any) =>
                            prev.map((laan:any) =>
                              laan.id === l.id
                                ? {...laan,avsluttet:true,} : laan))}>Avslutt lån</button>}
              </div>
            ))
          ) : (
            <h1>Laster</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaanSeksjon;
