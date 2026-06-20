import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="main" style={{ maxWidth: 460, margin: "0 auto", minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form className="panel" action="/api/auth/login" method="post">
        <Image src="/assets/logo-mark.png" alt="Euromecanico Corp" width={94} height={94} />
        <h1>EuroShop</h1>
        <p className="muted">Login demo para empleados. Usa cualquier email y password.</p>
        <div className="form-grid" style={{ marginTop: 18 }}>
          <div className="field full"><label>Email</label><input className="input" name="email" type="email" defaultValue="admin@euromecanico.com" required /></div>
          <div className="field full"><label>Password</label><input className="input" name="password" type="password" defaultValue="demo123" required /></div>
          <div className="field full"><button className="button" type="submit">Entrar</button></div>
        </div>
      </form>
    </main>
  );
}
