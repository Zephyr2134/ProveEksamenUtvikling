interface props {
  setBrukernavn: (e: any) => void;
  setPassord: (e: any) => void;
  login: () => void;
  lagerBruker:boolean;
  setLagerBruker:(verdi:boolean)=>void;
  lagBruker:()=>void;
}

const LoginSide = ({ setBrukernavn, setPassord, login, lagerBruker, setLagerBruker, lagBruker }: props) => {
  return (
    <>
    {!lagerBruker ? 
    <form className="loginArk" onSubmit={(e) => e.preventDefault()}>
      <h2 className="loginTittel">Logg inn</h2>
      <input
        required
        className="loginSkriveFelt"
        type="text"
        placeholder="Brukernavn"
        onChange={(e) => setBrukernavn(e.target.value)}
      />
      <input
        required
        className="loginSkriveFelt"
        type="password"
        placeholder="Passord"
        onChange={(e) => setPassord(e.target.value)}
      />
      <button type="submit" className="loginKnapp" onClick={() => login()}>
        Logg inn
      </button>
      <h3 onClick={()=>setLagerBruker(true)}>Har ikke bruker</h3>
    </form> : 
    
    <form className="loginArk" onSubmit={(e) => e.preventDefault()}>
      <h2 className="loginTittel">Lag bruker</h2>
      <input
        required
        className="loginSkriveFelt"
        type="text"
        placeholder="Brukernavn"
        onChange={(e) => setBrukernavn(e.target.value)}
      />
      <input
        required
        className="loginSkriveFelt"
        type="password"
        placeholder="Passord"
        onChange={(e) => setPassord(e.target.value)}
      />
      <button type="submit" className="loginKnapp" onClick={() => lagBruker()}>
        Logg inn
      </button>
      <h3 onClick={()=>setLagerBruker(false)}>Har bruker?</h3>
    </form>}
    </>
  );
};

export default LoginSide;
