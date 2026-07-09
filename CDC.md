# Cahier des charges — « L'Entreprise Mystère »

## Serious game web pour la journée de rentrée des apprentis IMT-BS

| | |
|---|---|
| **Projet** | Application web « L'Entreprise Mystère » |
| **Commanditaire** | Career Center — IMT Business School |
| **Rédacteur** | Julien Morice, Responsable ingénierie pédagogique (DFI / Appui Pédagogique) |
| **Version** | 1.0 — 9 juillet 2026 |
| **Document source** | `Document_CC_Entreprise_Mystere V.2 LL.docx` (proposition de gamification, version Marine/LL) |
| **Échéance de livraison** | **Fin juillet 2026** (validation Career Center/CFA avant congés) — mise en service : journée de rentrée apprentis, septembre 2026 |

---

## 1. Contexte et objectifs

### 1.1 Contexte

Chaque rentrée, IMT-BS accueille ses nouveaux apprentis (Bachelor et Programme Grande École) lors d'une journée d'intégration. Le Career Center doit leur transmettre un volume important d'informations réglementaires et pratiques : émargement Edusign, gestion des absences, contrat d'objectif, visites et évaluations entreprise, statut SFP, interlocuteurs clés, procédures en cas de conflit ou de rupture de contrat. Une présentation descendante classique génère peu de rétention.

La proposition pédagogique validée (document source) transforme cette transmission en **serious game narratif** : l'apprenti devient un agent secret intégrant « l'Académie de l'Alternance » et doit résoudre trois dossiers d'enquête pour prouver qu'il connaît les règles du jeu.

La version initiale prévoyait un montage Genially. **Le présent cahier des charges spécifie le remplacement de Genially par une application web sur mesure, développée en interne (Julien Morice + Claude Code), versionnée et hébergée sur GitHub (GitHub Pages).** La finale compétitive reste sur **Wooclap** et est **hors périmètre** de l'application.

### 1.2 Objectifs pédagogiques

À l'issue du jeu, l'apprenti doit être capable de :

1. Identifier son premier interlocuteur pour toute question d'apprentissage (pôle alternance) et connaître les autres contacts clés (CFA, coordinatrices, référente handicap, tuteur école, pôle accompagnement, pôle médical).
2. Appliquer les procédures d'assiduité : émargement Edusign (signature officielle, 15 premières minutes), justification d'absence sous 48h, arrêt de travail (et non certificat médical) en cas de maladie.
3. Comprendre son double statut salarié/étudiant et ses implications (comportement professionnel, semaines école contractuelles).
4. Respecter les échéances de l'année : contrat d'objectif (mi-novembre), visites et évaluations entreprise (28/02 et 30/08), statut SFP si sans contrat (fin octobre Bachelor / mi-novembre PGE).
5. Mobiliser les bons recours en situation complexe : escalade progressive (dialogue direct → tuteur école → pôle alternance), rémunération manquante, harcèlement, rupture de contrat.

### 1.3 Objectifs de l'application

- Remplacer Genially par un support **pérenne, gratuit, maîtrisé et modifiable chaque année** sans dépendance à un outil tiers payant.
- Offrir une expérience **immersive et fluide sur mobile** (usage en binôme sur smartphone).
- Rester **accessible toute l'année** comme ressource de révision (calendrier des échéances et annuaire consultables à tout moment).
- Fournir aux animateurs une **preuve de complétion légère** par binôme (écran final + récapitulatif exportable), sans backend ni collecte centralisée.

### 1.4 Indicateurs de réussite

- 100 % des binômes terminent les 3 dossiers dans le créneau de ~45 minutes prévu.
- L'application fonctionne sans incident sur les smartphones personnels des étudiants (iOS/Android, navigateurs récents) et en Wi-Fi campus chargé.
- Le Career Center valide le contenu affiché comme strictement conforme au document source (mêmes questions, mêmes messages réglementaires).
- La mise à jour annuelle du contenu (dates, contacts, questions) est réalisable en moins d'une demi-journée avec Claude Code.

---

## 2. Public cible et contexte d'utilisation

| Dimension | Description |
|---|---|
| **Utilisateurs finaux** | Nouveaux apprentis Bachelor et PGE (contrats signés ou en recherche), ~18–24 ans, équipés de smartphones personnels |
| **Mode de jeu** | **En binôme sur un seul appareil** (smartphone en priorité, tablette ou PC possibles) |
| **Lieu** | Campus IMT-BS Évry — salles de cours et amphi, Wi-Fi campus (débit variable, connexions simultanées massives) |
| **Moment principal** | Journée de rentrée, séquence de ~45 min (3 × ~15 min) avant la finale Wooclap en amphi |
| **Usage secondaire** | Consultation libre toute l'année (révision, calendrier, annuaire) |
| **Animateurs** | Équipe Career Center / CFA : lancent la session, circulent entre les binômes, vérifient les écrans de complétion |
| **Encadrement technique** | Aucun support technique dédié le jour J : l'app doit être auto-porteuse (zéro installation, zéro compte, zéro configuration) |

