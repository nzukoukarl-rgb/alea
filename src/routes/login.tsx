import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Se connecter · Aléa" },
      { name: "description", content: "Compte facultatif pour entendre la voix et garder la session." },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await authClient.signIn.email({ email: email.trim(), password });
    setPending(false);
    if (result.error) {
      setError("Ce courriel ou ce mot de passe ne correspond pas.");
      return;
    }
    void navigate({ to: "/compte" });
  }

  return (
    <section className="section">
      <h1>Reprendre ses vies</h1>
      <p className="muted">Sans compte, le tirage reste dans ce navigateur. Le compte sert à la voix, pour que n'importe qui ne la dépense pas.</p>
      {error ? <p className="banner bad">{error}</p> : null}
      {authEnabled ? (
        <form onSubmit={onSubmit} className="card stack" style={{ maxWidth: 440 }}>
          <div className="field">
            <label>
              Courriel
              <input value={email} type="email" required autoComplete="username" onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>
          <div className="field">
            <label>
              Mot de passe
              <input value={password} type="password" required minLength={8} autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} />
            </label>
          </div>
          <button className="btn solid" type="submit" disabled={pending}>
            {pending ? "Entrée…" : "Entrer"}
          </button>
        </form>
      ) : (
        <p className="muted">La connexion n'est pas ouverte sur ce serveur.</p>
      )}
      <p>
        <Link to="/inscription">Créer un compte</Link>
      </p>
    </section>
  );
}
