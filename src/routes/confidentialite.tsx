import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité · Aléa" },
      { name: "description", content: "Ce qu'Aléa garde : les vies dans le navigateur, la voix sur le serveur, jamais la clé." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="section">
      <h1>Confidentialité</h1>
      <p>Les vies tirées restent dans ce navigateur. Elles ne sont pas un dossier.</p>
      <p>La voix envoie au serveur le registre déjà écrit : pays, âges, jauges, choix. Pas votre mot de passe. La clé du modèle ne quitte pas le serveur.</p>
      <p>Le compte, si vous en créez un, sert à limiter la voix. Le courriel est celui de la session, pas un fichier de marketing.</p>
      <p>Aléa n'est pas 1in8b.life et ne reçoit rien de ce site.</p>
    </section>
  );
}
