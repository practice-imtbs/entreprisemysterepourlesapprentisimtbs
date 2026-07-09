# 🕵️ L'Entreprise Mystère

Serious game web de la **journée de rentrée des apprentis IMT-BS** (Career Center).
L'apprenti devient un agent secret intégrant « l'Académie de l'Alternance » et résout
**3 dossiers d'enquête** pour prouver qu'il connaît les règles du jeu de l'alternance
(Edusign, absences, contrat d'objectif, visites entreprise, SFP, recours…).

> 📄 Cahier des charges complet : [CDC.md](CDC.md) · Mise à jour annuelle : [GUIDE_MISE_A_JOUR.md](GUIDE_MISE_A_JOUR.md)

## ✨ Caractéristiques

- **Web app statique** — HTML/CSS/JavaScript vanilla (ES modules), **zéro dépendance**, zéro build.
- **Mobile-first** — conçue pour le jeu **en binôme sur smartphone** (dès 360 px).
- **Hors ligne** — service worker (PWA légère) : une coupure Wi-Fi en cours de partie ne perturbe pas le jeu.
- **Aucune donnée transmise** — prénoms et progression stockés uniquement en `localStorage` de l'appareil.
- **Reprise automatique** — fermer/rouvrir le navigateur restaure la partie à l'écran exact.
- **Contenu 100 % isolé** — tout le contenu pédagogique vit dans [`content/content.json`](content/content.json), jamais dans le code.
- **Mode animateur** — [`animateur.html`](animateur.html) (ou `?mode=animateur`) : antisèche complète + code final, imprimable.

## 🎮 Parcours

```
Accueil (binôme + programme) → Intro télex → HUB
  ├── 📅 Calendrier de l'agent (permanent)
  ├── 📞 Annuaire de l'agence (permanent)
  ├── 📁 Dossier 1 — Infiltration à l'académie   (post-it → 4 zones → alerte SFP → débriefing)
  ├── 📁 Dossier 2 — Opération terrain           (Nexus Corp → 4 personnages → alerte sanctions → débriefing)
  └── 📁 Dossier 3 — Le cas critique             (3 alertes → fragments de code → débriefing final)
        └── 🏆 Écran final : code d'accès + carte d'agent exportable (PNG)
              └── (hors app) Finale Wooclap en amphi
```

19 questions (QCM, Vrai/Faux, remise en ordre, appariement) · réponses illimitées sans pénalité ·
indice dès la 2ᵉ erreur · encart « 💬 Ce qu'il faut retenir » systématique.

## 🚀 Lancement local

Aucune installation. Un simple serveur statique (les modules ES l'exigent) :

```bash
cd entreprisemysterepourlesapprentisimtbs
python3 -m http.server 8000
# → http://localhost:8000
```

## 🌐 Déploiement (GitHub Pages)

Chaque push sur `main` est publié automatiquement :
**Settings → Pages → Source : Deploy from a branch → `main` / `(root)`**.

## 📁 Structure

```
├── index.html              # Point d'entrée unique (SPA)
├── animateur.html          # Antisèche animateur (non liée dans le jeu)
├── css/styles.css          # Charte espionnage + IMT-BS (variables CSS)
├── js/
│   ├── app.js              # Routage d'écrans, hub, overlays, orchestration
│   ├── state.js            # Progression + localStorage
│   ├── validate.js         # Validation du content.json au chargement
│   ├── export.js           # Carte d'agent PNG (canvas)
│   └── engine/             # qcm, vraifaux, ordre, matching, postit,
│                           # dossier-feuillete, alerte, debriefing, question
├── content/content.json    # ★ TOUT le contenu pédagogique
├── assets/img/             # Logo IMT-BS, icônes
├── sw.js                   # Service worker (hors ligne)
└── manifest.webmanifest    # PWA
```

## ♿ Accessibilité & RGPD

- Cibles tactiles ≥ 44 px, alternatives par taps aux glisser-déposer, navigation clavier, ARIA.
- Animations désactivées avec `prefers-reduced-motion`.
- Aucune collecte serveur, aucun cookie, aucun analytics — mention en pied de page.

---

IMT Business School — Career Center · Développé en interne (Julien Morice + Claude Code) · 2026
