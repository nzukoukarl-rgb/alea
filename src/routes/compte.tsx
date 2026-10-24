import { createFileRoute, Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useAlea } from "@/lib/store";

export const Route = createFileRoute("/compte")({
  head: () => ({
    meta: [
      { title: "Compte · Aléa" },
      { name: "description", content: "Vos vies tirées au sort, et la session qui ouvre la voix." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const user = useCurrentUser();
  const lives = useAlea((s) => s.lives.length);
  const label = user?.displayName || user?.primaryEmail || "Visiteur";
  return (
    <section className="section">
      <p className="kicker">compte</p>
      <h1>{label}</h1>
      <p className="muted">
        {user?.primaryEmail ?? "pas de courriel"} · {lives} vie(s) dans ce navigateur.
      </p>
      <SignedOut>
        <p>
          <Link to="/inscription" className="btn solid">
            Créer un compte pour la voix
          </Link>
        </p>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <p>
        <Link to="/vies">Voir les vies</Link>
      </p>
    </section>
  );
}
