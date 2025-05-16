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

interface egenskaper {
  laster: boolean;
  leggTilKunde: () => void;
  kunder: kunde[];
  redigerKunde: (id: number) => void;
  redigererKunde: number;
  setKunder: (prev: any) => void;
  laan:laan[];
}

const KundeSeksjon = ({
  laster,
  kunder,
  redigerKunde,
  redigererKunde,
  setKunder,
  laan,
}: egenskaper) => {
  return (
    <div className="seksjon">
      <h1 style={{ textAlign: "center" }}>Brukere</h1>
      <div className="boks">
        <div className="objekter">
          {!laster ? (
            kunder.map((k) => (
              <div key={k.id} className="kunde">
                <button onClick={() => redigerKunde(k.id)}>
                  {redigererKunde === k.id ? <h3>Ferdig</h3> : <h3>Rediger</h3>}
                </button>
                <h1>Navn: </h1>
                {redigererKunde !== k.id ? (
                  <h1>
                    {k.brukernavn} {k.passord}
                  </h1>
                ) : (
                  <>
                    <input
                      value={k.brukernavn}
                      onChange={(e) =>
                        setKunder((prev:any) =>
                          prev.map((kunde:any) =>
                            kunde.id === k.id
                              ? { ...kunde, fornavn: e.target.value }
                              : kunde
                          )
                        )
                      }
                    />
                    <input
                      value={k.passord}
                      onChange={(e) =>
                        setKunder((prev:any) =>
                          prev.map((kunde:any) =>
                            kunde.id === k.id
                              ? { ...kunde, etternavn: e.target.value }
                              : kunde
                          )
                        )
                      }
                    />
                  </>
                )}
                <h1>Førerkortnummer: </h1>
                {redigererKunde !== k.id ? (
                  <h1>{k.forerkortnummer}</h1>
                ) : (
                  <input
                    value={k.forerkortnummer}
                    onChange={(e) =>
                      setKunder((prev:any) =>
                        prev.map((kunde:any) =>
                          kunde.id === k.id
                            ? { ...kunde, forerkortnummer: e.target.value }
                            : kunde
                        )
                      )
                    }
                  />
                )}
                <h3>Historikk: {laan.map(l=>l.førerkortNummer === k.forerkortnummer && <h3>{l.registreringsNummer}{ l.avsluttet ? "-avsluttet": "-aktiv"}</h3>)}</h3>
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
export default KundeSeksjon;