---

## 3. Périmètre

### 3.1 Inclus dans le périmètre

- Écran d'accueil avec **identification légère du binôme** (prénoms des 2 agents — champ libre, aucune donnée transmise à un serveur).
- **Introduction narrative** (briefing de mission).
- **Hub central** (tableau de bord de l'agence) donnant accès aux 3 dossiers et aux 2 objets permanents.
- **2 objets permanents** accessibles à tout moment : Calendrier de l'agent (5 dates clés) et Annuaire de l'agence (fiches contact).
- **Dossier 1 — « Infiltration à l'académie »** : mur de post-it, plan de campus interactif à 4 zones, 7 questions, dossier à feuilleter Edusign, panneau d'alerte SFP, rapport de débriefing (5 cases), message de transition.
- **Dossier 2 — « Opération terrain »** : open space interactif de Nexus Corp, personnages cliquables, 7 questions, 2 dossiers à feuilleter, panneau d'alerte sanctions, rapport de débriefing (5 cases), message de transition.
- **Dossier 3 — « Le cas critique »** : tableau de crise à 3 alertes indépendantes, 5 questions, mécanique de fragments de code, panneaux d'alerte harcèlement + rappels handicap/SFP, rapport de débriefing final (5 cases).
- **Écran final** : code d'accès à la finale reconstitué, carte d'agent récapitulative, **export/preuve de complétion**.
- **Suivi de progression local** (reprise après fermeture du navigateur).
- Design responsive mobile-first, univers espionnage aux couleurs IMT-BS.
- Documentation du dépôt GitHub (README, guide de mise à jour du contenu).

### 3.2 Exclus du périmètre

- La **finale Wooclap** (10 questions flash, classement en direct) : elle reste sur Wooclap, animée en amphi. L'application s'arrête à la remise du code d'accès / transition vers la finale.
- Le **débriefing oral** du CFA (séquence humaine, hors outil).
- Tout **backend** : pas de base de données, pas de compte utilisateur, pas de classement inter-binômes, pas de tableau de bord animateur en ligne.
- Application native (iOS/Android) : le livrable est une web app.
- Multilinguisme : français uniquement.

### 3.3 Décisions de cadrage actées

| Sujet | Décision |
|---|---|
| Périmètre fonctionnel | 3 manches + objets permanents ; finale Wooclap hors app |
| Données personnelles | **Aucune collecte serveur.** Prénoms saisis localement, récapitulatif exportable côté client uniquement |
| Confidentialité du site | **Site public assumé** (coordonnées professionnelles déjà semi-publiques) — pas de mot de passe |
| Direction artistique | Univers espionnage immersif **+ identité IMT-BS** (logo, violet #AD1D89, bleu #00B8DE) |
| Maintenance | Assurée par Julien Morice avec Claude Code ; contenu néanmoins isolé du code (cf. §7.4) |
| Disponibilité | En ligne **toute l'année** (ressource de révision) |
| Échéance | Version finale validable **fin juillet 2026** |

---

## 4. Architecture générale de l'expérience

```
Accueil (identification binôme)
   └─> 🎬 Intro narrative (3 messages, ~1 min)
         └─> 🗂️ HUB — Tableau de bord de l'agence
               ├─ 📅 Calendrier de l'agent      [permanent, non bloquant]
               ├─ 📞 Annuaire de l'agence        [permanent, non bloquant]
               ├─ 📁 Dossier 1 — Infiltration à l'académie   (~15 min)
               │     post-it → 4 zones/7 questions → alerte SFP → débriefing → transition
               ├─ 📁 Dossier 2 — Opération terrain           (~15 min)  [déverrouillé par D1]
               │     open space → 7 questions + 2 dossiers → alerte sanctions → débriefing → transition
               ├─ 📁 Dossier 3 — Le cas critique             (~15 min)  [déverrouillé par D2]
               │     3 alertes → 5 questions → fragments de code → alertes finales → débriefing final
               └─> 🏆 Écran final : code d'accès + carte d'agent + export
                     └─> (hors app) Finale Wooclap en amphi
```

**Progression linéaire verrouillée** : le Dossier 2 ne s'ouvre qu'après validation du rapport de débriefing du Dossier 1, idem pour le Dossier 3. À l'intérieur du Dossier 3, les 3 alertes sont résolubles **dans n'importe quel ordre** (conforme au document source). Le calendrier et l'annuaire sont accessibles depuis **tous les écrans** via une barre persistante, sans jamais bloquer ni réinitialiser la progression.

---

## 5. Spécifications fonctionnelles détaillées

> Le contenu textuel exact (questions, réponses, messages « Ce qu'il faut retenir », panneaux d'alerte) est celui du document source, repris **mot pour mot** sauf corrections listées en Annexe B. Ce chapitre spécifie les mécaniques et comportements.

### 5.1 Module A — Accueil et identification du binôme

- Écran d'ouverture immersif : logo de « l'Agence de l'Alternance », tampon « CONFIDENTIEL », logo IMT-BS discret.
- Saisie des **prénoms des 2 agents** (2 champs texte, 30 caractères max chacun, le 2e optionnel pour joueur solo). Aucune autre donnée demandée.
- Sélection du **programme** : Bachelor / PGE. Cette sélection personnalise les échéances affichées quand elles diffèrent (SFP : fin octobre Bachelor vs mi-novembre PGE ; coordinatrices affichées en tête d'annuaire).
- Bouton « Démarrer la mission ». Les données sont stockées en `localStorage` uniquement.
- Si une partie est en cours (données locales détectées) : proposer « Reprendre la mission » ou « Nouvelle mission » (avec confirmation d'effacement).

### 5.2 Module B — Introduction narrative

- 3 messages affichés séquentiellement avec effet machine à écrire / télex, personnalisés avec les prénoms saisis :
  1. « Félicitations, agent. Votre contrat est signé. Vous intégrez officiellement l'Académie de l'Alternance. »
  2. « Mais avant de prendre vos fonctions, vous devez prouver que vous connaissez les règles du jeu. »
  3. « Trois dossiers vous attendent. Bonne chance. »
- Bouton « Passer » disponible (ne jamais bloquer un utilisateur pressé sur du narratif pur).
- Durée cible : ≤ 1 minute.

### 5.3 Module C — Hub (tableau de bord de l'agence)

- Représente le QG : 3 dossiers kraft (Dossier 1/2/3) + accès calendrier et annuaire.
- États visuels des dossiers : **verrouillé** (cadenas + « Accès refusé »), **disponible** (tampon « À TRAITER »), **en cours** (progression x/n questions), **validé** (tampon « CLASSÉ » + voyant vert).
- Affiche les prénoms du binôme et une jauge de progression globale.

### 5.4 Module D — Calendrier de l'agent (objet permanent)

- Accessible depuis tous les écrans (icône 📅 dans la barre persistante) ; s'ouvre en surcouche (overlay) sans quitter l'écran courant.
- Visuel : agenda mural avec **5 punaises colorées**. Un clic/tap sur une punaise ouvre la fiche de la date : action à mener + conséquence en cas d'oubli.
- Contenu des 5 punaises (rouge : émargement Edusign à chaque cours · orange : statut SFP si sans contrat · bleu : contrat d'objectif avant le 30 novembre · vert : 1re visite + 1re évaluation avant le 28 février · vert foncé : 2e visite + 2e évaluation avant le 30 août) — textes complets du document source.
- Les dates sont filtrées/annotées selon le programme choisi (Bachelor/PGE) lorsque pertinent.

### 5.5 Module E — Annuaire de l'agence (objet permanent)

- Accessible depuis tous les écrans (icône 📞), en surcouche.
- Répertoire « confidentiel » : liste de **10 fiches contact** cliquables. Chaque fiche : nom/service, rôle, quand s'y adresser, coordonnées (email/téléphone quand disponibles dans le document source).
- Fiches : Pôle alternance (mis en avant comme 1er interlocuteur) · Typhaine MILLOT, CFA (Bachelor) · Adeline PUJOL, CFA (PGE) · Coordinatrice Bachelor Mme CAVARD · Coordinatrice PGE2 Mme MARLAND DELPIERRE · Coordinatrices PGE3 Mmes ANTUNES/VANG/HERIZI (par majeure) · Elodie DARRAC, référente handicap · Pôle Accompagnement étudiant · Pôle médical (infirmière Mme GALLINEAU) · Tuteur école.
- Filtre visuel selon programme (la coordinatrice non concernée reste visible mais grisée/secondaire).

### 5.6 Moteur de questions (composants réutilisables)

Le jeu comporte 4 mécaniques de question, implémentées comme composants génériques pilotés par le fichier de contenu :

| Mécanique | Comportement |
|---|---|
| **QCM** (1 ou plusieurs bonnes réponses) | Options mélangées ou fixes selon paramétrage ; sélection simple ou multiple ; validation explicite par bouton |
| **Vrai / Faux** | 2 grands boutons |
| **Remettre dans l'ordre** | Glisser-déposer tactile (drag & drop) **avec alternative par taps** (taper les éléments dans l'ordre) pour l'accessibilité et les petits écrans |
| **Matching / appariement** | Relier chaque élément de gauche à sa cible (tap séquentiel élément→cible, plus fiable que le tracé de lignes sur mobile) |

**Comportement commun à toutes les questions :**

- **Bonne réponse** : animation de validation (voyant vert, tampon « VALIDÉ »), affichage systématique de l'encart **« 💬 Ce qu'il faut retenir »** (c'est le cœur pédagogique — il doit être lu, pas seulement affiché : bouton « Compris, continuer » pour le fermer).
- **Mauvaise réponse** : feedback bienveillant (« Piste incorrecte, agent. Réessayez. »), **nouvelle tentative illimitée** sans pénalité bloquante. À partir de la 2e erreur sur une même question, un **indice** optionnel s'affiche (renvoi vers le calendrier ou l'annuaire quand pertinent). Après validation, l'encart « Ce qu'il faut retenir » s'affiche dans tous les cas.
- Aucune question n'est sautable : la progression exige la bonne réponse (l'objectif est l'apprentissage, pas l'évaluation).
- Le nombre de tentatives par question est compté localement (statistique du récapitulatif final, jamais punitive).

### 5.7 Composants narratifs enrichis (réutilisables)

| Composant | Comportement |
|---|---|
| **🗒️ Mur de post-it** | Tableau liège, 6 post-it colorés. Tap = animation de retournement révélant l'info. Poursuite possible quand **tous** les post-it ont été retournés (compteur x/6). |
| **📋 Dossier à feuilleter** | Dossier kraft s'ouvrant en vue « pages » (3 ou 4 pages), navigation par balayage/flèches, indicateur de page. Poursuite possible après avoir atteint la dernière page. |
| **⚡ Panneau d'alerte (non zappable)** | Plein écran, style « message prioritaire du QG », impossible à ignorer : le bouton de fermeture (« Bien reçu ») n'apparaît qu'après un délai de lecture minimal (ex. 8 s, ajustable dans le contenu) ou après défilement complet du texte. |
| **✅ Rapport de débriefing** | 5 cases à cocher formulées à la 1re personne (« J'émargerai sur Edusign… »). Le bouton « Valider le rapport » ne s'active que lorsque les 5 cases sont cochées. Valide le dossier et déverrouille le suivant. |
| **📨 Message du QG (transition)** | Écran de style messagerie sécurisée entre deux dossiers ; fermeture libre. |

### 5.8 Dossier 1 — « Infiltration à l'académie » (Mon arrivée à l'école)

- **Séquence** : mur de post-it (6 post-it, §5.7) → plan de campus interactif → alerte SFP → débriefing → transition.
- **Plan de campus interactif** : illustration stylisée du campus avec **4 zones cliquables**, chacune surmontée d'un voyant (éteint → vert une fois la zone terminée) :
  - **Zone A — Secrétariat / Pôle alternance** : Q1 (QCM premier interlocuteur).
  - **Zone B — Salle de cours / Edusign** : Q2 (QCM plateforme d'émargement) → dossier à feuilleter « Procédure officielle Edusign » (4 pages) → Q3 (V/F signature).
  - **Zone C — Bureau des coordinatrices / Absences** : Q4 (ordre — maladie, 4 étapes : B→C→A→D) → Q5 (matching — 4 situations/procédures).
  - **Zone D — Règles de comportement** : Q6 (QCM délai 48h) → Q7 (V/F statut salarié).
- Zones jouables dans n'importe quel ordre ; **le mur de post-it est obligatoire avant l'accès aux zones**.
- 4 voyants verts → **panneau d'alerte SFP** (statut stagiaire de la formation professionnelle, formulaire P2S, délais) → **rapport de débriefing** (5 cases) → **message du QG** (rappel Ameli) → retour au hub, Dossier 2 déverrouillé.

### 5.9 Dossier 2 — « Opération terrain » (Mes débuts en entreprise)

- **Décor** : open space illustré de l'entreprise fictive **Nexus Corp**, avec **4 personnages cliquables** (voyant par personnage) :
  - **Le Tuteur** : Q8 (QCM tuteur absent le 1er jour).
  - **Le Collègue RH** : Q9 (matching — 5 comportements à valoriser ✅ / éviter ❌).
  - **L'Équipe** : Q10 (QCM retard accident — réponses multiples A+B) → Q11 (V/F contrat d'objectif) → Q12 (QCM pose de congés — réponses multiples B+C) → dossier à feuilleter « Rencontre tuteur école » (4 pages).
  - **Le Manager** : Q13 (ordre — contrat d'objectif, 5 étapes : B→D→C→E→A) → dossier à feuilleter « Visites entreprise et évaluations » (3 pages) → Q14 (QCM rester jusqu'à 20h).
- Personnages jouables dans n'importe quel ordre.
- 4 voyants verts → **panneau d'alerte Sanctions disciplinaires** (Article 25 RI CFA) → **rapport de débriefing** (5 cases, dont fiches CLOE) → **message du QG** (carte étudiant des métiers + référente handicap) → retour au hub, Dossier 3 déverrouillé.

> **Note de renumérotation** : le document source contient des numéros de questions incohérents (deux « Q1 », une question sans numéro, Q12/Q13 référencés mais absents). L'application adopte la numérotation continue Q1–Q19 ci-dessus. Cf. Annexe B.

### 5.10 Dossier 3 — « Le cas critique » (Situation complexe)

- **Décor** : tableau de crise du QG, **3 alertes colorées indépendantes**, résolubles dans n'importe quel ordre. Chaque alerte résolue libère **un fragment du code d'accès à la finale** (affichage type « fragment déchiffré : ▓▓ 7 ▓ »).
  - **🔴 Alerte Rouge — Modification du rythme alternance** : Q15 (QCM réponses multiples C+D).
  - **🟠 Alerte Orange — Rémunération manquante** : Q16 (ordre, 5 étapes : B→C→A→D→E).
  - **🟡 Alerte Jaune — Conflit avec le tuteur** : Q17 (escalade à 3 niveaux à ordonner : dialogue direct → tuteur école → pôle alternance) → Q18 (QCM période d'essai 45 jours) → Q19 (V/F accompagnement après rupture).
- 3 alertes résolues → **panneau d'alerte Harcèlement** (Article 27 RI CFA, non zappable) → **message du QG rappel handicap/santé** (Elodie DARRAC, infirmière, pôle accompagnement) → **message du QG rappel SFP final** → **rapport de débriefing final** (5 cases).

### 5.11 Module F — Écran final et export de complétion

- **Révélation du code d'accès complet** (assemblage animé des 3 fragments) : code court (ex. 6 caractères) que l'animateur peut demander à voix haute pour vérifier la complétion — le code est **identique pour tous** (défini dans le fichier de contenu, changé chaque année).
- **Carte d'agent récapitulative** : prénoms du binôme, programme, mention « Mission accomplie — Accréditation délivrée », date/heure de complétion, statistiques (temps par dossier, questions réussies du premier coup), et rappel des 5 dates clés + contacts prioritaires.
- **Export** : bouton « Télécharger mon rapport de mission » générant une **image PNG** de la carte d'agent (rendu canvas côté client) — facile à montrer, à partager ou à envoyer. Pas d'envoi automatique, pas de serveur.
- Message de transition vers la finale : « Rendez-vous en salle de conférence de presse. Gardez votre code d'accès. » + rappel que le calendrier et l'annuaire restent consultables toute l'année à la même adresse.

### 5.12 Persistance et reprise

- Toute la progression (binôme, programme, réponses validées, cases cochées, fragments, horodatages) est sauvegardée en `localStorage` à chaque étape.
- Fermeture/rechargement du navigateur → reprise exacte à l'écran en cours.
- Bouton « Réinitialiser la mission » disponible dans un menu discret (avec double confirmation), pour les tests et le réemploi d'un appareil par un autre binôme.

### 5.13 Mode animateur (léger)

- URL avec paramètre (ex. `?mode=animateur`) ou page `/animateur` non liée dans la navigation : affiche l'ensemble des questions/réponses/messages sur une seule page (antisèche de l'équipe Career Center le jour J) + le code final de l'année.
- Aucune authentification (site public assumé) ; la page n'est simplement pas référencée dans le jeu.

---

## 6. Gamification — principes retenus

| Levier | Implémentation |
|---|---|
| **Narration** | Fil rouge agence secrète du début à la fin : vocabulaire (agent, QG, dossier, accréditation), tampons, messages chiffrés |
| **Progression visible** | Voyants verts par zone/personnage/alerte, tampons « CLASSÉ » sur les dossiers, jauge globale au hub |
| **Déblocage** | Progression linéaire entre dossiers, fragments de code (Dossier 3), code final = récompense collective utilisable en amphi |
| **Feedback immédiat** | Animations de validation, encarts « Ce qu'il faut retenir » systématiques, indices progressifs après erreur |
| **Curiosité** | Post-it à retourner, dossiers à feuilleter, punaises à explorer — micro-interactions de découverte |
| **Engagement sans stress** | Pas de score punitif ni de chrono bloquant dans les manches ; la compétition est réservée à la finale Wooclap |
| **Coopération** | Jeu en binôme sur un écran : les mécaniques (matching, mise en ordre) favorisent la discussion |
| **Trophée** | Carte d'agent exportable (PNG) personnalisée = souvenir + fiche mémo des dates et contacts |

Un **chronomètre indicatif discret** par dossier (non bloquant) aide les binômes à tenir le rythme des ~15 minutes ; à dépassement, simple message « Le QG s'impatiente… » sans conséquence.

---

## 7. Spécifications techniques

### 7.1 Stack et hébergement

| Élément | Choix | Justification |
|---|---|---|
| **Type** | Web app statique single-page | Aucun backend requis (décision §3.3) |
| **Technologies** | HTML5, CSS3, JavaScript **vanilla** (ES modules), sans framework ni étape de build | Maintenance par Julien + Claude Code ; zéro dépendance à installer, zéro chaîne de build à entretenir ; longévité maximale |
| **Hébergement** | **GitHub Pages** sur dépôt public du compte `julienmorice` | Gratuit, HTTPS natif, déploiement automatique à chaque push sur `main` |
| **Nom du dépôt (proposé)** | `entreprise-mystere-imtbs` | URL : `https://julienmorice.github.io/entreprise-mystere-imtbs/` |
| **Bibliothèques autorisées** | Uniquement si auto-hébergées dans le dépôt (pas de CDN) et justifiées ; cible : zéro dépendance | Fiabilité sur Wi-Fi chargé, pérennité |

### 7.2 Structure du dépôt

```
entreprise-mystere-imtbs/
├── index.html              # Point d'entrée unique
├── css/
│   └── styles.css          # Charte espionnage + IMT-BS (variables CSS)
├── js/
│   ├── app.js              # Routage d'écrans, orchestration
│   ├── state.js            # Progression, localStorage
│   ├── engine/             # Composants : qcm.js, vraifaux.js, ordre.js, matching.js,
│   │                       #   postit.js, dossier-feuillete.js, alerte.js, debriefing.js
│   └── export.js           # Génération PNG carte d'agent (canvas)
├── content/
│   └── content.json        # ★ TOUT le contenu pédagogique (cf. §7.4)
├── assets/
│   ├── img/                # Décors (campus, open space, QG), tampons, logo IMT-BS
│   └── fonts/              # Polices auto-hébergées
├── animateur.html          # Antisèche animateur (§5.13)
├── README.md               # Présentation, lancement local, déploiement
├── GUIDE_MISE_A_JOUR.md    # Procédure de mise à jour annuelle du contenu
└── CDC.md                  # Copie du présent cahier des charges
```

### 7.3 Compatibilité et performance

- **Mobile-first** : conception à partir de 360 px de large ; testé sur iOS Safari et Android Chrome (2 dernières versions majeures), puis tablette et desktop (Chrome, Edge, Firefox, Safari).
- **Poids total ≤ 5 Mo** (images optimisées WebP/SVG, chargement différé des décors) ; premier affichage < 3 s sur 4G partagée.
- **Résilience réseau** : après le chargement initial, le jeu fonctionne entièrement hors ligne (aucun appel réseau en cours de partie). Un **service worker** met en cache l'ensemble des ressources (Progressive Web App légère) : une coupure Wi-Fi en cours de partie ne perturbe pas le jeu.
- Interactions tactiles : cibles de tap ≥ 44 px, pas de dépendance au survol (hover).
- Aucune orientation imposée ; le portrait est l'orientation de référence.

### 7.4 Fichier de contenu (`content.json`)

Même si la maintenance passe par Claude Code, **la totalité du contenu pédagogique est isolée dans un unique fichier JSON**, jamais dans le code :

- métadonnées (année, code final, durées cibles, délai des panneaux d'alerte),
- calendrier (5 punaises), annuaire (10 fiches, avec champ `programme` pour le filtrage Bachelor/PGE),
- intro, messages du QG, panneaux d'alerte,
- les 19 questions (type, énoncé, options, bonne(s) réponse(s), indice, encart « Ce qu'il faut retenir »),
- post-it, pages des dossiers à feuilleter, cases des débriefings.

Bénéfices : mise à jour annuelle = édition d'un seul fichier ; relecture du contenu par le Career Center possible sans lire le code ; réutilisation du moteur pour un futur jeu (autre école, autre thème) en changeant uniquement `content.json` et les décors.

### 7.5 Qualité et tests

- Validation automatique du `content.json` au chargement (schéma : champs requis, réponses correctes existantes dans les options) avec message d'erreur explicite en console — évite les régressions lors des mises à jour annuelles.
- Scénario de recette complet (Annexe C) exécuté sur : iPhone (Safari), Android (Chrome), iPad, PC (Chrome + Firefox).
- Test de charge réaliste : GitHub Pages tient nativement ~200 accès simultanés à un site statique ; vérifier uniquement le temps de chargement initial en conditions réelles (test en salle avec l'équipe).

---

## 8. Direction artistique

### 8.1 Univers

**« Dossier confidentiel »** : ambiance agence d'investigation — fonds sombres (bleu nuit/anthracite), textures papier kraft et tampons encreurs, machine à écrire/télex pour les messages du QG, punaises et post-it réalistes, voyants lumineux. Ton graphique sérieux mais ludique, jamais anxiogène (le contenu réglementaire est déjà dense).

### 8.2 Intégration de la charte IMT-BS

- **Violet IMT-BS `#AD1D89`** : couleur d'accent principale (boutons d'action, voyants de validation secondaires, éléments interactifs).
- **Bleu IMT-BS `#00B8DE`** : couleur d'accent secondaire (liens, éléments d'information, code d'accès).
- Logo IMT-BS présent sur l'écran d'accueil, la carte d'agent exportée et le pied de page — discret ailleurs pour préserver l'immersion.
- Typographies : une police « dossier administratif » (style machine à écrire / tampon) pour l'habillage narratif + une police sans-serif très lisible pour les questions et contenus pédagogiques.
- Contrastes conformes accessibilité (cf. §9) : le violet et le bleu IMT-BS sur fond sombre seront déclinés en variantes éclaircies validées au contraste.

### 8.3 Illustrations

3 décors principaux à produire (plan de campus stylisé, open space Nexus Corp, tableau de crise du QG) + éléments d'interface (dossiers kraft, post-it, punaises, tampons, badges). Production en SVG/illustration flat générée en interne (outils IA de génération + retouche), style cohérent entre les 3 décors. Aucun visage réel, aucun élément sous copyright.

---

## 9. Accessibilité, RGPD et mentions

### 9.1 Accessibilité

Cible : niveau **RGAA/WCAG AA raisonnable** pour un serious game :

- Contrastes texte/fond ≥ 4,5:1 ; information jamais portée par la couleur seule (les voyants verts sont doublés d'un tampon/libellé).
- Navigation clavier complète sur desktop ; alternatives par taps aux glisser-déposer (§5.6).
- Textes réels (pas de texte en image) pour tout le contenu pédagogique ; attributs `alt`/ARIA sur les éléments interactifs.
- Taille de police ajustable (respect du zoom navigateur, unités relatives).
- Pas de contenu clignotant ; animations désactivées si `prefers-reduced-motion`.

### 9.2 Données personnelles

- Seules données saisies : prénoms du binôme — stockés **exclusivement en `localStorage` de l'appareil de l'étudiant**, jamais transmis. Pas de cookies tiers, pas d'analytics, pas de formulaire réseau. → Pas de traitement de données au sens déclaratif ; une mention d'information simple figure en pied de page.
- Coordonnées du personnel affichées (annuaire) : coordonnées professionnelles, publication validée par le Career Center (décision « public assumé », §3.3). Point de vigilance : **faire confirmer par écrit aux personnes nommées** (T. MILLOT, A. PUJOL, E. DARRAC, coordinatrices, Mme GALLINEAU) l'accord de publication de leur nom/email/téléphone sur un site public, avant mise en ligne.

### 9.3 Mentions

Pied de page : « IMT Business School — Career Center · Serious game pédagogique · [année] » + lien mailto de contact + mention données locales.

---

## 10. Livrables

| # | Livrable | Format |
|---|---|---|
| L1 | Dépôt GitHub complet (code + assets + contenu) | Dépôt public `entreprise-mystere-imtbs` |
| L2 | Application déployée et fonctionnelle | URL GitHub Pages |
| L3 | `content.json` conforme au document source (avec corrections Annexe B validées) | JSON |
| L4 | `README.md` + `GUIDE_MISE_A_JOUR.md` (procédure annuelle pas à pas) | Markdown |
| L5 | Page animateur (antisèche) | `animateur.html` |
| L6 | Rapport de recette (checklist Annexe C exécutée, captures) | Markdown/PDF |

---

## 11. Planning (échéance : fin juillet 2026)

| Semaine | Jalons |
|---|---|
| **S1 — 13→17 juil.** | Validation du présent CDC par le Career Center · arbitrage des points Annexe B · initialisation du dépôt · maquette de la DA (accueil + hub + 1 question type) · structure `content.json` complète |
| **S2 — 20→24 juil.** | Développement du moteur (4 mécaniques de question + composants narratifs) · Dossier 1 complet jouable · calendrier + annuaire · décors v1 |
| **S3 — 27→31 juil.** | Dossiers 2 et 3 · écran final + export PNG · page animateur · PWA/offline · recette multi-appareils · **livraison au Career Center le 31 juillet** |
| **Août** | Retours Career Center/CFA (corrections de contenu uniquement) · confirmation écrite des personnes nommées à l'annuaire |
| **Fin août** | Répétition générale en conditions réelles (salle, Wi-Fi campus, 5–10 testeurs) · gel de la version |
| **Septembre** | Journée de rentrée — mise en service |

---

## 12. Critères d'acceptation (recette)

L'application est réputée conforme si :

1. Un binôme sans aucune consigne technique termine les 3 dossiers en 40–50 minutes sur un smartphone.
2. Chaque question, message, panneau et débriefing du document source est présent, exact et affiché au bon moment (relecture croisée Career Center).
3. Les panneaux d'alerte sont effectivement non zappables ; les débriefings exigent les 5 cases ; les dossiers se déverrouillent dans l'ordre.
4. Calendrier et annuaire sont accessibles depuis chaque écran sans perte de progression.
5. Fermer et rouvrir le navigateur restaure la partie à l'écran exact.
6. Le jeu reste jouable après coupure du Wi-Fi une fois chargé.
7. La carte d'agent PNG se télécharge sur iOS Safari et Android Chrome.
8. La sélection Bachelor/PGE adapte les échéances SFP et l'annuaire.
9. Aucune requête réseau ne transporte de donnée saisie par l'utilisateur (vérifiable via les outils réseau du navigateur).
10. Le site obtient un score Lighthouse ≥ 90 en accessibilité et performance mobile.

---

## Annexe A — Inventaire du contenu (source de vérité : document Word V.2 LL)

- **Intro** : 3 messages narratifs.
- **Objets permanents** : calendrier 5 punaises · annuaire 10 fiches.
- **Dossier 1** (7 questions) : Q1 QCM · Q2 QCM · Q3 V/F · Q4 ordre (4 items) · Q5 matching (4 paires) · Q6 QCM · Q7 V/F + 1 mur de 6 post-it + 1 dossier feuilletable (4 p.) + 1 alerte + 1 débriefing (5 cases) + 1 message QG.
- **Dossier 2** (7 questions) : Q8 QCM · Q9 matching (5 items) · Q10 QCM multi · Q11 V/F · Q12 QCM multi · Q13 ordre (5 items) · Q14 QCM + 2 dossiers feuilletables (4 p. + 3 p.) + 1 alerte + 1 débriefing (5 cases) + 1 message QG.
- **Dossier 3** (5 questions) : Q15 QCM multi · Q16 ordre (5 items) · Q17 escalade (3 niveaux) · Q18 QCM · Q19 V/F + 1 alerte + 2 messages QG + 1 débriefing final (5 cases).
- **Hors app** : finale Wooclap (10 questions QW1–QW10) et séquence de débriefing CFA — conservées dans le document source pour l'animation en amphi.

**Total in-app : 19 questions, 6 post-it, 3 dossiers feuilletables (11 pages), 3 panneaux d'alerte, 5 messages QG, 3 débriefings (15 engagements).**

## Annexe B — Points du document source à arbitrer avec le Career Center (avant S1)

1. **Numérotation des questions** incohérente dans le source (deux « Q1 », une question congés sans numéro, renvois « après Q12/Q13 » erronés, durées « ~12 min » en vue d'ensemble vs « 15 min » dans les dossiers). → Le CDC adopte Q1–Q19 et ~15 min/dossier ; à faire valider.
2. **Compte de questions annoncé** (« 6 questions » pour les dossiers 2 et 3) ne correspond pas au contenu réel (7 et 5). → Sans impact fonctionnel ; corriger le document source.
3. **Q4 (maladie — remise en ordre)** : l'ordre correct indiqué (B→C→A→D : prévenir la coordinatrice avant de consulter le médecin) mérite confirmation pédagogique — l'intention est probablement « prévenir école et employeur au plus tôt, puis consulter, puis transmettre ».
4. **Date du contrat d'objectif** : le calendrier permanent dit « avant le 30 novembre », plusieurs questions et débriefings disent « mi-novembre ». → Harmoniser (le CDC retient **mi-novembre** partout, aligné sur QW5 et l'alerte SFP, sauf contre-indication).
5. **Délais SFP** : l'alerte du Dossier 1 mentionne « fin-novembre (PGE) », le calendrier et le rappel final disent « mi-novembre (PGE) ». → Harmoniser (le CDC retient mi-novembre PGE / fin octobre Bachelor).
6. **Contact PC portable** (`j.louchart@cfa-eve.fr`) et coordonnées d'Elodie DARRAC : confirmer validité avant publication.
7. **QW1 (Wooclap, hors app)** : la réponse « VRAI » à « l'émargement peut se faire n'importe quand » contredit l'enseignement du Dossier 1 (15 premières minutes) — à clarifier pour éviter la confusion en amphi.

## Annexe C — Checklist de recette (extrait)

Parcours nominal complet sur chaque appareil cible · reprise après fermeture · double tap rapide sur les boutons (pas de double validation) · rotation d'écran en cours de question · saisie de prénoms avec émojis/caractères spéciaux · mode avion après chargement · réinitialisation et rejeu · vérification exhaustive du contenu affiché contre `content.json` · export PNG · page animateur · liens mailto/tel de l'annuaire · zoom navigateur 200 %.

---

*Fin du document — version 1.0 du 9 juillet 2026. Toute modification du périmètre après validation fera l'objet d'un avenant versionné dans le dépôt GitHub.*
