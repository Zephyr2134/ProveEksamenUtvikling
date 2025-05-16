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
  pris: number;
}

interface egenskaper {
  leggTilBil: () => void;
  laster: boolean;
  biler: bil[];
  redigererBil: number;
  håndterBildeEndring: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bilde: File | null;
  redigerBil: (id: number) => void;
  setBiler: (prev: any) => void;
  brukernavn: string;
  laan:laan[];
}

const BilerSeksjon = ({
  leggTilBil,
  laster,
  biler,
  redigererBil,
  håndterBildeEndring,
  bilde,
  redigerBil,
  setBiler,
  brukernavn,
  laan
}: egenskaper) => {
  return (
    <div className="seksjon">
      <h1 style={{ textAlign: "center" }}>Biler</h1>
      <div className="boks">
        {brukernavn === "admin" && (
          <button className="LeggTilKnapp" onClick={() => leggTilBil()}>
            Legg til bil
          </button>
        )}
        <div className="objekter" style={{ height: "700px" }}>
          {!laster ? (
            biler.map(
              (b) =>
                (b.tilgjengelig || brukernavn === "admin") && (
                  <div key={b.id} className="bil">
                    {redigererBil === b.id ? (
                      <input
                        type="checkbox"
                        checked={b.tilgjengelig}
                        onChange={(e) =>
                          setBiler((prev) =>
                            prev.map((bil) =>
                              bil.id === b.id
                                ? { ...bil, tilgjengelig: e.target.checked }
                                : bil
                            )
                          )
                        }
                      />
                    ) : b.tilgjengelig ? (
                      <h1>Tilgjengelig</h1>
                    ) : (
                      <h1>Ikke tilgjengelig</h1>
                    )}
                    {redigererBil === b.id ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={håndterBildeEndring}
                        ></input>
                        {b.bildePlassering ? (
                          !bilde ? (
                            <img src={b.bildePlassering} />
                          ) : (
                            <img src={URL.createObjectURL(bilde)} />
                          )
                        ) : (
                          <h1>Last opp bilde</h1>
                        )}
                      </>
                    ) : (
                      <img src={b.bildePlassering} />
                    )}
                    <div className="bilInnhold">
                      {brukernavn === "admin" && (
                        <button
                          className="redigerKnapp"
                          onClick={() => redigerBil(b.id)}
                        >
                          {redigererBil === b.id ? (
                            <h3>Ferdig</h3>
                          ) : (
                            <h3>Rediger</h3>
                          )}
                        </button>
                      )}
                      <h1>Registreringsnummer: </h1>
                      {redigererBil !== b.id ? (
                        <h1>{b.registreringsNummer}</h1>
                      ) : (
                        <input
                          className="regNummerFelt"
                          value={b.registreringsNummer}
                          onChange={(e) =>
                            setBiler((prev) =>
                              prev.map((bil) =>
                                bil.id === b.id
                                  ? {
                                      ...bil,
                                      registreringsNummer: e.target.value,
                                    }
                                  : bil
                              )
                            )
                          }
                        />
                      )}
                      <div className="bilInfo">
                        <p>
                          <h1>Merke: </h1>{" "}
                          {redigererBil === b.id ? (
                            <input
                              value={b.merke}
                              onChange={(e) =>
                                setBiler((prev) =>
                                  prev.map((bil) =>
                                    bil.id === b.id
                                      ? { ...bil, merke: e.target.value }
                                      : bil
                                  )
                                )
                              }
                            />
                          ) : (
                            <h1>{b.merke}</h1>
                          )}
                        </p>
                        <p>
                          <h1>Døgn pris: </h1>{" "}
                          {redigererBil === b.id ? (
                            <input
                              value={b.pris}
                              onChange={(e) =>
                                setBiler((prev) =>
                                  prev.map((bil) =>
                                    bil.id === b.id
                                      ? { ...bil, pris: e.target.value }
                                      : bil
                                  )
                                )
                              }
                            />
                          ) : (
                            <h1>{b.pris}</h1>
                          )}
                        </p>
                        <p>
                          <h1>Modell: </h1>{" "}
                          {redigererBil === b.id ? (
                            <input
                              value={b.modell}
                              onChange={(e) =>
                                setBiler((prev) =>
                                  prev.map((bil) =>
                                    bil.id === b.id
                                      ? { ...bil, modell: e.target.value }
                                      : bil
                                  )
                                )
                              }
                            />
                          ) : (
                            <h1>{b.modell}</h1>
                          )}
                        </p>
                        {brukernavn === "admin" && <h3>Historikk: {laan.map(l=>l.registreringsNummer === b.registreringsNummer && <h3>{l.førerkortNummer}</h3>)}</h3>}
                      </div>
                    </div>
                  </div>
                )
            )
          ) : (
            <h1>Laster</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default BilerSeksjon;
