interface props {
  setBrukernavn: (e: any) => void;
  setPassord: (e: any) => void;
  login: () => void;
}

const LoginSide = ({ setBrukernavn, setPassord, login }: props) => {
  return (
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
    </form>
  );
};

export default LoginSide;
