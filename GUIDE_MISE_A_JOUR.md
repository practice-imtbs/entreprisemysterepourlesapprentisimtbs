# 🔄 Guide de mise à jour annuelle

> Objectif : mettre à jour le jeu pour une nouvelle promotion **en moins d'une demi-journée**,
> sans toucher au code. Tout le contenu vit dans **`content/content.json`**.

## 1. Ce qu'il faut changer chaque année

Ouvrir `content/content.json` et modifier :

| Bloc | Quoi vérifier / changer |
|---|---|
| `meta.annee` | L'année scolaire affichée (ex. `"2027-2028"`) |
| `meta.codeFinal` + `meta.fragments` | **Nouveau code d'accès** à la finale. ⚠️ Les 3 fragments concaténés doivent reconstituer exactement le code (`"AL"+"T7"+"26"` = `"ALT726"`) |
| `calendrier.punaises` | Les 5 dates clés (contrat d'objectif, visites 28/02 et 30/08, délais SFP) |
| `annuaire.fiches` | Noms, rôles, emails, téléphones des interlocuteurs (⚠️ faire confirmer par écrit l'accord de publication) |
| `questions.*` | Énoncés, options, bonnes réponses, encarts « retenir » si les procédures évoluent |
| `feuillets.*` | Pages des dossiers Edusign / rencontre tuteur / visites |
| `dossiers[].alerte`, `debrief`, `transition`, `messagesQG` | Panneaux d'alerte et messages du QG |

## 2. Vérification automatique

Au chargement, l'application **valide le fichier** et affiche les erreurs dans la
console du navigateur (F12 → Console) :

- ✅ `content.json validé sans erreur.` → tout est bon.
- ⚠️ `content.json invalide — N erreur(s)` → chaque erreur est listée (réponse correcte
  absente des options, fragments ≠ code final, nombre de cases de débriefing ≠ 5, etc.).

## 3. Tester en local

```bash
python3 -m http.server 8000   # depuis la racine du dépôt
```

Ouvrir `http://localhost:8000`, jouer le Dossier 1 en entier, vérifier
`http://localhost:8000/animateur.html` (l'antisèche reflète automatiquement le JSON).

## 4. Publier

```bash
git add content/content.json
git commit -m "Contenu rentrée 20XX"
git push
```

GitHub Pages redéploie automatiquement (1–2 min).

⚠️ **Après publication**, penser à incrémenter la version du cache dans `sw.js`
(`const VERSION = 'em-v2';`) pour que les appareils ayant déjà visité le site
récupèrent le nouveau contenu, puis pousser également ce fichier.

## 5. Le jour J

- Antisèche animateur : `…/animateur.html` (imprimable) — contient le **code final**.
- Réinitialiser un appareil entre deux binômes : barre du bas → ⚙️ Options →
  « Réinitialiser la mission » (double confirmation).
- La finale Wooclap reste gérée dans Wooclap (hors application).
