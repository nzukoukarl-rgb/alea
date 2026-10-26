import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Créer un compte · Aléa" },
      { name: "description", content: "Un compte pour entendre la voix d'une vie tirée au sort." },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      callbackURL: "/compte",
    });
    setPending(false);
    if (result.error) {
      setError("Le compte n'a pas été créé. Vérifiez le courriel, et un mot de passe d'au moins 8 caractères.");
      return;
    }
    void navigate({ to: "/compte" });
  }

  return (
    <section className="section">
      <h1>Garder les vies avec un courriel</h1>
      <p className="muted">Le tirage reste sur cet appareil. Le compte ouvre la voix, et rien d'autre.</p>
      {error ? <p className="banner bad">{error}</p> : null}
      {authEnabled ? (
        <form onSubmit={onSubmit} className="card stack" style={{ maxWidth: 440 }}>
          <div className="field">
            <label>
              Nom
              <input value={name} required minLength={2} maxLength={40} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
          <div className="field">
            <label>
              Courriel
              <input value={email} type="email" required autoComplete="username" onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>
          <div className="field">
            <label>
              Mot de passe
              <input value={password} type="password" required minLength={8} autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} />
            </label>
          </div>
          <button className="btn solid" type="submit" disabled={pending}>
            {pending ? "Création…" : "Créer le compte"}
          </button>
        </form>
      ) : (
        <p className="muted">L'inscription n'est pas ouverte sur ce serveur.</p>
      )}
      <p>
        <Link to="/login">J'ai déjà un compte</Link>
      </p>
    </section>
  );
}
