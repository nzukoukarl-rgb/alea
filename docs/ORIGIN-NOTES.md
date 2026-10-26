# Aléa — notes de conception (avant le code)

Source étudiée : [1 sur 8 milliards](https://1in8b.life/fr/) (bêta v0.7.76 au 20 oct. 2026). Jeux de référence : Shattered Pixel Dungeon, Otherworld Legends.

## Le produit

Promesse : « Devenez l’un des bébés qui naissent en ce moment et vivez toute sa vie ». Le problème n’est pas de gérer une maison, c’est de sentir le hasard de la naissance. Public : 15 ans et plus, lecteurs, enseignants (mode classe `?edu=1` qui masque les thèmes lourds). Pas de compte sur l’original : les vies restent sur l’appareil, avec mémorial, statistiques de 172 pays, et transfert manuel.

Fonction centrale, une seule : **naître au hasard selon le poids réel des naissances, puis vivre cette vie jusqu’à la mort, sans reprise.** Tout le reste (compteurs, mémorial, pays, réglages de durée) sert ce tirage.

Pages vues : accueil `/fr/`, statistiques `/fr/c/`, confidentialité, conditions, équivalents de langue, mémorial et « maison des vies antérieures » dans la même page longue. Le bouton « Naître » lance la vie. Paliers à 5, 15, 30, 50 et 70 ans. Choix d’études, de travail, d’amour, d’émigration, de soin. Mode automatique. Quatre autres vies « nées à la même seconde ».

## Design relevé sur le HTML

Tokens exacts (clair) :

- `--paper #EBF0ED`, `--card #F7FAF8`, `--card2 #F0F4F2`
- `--ink #13212A`, `--ink2 #4A5A61`, `--ink3 #5F6E72`
- `--rule #C7D2CE`, `--rule2 #DCE4E1`
- `--accent #8C1D3C` (theme-color), `--accent-ink #FFFFFF`, `--accent-soft #F3E3E8`
- `--stamp #0F6E68`, `--stamp-soft #DCEDEA`, `--gold #9C7020`
- `--good #2B7A4E`, `--bad #B0362B`, `--warn #A8730F`

Sombre (tel que publié) :

- paper `#0D1316`, card `#141D21`, ink `#E1E9E6`, accent `#E2678A`, stamp `#4CC0AF`, gold `#D9AF59`

Caractères : Hahmlet (titres, très grands, ~64–168 px sur le « 1 »), IBM Plex Sans (corps 15 px, interligne 1.6), IBM Plex Mono (kicker 12 px). Largeur 1320 px, gouttière 20 px (16 px sous 520 px). Cartes à filet 1 px, rayon ~4 px, ombre légère. Boutons souvent bordure fine, parfois pilule. Ton : calme, tutoiement absent sur l’accueil, phrases courtes, pas de cri marketing. Citation : « Où vous naîtrez, et de qui, vous ne pouvez pas le choisir. Tout comme vous ne l’avez pas choisi. »

## Jeux de référence, traduits dans ce ton

Shattered Pixel Dungeon : une descente, une mort, pas de chargement. Les profondeurs deviennent ici des années. Le choix de talent au niveau supérieur devient un palier à trois cartes.

Otherworld Legends : trois styles pour une même compétence, HUD de barres en haut à gauche, objets qui ne durent qu’une run. Ici les jauges sont Santé, Lien, Savoir, Avoir. Rien de pixelisé : le papier et le bordeaux restent la marque. Les « nés à la même seconde » sont la partie, que l’on ne contrôle pas.

## Décisions

- Nom distinct : **Aléa**. Ce n’est pas le site officiel.
- 55 pays, poids de naissances renormalisés, chiffres arrondis d’ordres de grandeur publics (ONU, OMS, Banque mondiale, autour de 2023), pas les 172 lignes de l’original.
- Le moteur statistique décide des faits. Le modèle n’écrit que la voix, et seulement après un geste (naître, choisir, réessayer). S’il échoue, aucun texte littéraire de remplacement.
- Pas « une minute par année » : un pas par chapitres (palier à palier) pour qu’une vie tienne dans une session, et un pas année par année pour qui veut la vigile.
- Compte facultatif. Un visiteur anonyme garde ses vies dans le navigateur. L’original n’a pas de compte ; on l’ajoute parce que l’historique et l’inscription sont demandés.
- La mort, la pauvreté, la violence restent des étiquettes. Mode classe pour les couper. Ligne d’aide réelle (3114, IASP) sans inventer de numéro local.
