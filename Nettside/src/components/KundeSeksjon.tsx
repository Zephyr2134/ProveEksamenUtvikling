interface kunde {
  id: number;
  fornavn: string;
  etternavn: string;
  førerkortNummer: string;
}

interface egenskaper {
  laster: boolean;
  leggTilKunde: () => void;
  kunder: kunde[];
  redigerKunde: (id: number) => void;
  redigererKunde: number;
  setKunder: (prev: any) => void;
}

const KundeSeksjon = ({
  laster,
  leggTilKunde,
  kunder,
  redigerKunde,
  redigererKunde,
  setKunder,
}: egenskaper) => {
  return (
    <div className="seksjon">
      <h1 style={{ textAlign: "center" }}>Brukere</h1>
      <div className="boks">
        <button className="LeggTilKnapp" onClick={() => leggTilKunde()}>
          Legg til kunde
        </button>
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
                    {k.fornavn} {k.etternavn}
                  </h1>
                ) : (
                  <>
                    <input
                      value={k.fornavn}
                      onChange={(e) =>
                        setKunder((prev) =>
                          prev.map((kunde) =>
                            kunde.id === k.id
                              ? { ...kunde, fornavn: e.target.value }
                              : kunde
                          )
                        )
                      }
                    />
                    <input
                      value={k.etternavn}
                      onChange={(e) =>
                        setKunder((prev) =>
                          prev.map((kunde) =>
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
                  <h1>{k.førerkortNummer}</h1>
                ) : (
                  <input
                    value={k.førerkortNummer}
                    onChange={(e) =>
                      setKunder((prev) =>
                        prev.map((kunde) =>
                          kunde.id === k.id
                            ? { ...kunde, førerkortNummer: e.target.value }
                            : kunde
                        )
                      )
                    }
                  />
                )}
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
