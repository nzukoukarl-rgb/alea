import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LivesSync } from "@/components/lives-sync";
import { UserButton } from "@/lib/auth/gates";
import { DISCLAIMER } from "@/lib/sim/engine";
import { useAlea } from "@/lib/store";

const LINKS = [
  ["/naitre", "Naître"],
  ["/vies", "Vies"],
  ["/pays", "Pays"],
  ["/memorial", "Mémorial"],
  ["/compare", "Comparer"],
  ["/compte", "Compte"],
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const theme = useAlea((s) => s.theme);
  const edu = useAlea((s) => s.edu);
  const setTheme = useAlea((s) => s.setTheme);
  const setEdu = useAlea((s) => s.setEdu);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <header className="top">
        <Link to="/" className="brand">
          <span className="mark" />
          Aléa
        </Link>
        <nav className="nav">
          {LINKS.map(([href, label]) => (
            <Link key={href} to={href} className={path === href || path.startsWith(href) ? "on" : ""}>
              {label}
            </Link>
          ))}
        </nav>
        <button className="ghost" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "Clair" : "Sombre"}
        </button>
        <button className="ghost" type="button" onClick={() => setEdu(!edu)}>
          {edu ? "Mode classe actif" : "Mode classe"}
        </button>
        <UserButton />
        <LivesSync />
      </header>
      <main id="contenu" className="wrap">
        {children}
      </main>
      <footer className="footer">
        <div className="wrap">
          <nav>
            <Link to="/compare">Comparer</Link>
            <Link to="/pays">55 pays</Link>
            <Link to="/ecoute">Écoute</Link>
            <Link to="/confidentialite">Confidentialité</Link>
            <Link to="/conditions">Conditions</Link>
          </nav>
          <p>{DISCLAIMER}</p>
          <p className="small">
            Chiffres arrondis d'après des ordres de grandeur publics (Nations Unies, OMS, Banque mondiale, autour de 2023). Aléa n'est pas
            1in8b.life.
          </p>
        </div>
      </footer>
    </>
  );
}
