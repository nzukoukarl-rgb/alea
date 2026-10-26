export type CompareRow = { label: string; alea: string; other: string };
export type Faq = { q: string; a: string };
export type ComparePage = {
  slug: string;
  other: string;
  blurb: string;
  description: string;
  intro: string;
  verdict: string;
  rows: CompareRow[];
  prosAlea: string[];
  consAlea: string[];
  prosOther: string[];
  consOther: string[];
  faqs: Faq[];
  related: string[];
};

export function h1(page: ComparePage): string {
  return `Aléa vs ${page.other} : fonctions, prix et lequel est le meilleur en 2026`;
}

const feature = (alea: string, other: string): CompareRow => ({ label: "Fonction centrale", alea, other });
const price = (alea: string, other: string): CompareRow => ({ label: "Prix", alea, other });
const free = (alea: string, other: string): CompareRow => ({ label: "Option gratuite", alea, other });
const speed = (alea: string, other: string): CompareRow => ({ label: "Vitesse", alea, other });
const accuracy = (alea: string, other: string): CompareRow => ({ label: "Exactitude", alea, other });
const ease = (alea: string, other: string): CompareRow => ({ label: "Prise en main", alea, other });

export const PAGES: ComparePage[] = [
  {
    slug: "alea-vs-1-sur-8-milliards",
    other: "1 sur 8 milliards",
    blurb: "Le site d'origine : une vie longue, 172 pays, sans compte.",
    description: "Aléa vs 1 sur 8 milliards (1in8b.life) : tirage statistique, voix générée, prix, et lequel choisir en 2026.",
    intro:
      "1 sur 8 milliards, sur 1in8b.life, est le jeu qui a fixé l'idée : naître au hasard parmi les bébés d'aujourd'hui et tenir jusqu'au bout, dans des statistiques publiques. Aléa reprend cette promesse, pas le site. D'après la page officielle consultée le 20 octobre 2026, l'original est une bêta (v0.7.76), gratuite, sans publicité, sans inscription, avec un mémorial, un mode classe et des tables pour 172 pays.",
    verdict:
      "Si vous voulez la vigile longue, le plus grand tableau de pays et l'outil déjà mûr dans dix langues, restez sur 1 sur 8 milliards. Aléa est meilleur si vous voulez une voix écrite pour votre choix, un compte, et une vie qui se termine en quelques chapitres. Ce n'est pas le même silence.",
    rows: [
      feature(
        "Tirage selon 55 pays, paliers, voix de modèle à partir du registre seulement.",
        "Tirage selon 172 pays, choix, temps accéléré. Les pages publiques décrivent un registre statistique, pas un modèle appelé à chaque année.",
      ),
      price("Gratuit. La voix coûte du calcul côté serveur, non facturé ici.", "Gratuit. Pas de paiement affiché sur les pages publiques consultées."),
      free("Oui, tout le parcours.", "Oui, tout le parcours."),
      speed("Chapitres (une vie en une session) ou année par année.", "Environ une minute par année : 30 minutes à 1 h 30 selon le réglage publié."),
      accuracy(
        "Ordres de grandeur 2023, poids renormalisés, modèle de revenu simplifié, étiquettes de cause grossières.",
        "Tables annoncées d'après l'ONU, l'OMS et la Banque mondiale, plus fines que les nôtres.",
      ),
      ease("Un bouton, puis trois cartes aux paliers. Compte facultatif pour la voix.", "Un bouton Naître. Pas de compte. Réglages de durée et mode automatique."),
    ],
    prosAlea: ["La voix suit le choix et refuse d'inventer un fait hors registre.", "Les vies restent dans ce navigateur, la voix est liée au compte.", "Pas de publicité."],
    consAlea: ["55 pays, pas 172. Les chiffres sont arrondis.", "La voix dépend d'un modèle et peut se taire.", "Une seule langue soignée : le français."],
    prosOther: ["Le plus grand registre public de cette idée, et la durée longue.", "Sans compte, sans publicité, avec mémorial et mode classe.", "Déjà traduit largement."],
    consOther: ["Une vie demande une demi-heure ou plus.", "Pas d'historique relié à un courriel.", "Pas de voix générée pour le choix que vous venez de faire, d'après les pages publiques."],
    faqs: [
      { q: "Aléa est-il une bonne alternative à 1 sur 8 milliards ?", a: "Oui si vous voulez le même tirage avec une narration de vos choix. Non si vous voulez les 172 pays et la vigile d'une heure. Aléa n'est pas le site officiel." },
      { q: "1 sur 8 milliards ou Aléa, lequel est le meilleur ?", a: "L'original est le meilleur registre long. Aléa est le meilleur quand la phrase compte autant que le chiffre, et que vous avez peu de temps." },
      { q: "1in8b.life est-il gratuit ?", a: "Oui. Les pages publiques d'octobre 2026 le présentent comme une simulation gratuite, sans inscription." },
    ],
    related: ["bitlife", "in8b-com"],
  },
  {
    slug: "bitlife",
    other: "BitLife",
    blurb: "Le grand jeu de vie en texte, gratuit, avec publicités.",
    description: "Alternative à BitLife : Aléa vs BitLife en 2026, fonctions, prix, publicités, et lequel choisir pour une vie en texte.",
    intro:
      "BitLife, de Candywriter, est le jeu de vie en texte le plus joué sur téléphone. La fiche Google Play consultée en octobre 2026 le donne gratuit, avec publicités, note autour de 4,4 sur plus d'un million d'avis, et des achats intégrés. On y vit naissance, métier, amour, crime, parfois sur plusieurs générations, sur un ton souvent comique.",
    verdict:
      "BitLife est meilleur si vous voulez un catalogue d'événements, des métiers et une partie courte sur téléphone. Aléa est meilleur si vous voulez savoir où un bébé naît vraiment, sans publicité et sans blague sur la mort. Les deux ne cherchent pas la même vérité.",
    rows: [
      feature("Un tirage mondial, puis une seule vie.", "Une vie en texte très fournie : école, travail, relations, crime, héritage."),
      price("Gratuit, sans achat.", "Gratuit au téléchargement. Achats intégrés (le détail du passe change selon le store)."),
      free("Oui.", "Oui, avec publicités. Google Play indique « Contains ads » en octobre 2026."),
      speed("Quelques chapitres, ou une année à la fois.", "Une vie entière en quelques minutes de taps."),
      accuracy("Poids de naissances et espérances d'ordres de grandeur publics.", "Événements écrits pour le jeu, pas un tirage ONU."),
      ease("Trois cartes aux paliers, peu de menus.", "Très rodée sur iOS et Android, beaucoup de boutons."),
    ],
    prosAlea: ["Pas de publicité.", "Le pays de naissance a un poids réel.", "Le ton reste calme."],
    consAlea: ["Moins d'événements et pas de métier détaillé.", "Pas une application native.", "La voix peut échouer."],
    prosOther: ["Énorme bibliothèque d'événements.", "Facile sur un téléphone.", "Rejouable sans fin."],
    consOther: ["Publicités et achats.", "L'humour écrase souvent le réel.", "Le lieu de naissance n'est pas le sujet."],
    faqs: [
      { q: "Aléa est-il une bonne alternative à BitLife ?", a: "Pour une vie rapide et fournie, non : BitLife reste plus riche. Pour un tirage de naissance crédible et sans pub, oui." },
      { q: "BitLife ou Aléa, lequel est le meilleur ?", a: "BitLife gagne sur le volume. Aléa gagne sur le hasard du monde réel et l'absence de publicité." },
      { q: "BitLife est-il gratuit ?", a: "Le téléchargement est gratuit. La fiche Play d'octobre 2026 signale des publicités et des achats intégrés." },
    ],
    related: ["alea-vs-1-sur-8-milliards", "reigns"],
  },
  {
    slug: "in8b-com",
    other: "in8b.com",
    blurb: "Un tirage du même genre, plus court, avec publicité.",
    description: "in8b.com alternative : Aléa vs in8b.com, durée, publicités, langues et exactitude en 2026.",
    intro:
      "in8b.com est une autre entrée du même geste — naître au hasard — apparue en 2026. Un comparatif publié par TechMoon le 16 octobre 2026, après avoir joué les trois adresses le même jour, le décrit comme un simulateur rapide (environ 3 à 12 minutes), avec accélération, plusieurs langues, et de la publicité plus une mesure d'audience. Ce n'est pas 1in8b.life.",
    verdict:
      "in8b.com est meilleur pour une partie éclair et plus de langues. Aléa est meilleur si vous refusez la publicité et si vous voulez que le texte réponde à votre choix. Aucun des deux n'a la table de 172 pays de 1in8b.life.",
    rows: [
      feature("Registre, paliers, voix.", "Tirage et choix, partie courte, d'après l'essai du 16 octobre 2026."),
      price("Gratuit.", "Gratuit à jouer, d'après le même essai."),
      free("Oui, sans publicité.", "Oui. L'essai signale un compte publicitaire et une mesure d'audience."),
      speed("Session courte en chapitres, ou plus lente.", "Environ 3 à 12 minutes, avec une accélération forte."),
      accuracy("55 pays, sources nommées, arrondis assumés.", "Même famille de tirage. Nous n'avons pas refait l'audit de leurs tables."),
      ease("Français, compte pour la voix.", "Plusieurs langues, prise en main immédiate."),
    ],
    prosAlea: ["Sans publicité.", "Voix liée au registre.", "Mémorial dans le navigateur."],
    consAlea: ["Moins de langues.", "Partie parfois plus lente.", "Moins de pays que 1in8b.life."],
    prosOther: ["Très rapide.", "Plus de langues dans l'essai cité.", "Le geste est immédiatement clair."],
    consOther: ["Publicité signalée.", "Pas les pages légales de 1in8b.life, selon le même article.", "Pas de voix générée documentée."],
    faqs: [
      { q: "Aléa est-il une bonne alternative à in8b.com ?", a: "Oui si la publicité vous gêne ou si vous voulez un récit de votre choix. Non si vous voulez la partie la plus courte possible." },
      { q: "in8b.com ou Aléa, lequel est le meilleur ?", a: "in8b.com pour la vitesse. Aléa pour le calme et la voix. Pour la table la plus large, aucun des deux : voyez 1 sur 8 milliards." },
      { q: "in8b.com est-il le site officiel ?", a: "Non. Le site qui se présente comme officiel est 1in8b.life. TechMoon, le 16 octobre 2026, décrit in8b.com comme une autre réalisation." },
    ],
    related: ["1in8b-live", "alea-vs-1-sur-8-milliards"],
  },
  {
    slug: "1in8b-live",
    other: "1in8b.live",
    blurb: "La variante « play » courte, proche de in8b.com.",
    description: "1in8b.live alternative : Aléa vs 1in8b.live, choix, durée et publicité en 2026.",
    intro:
      "1in8b.live est décrit par TechMoon (16 octobre 2026) comme le jumeau jouable de in8b.com : même durée courte, mêmes langues, même présence publicitaire, avec l'accent mis sur les choix. Là encore, ce n'est pas 1in8b.life.",
    verdict:
      "Choisissez 1in8b.live pour enchaîner les vies en quelques minutes. Choisissez Aléa pour une vie que vous pouvez rouvrir, sans publicité, avec une voix qui n'a pas le droit d'inventer le pays.",
    rows: [
      feature("Une vie, des paliers, une voix contrainte par le registre.", "Choix interactifs sur une vie courte, d'après l'essai cité."),
      price("Gratuit.", "Gratuit à jouer, d'après le même essai."),
      free("Oui, sans publicité.", "Oui, avec publicité signalée, comme in8b.com."),
      speed("Chapitres ou années.", "Environ 3 à 12 minutes."),
      accuracy("Poids publiés, arrondis, modèle de revenu assumé comme simplifié.", "Même famille. Pas d'audit indépendant de notre côté."),
      ease("Cartes de palier, peu d'écrans.", "Pensé pour enchaîner les choix vite."),
    ],
    prosAlea: ["Mémorial.", "Voix honnête sur ses échecs.", "Sans publicité."],
    consAlea: ["Pas l'accélération la plus forte.", "Français seulement."],
    prosOther: ["Partie très courte.", "Choix au centre.", "Plusieurs langues."],
    consOther: ["Publicité signalée.", "Pas le registre long de 1in8b.life.", "Historique de compte non documenté."],
    faqs: [
      { q: "Aléa est-il une bonne alternative à 1in8b.live ?", a: "Oui pour une lecture plus lente et sans publicité. Non si vous voulez enchaîner dix vies dans la pause déjeuner." },
      { q: "1in8b.live ou Aléa, lequel est le meilleur ?", a: "1in8b.live est le meilleur sprint. Aléa est la meilleure lecture." },
      { q: "1in8b.live et 1in8b.life sont-ils le même jeu ?", a: "Non, d'après le comparatif TechMoon du 16 octobre 2026 : durées, langues, publicité et pages légales diffèrent." },
    ],
    related: ["in8b-com", "alea-vs-1-sur-8-milliards"],
  },
  {
    slug: "the-sims-4",
    other: "Les Sims 4",
    blurb: "La maison, la famille, le bac à sable. Le jeu de base est gratuit.",
    description: "Alternative aux Sims 4 : Aléa vs Les Sims 4, prix des packs, liberté, et lequel est le meilleur en 2026.",
    intro:
      "Les Sims 4, d'Electronic Arts, restent le grand bac à sable de la vie quotidienne. Le jeu de base est gratuit depuis octobre 2022. Les packs se paient à part, et il y en a beaucoup. On y construit une maison, on gère des humeurs, on ne tire pas un pays au sort selon les naissances mondiales.",
    verdict:
      "Les Sims 4 sont meilleurs pour habiter, décorer, raconter un foyer. Aléa est meilleur pour une seule question : si je naissais maintenant, où, et qu'est-ce que ça change. Sur le tirage de naissance, Aléa gagne parce que les Sims ne le font pas.",
    rows: [
      feature("Naissance tirée au sort, une mort, pas de reprise.", "Foyer, maison, relations, humeurs, dans un bac à sable."),
      price("Gratuit.", "Jeu de base gratuit. Packs payants, souvent entre quelques euros et une quarantaine selon les soldes."),
      free("Oui, complète.", "Le jeu de base oui. Beaucoup de ce que les gens appellent « les Sims » est dans les packs."),
      speed("Une vie en une session, ou plus si vous avancez année par année.", "Sans fin. Une famille peut occuper des centaines d'heures."),
      accuracy("Statistiques publiques simplifiées.", "Fiction stylisée. Pas un atlas de mortalité."),
      ease("Une page, trois cartes.", "Très guidée au début, puis immense."),
    ],
    prosAlea: ["Répond au hasard de la naissance.", "Court et sans pack.", "Lisible sur un téléphone."],
    consAlea: ["Pas de maison, pas de personnage 3D.", "Pas de jeu social de foyer."],
    prosOther: ["Le plus profond outil pour une vie domestique.", "Gratuit pour commencer.", "Toujours mis à jour."],
    consOther: ["Les packs coûtent vite cher.", "Ne dit rien du poids réel des naissances.", "Lourd pour une question de dix minutes."],
    faqs: [
      { q: "Aléa est-il une bonne alternative aux Sims 4 ?", a: "Seulement si vous cherchiez le tirage d'une vie, pas une maison. Sinon, non : prenez les Sims, ou Paralives si vous voulez bâtir." },
      { q: "Les Sims 4 ou Aléa, lequel est le meilleur ?", a: "Les Sims pour vivre dedans. Aléa pour voir d'où une vie pourrait commencer." },
      { q: "Les Sims 4 sont-ils gratuits en 2026 ?", a: "Le jeu de base oui, depuis 2022. Les extensions restent payantes." },
    ],
    related: ["paralives", "inzoi"],
  },
  {
    slug: "paralives",
    other: "Paralives",
    blurb: "Le simulateur de vie en accès anticipé, sans DLC payant annoncé.",
    description: "Paralives alternative : Aléa vs Paralives, prix, accès anticipé et lequel choisir en 2026.",
    intro:
      "Paralives, de Paralives Studio (Alex Massé et l'équipe), est en accès anticipé sur Steam depuis le 25 mai 2026, sur Windows et Mac. Le prix affiché en octobre 2026 est 39,99 dollars, parfois 31,99 en solde. Le studio dit ne pas prévoir de DLC payant. On y construit sans grille, on y habite un bourg. Ce n'est pas un tirage de naissance.",
    verdict:
      "Paralives est le meilleur des deux si vous voulez bâtir et regarder des gens vivre dans un lieu. Aléa est le meilleur si la question est statistique : où naît-on quand on ne choisit pas. Acheter Paralives pour remplacer Aléa, ou l'inverse, serait se tromper de jeu.",
    rows: [
      feature("Une vie tirée au sort.", "Construire et vivre dans un bourg, en accès anticipé."),
      price("Gratuit.", "39,99 $ US sur Steam en octobre 2026, achat unique."),
      free("Oui.", "Non. Pas de version gratuite annoncée."),
      speed("Une session.", "Jeu long, encore incomplet (accès anticipé à l'automne 2026)."),
      accuracy("Chiffres publics simplifiés.", "Fiction douce. Pas un modèle démographique."),
      ease("Immédiate dans le navigateur.", "Installation, machine de jeu, outils de construction."),
    ],
    prosAlea: ["Gratuit et immédiat.", "Le sujet est le hasard mondial.", "Rien à installer."],
    consAlea: ["Pas de lieu à bâtir.", "Pas de personnages que l'on regarde vivre."],
    prosOther: ["Construction libre, promesse sans DLC payant.", "Ambiance soignée.", "Un achat, pas une boutique de packs."],
    consOther: ["Payant, et encore en accès anticipé.", "Ne répond pas à « où serais-je né ».", "Demande un ordinateur de jeu."],
    faqs: [
      { q: "Aléa est-il une bonne alternative à Paralives ?", a: "Non si vous voulez construire. Oui si Paralives est trop cher ou trop tôt, et que votre envie était de tirer une vie au sort." },
      { q: "Paralives ou Aléa, lequel est le meilleur ?", a: "Paralives pour le lieu. Aléa pour le tirage. En 2026 Paralives n'est pas encore un jeu fini." },
      { q: "Paralives est-il gratuit ?", a: "Non. 39,99 $ US sur Steam à la mi-octobre 2026, avec des soldes à 31,99 $." },
    ],
    related: ["the-sims-4", "inzoi"],
  },
  {
    slug: "inzoi",
    other: "inZOI",
    blurb: "La vie photoréaliste de Krafton, pour une machine récente.",
    description: "inZOI alternative : Aléa vs inZOI, prix, configuration, et lequel est le meilleur en 2026.",
    intro:
      "inZOI, de Krafton, est un simulateur de vie photoréaliste, sorti en accès anticipé en mars 2025. À l'automne 2026 il se vend autour de 40 dollars, souvent 31,99 en solde, et demande une carte graphique récente. On y crée des personnes très détaillées dans une ville. Le hasard démographique mondial n'est pas son sujet.",
    verdict:
      "inZOI gagne dès que vous voulez voir un visage et une ville. Aléa gagne dès que vous voulez un chiffre honnête et une phrase, sur un téléphone, sans carte graphique. Ce sont deux catégories.",
    rows: [
      feature("Registre de naissance et récit.", "Vie urbaine photoréaliste, création de personnages."),
      price("Gratuit.", "Payant, de l'ordre de 40 $ US, souvent soldé autour de 32 $ à l'automne 2026."),
      free("Oui.", "Non."),
      speed("Une vie lisible dans la session.", "Jeu de longue haleine, exigeant pour la machine."),
      accuracy("Statistiques simplifiées mais sourcées.", "Réalisme visuel, pas réalisme démographique."),
      ease("Navigateur, gros boutons.", "Installation, configuration élevée, nombreux systèmes."),
    ],
    prosAlea: ["S'ouvre partout.", "Gratuit.", "Tient dans une poche."],
    consAlea: ["Aucun visage, aucune ville.", "Le texte fait tout le travail."],
    prosOther: ["Image très poussée.", "Personnages détaillés.", "Une ville à parcourir."],
    consOther: ["Payant et lourd.", "Inadapté à un vieux portable.", "Ne tire pas un pays au sort."],
    faqs: [
      { q: "Aléa est-il une bonne alternative à inZOI ?", a: "Seulement si votre ordinateur ne lance pas inZOI ou si vous ne cherchiez pas un jeu 3D. Pour le spectacle, non." },
      { q: "inZOI ou Aléa, lequel est le meilleur ?", a: "inZOI pour l'image. Aléa pour la question « où est-ce que je nais »." },
      { q: "inZOI tourne-t-il sur un téléphone ?", a: "Non. C'est un jeu PC ou Mac exigeant. Aléa, oui, dans le navigateur." },
    ],
    related: ["paralives", "the-sims-4"],
  },
  {
    slug: "reigns",
    other: "Reigns",
    blurb: "Une carte, un règne, un swipe. Pas une naissance au hasard.",
    description: "Reigns alternative : Aléa vs Reigns, prix, choix binaires, et lequel est le meilleur en 2026.",
    intro:
      "Reigns, de Nerial et Devolver Digital, vous fait roi ou reine : chaque événement est une carte que l'on glisse. Gaming Route, le 15 octobre 2026, le relève à 2,99 dollars, achat unique, sans publicité listée sur le Play Store consulté, avec une très bonne note. La partie est sèche, drôle, et mortelle. Vous ne naissez pas dans un pays tiré au sort : vous héritez d'un trône.",
    verdict:
      "Reigns est le meilleur objet de jeu : chaque geste est une carte, et c'est fini. Aléa est le meilleur miroir du hasard de naissance. Si vous aimez la forme « une décision, une conséquence », les deux se ressemblent un peu. Le sujet, non.",
    rows: [
      feature("Vivre une vie ordinaire tirée au sort.", "Régner, swipe après swipe, jusqu'à la chute."),
      price("Gratuit.", "2,99 $ US, achat unique, d'après la fiche relevée le 15 octobre 2026."),
      free("Oui.", "Non. Pas de publicité listée, mais le jeu se paie."),
      speed("Une vie en chapitres.", "Un règne en quelques minutes. On recommence souvent."),
      accuracy("Démographie simplifiée.", "Conte politique. Les cartes sont écrites, pas tirées d'un annuaire."),
      ease("Trois chemins écrits.", "Un geste : gauche ou droite. Imbattable de clarté."),
    ],
    prosAlea: ["Le sujet est une vie quelconque, pas un trône.", "Gratuit.", "Le registre reste visible à côté du récit."],
    consAlea: ["Moins élégant comme jeu de cartes.", "Plus de texte, moins de geste."],
    prosOther: ["Forme parfaite, très courte.", "Pas de publicité une fois acheté.", "Drôle sans être bavard."],
    consOther: ["Payant, même peu.", "Vous n'êtes jamais n'importe qui : vous êtes souverain.", "Aucune statistique mondiale."],
    faqs: [
      { q: "Aléa est-il une bonne alternative à Reigns ?", a: "Si vous aimiez la décision sèche, un peu. Si vous aimiez le trône, non. Aléa ne vous fait pas régner." },
      { q: "Reigns ou Aléa, lequel est le meilleur ?", a: "Reigns est le meilleur jeu court. Aléa est le meilleur outil pour penser une naissance." },
      { q: "Reigns a-t-il des publicités ?", a: "La fiche citée par Gaming Route le 15 octobre 2026 ne liste ni publicité ni achat intégré. Le prix d'entrée est 2,99 $." },
    ],
    related: ["bitlife", "alea-vs-1-sur-8-milliards"],
  },
];

export function bySlug(slug: string): ComparePage | undefined {
  return PAGES.find((p) => p.slug === slug);
}
