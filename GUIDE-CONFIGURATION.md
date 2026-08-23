# Guide de configuration — Studio

Le studio a besoin de deux services gratuits pour fonctionner :

- **Firebase** (Google) → connexion + sauvegarde de tous tes textes
- **Cloudinary** → stockage de tes photos, vidéos et audios

Aucun des deux ne demande de carte bancaire, si tu suis les étapes ci-dessous.
Tout se fait depuis ton téléphone, dans le navigateur (Chrome par exemple).
Compte à 15-20 minutes la première fois.

> **Pourquoi deux services et pas un seul ?**
> Firebase a changé ses règles début 2026 : sa partie "stockage de fichiers"
> (Cloud Storage) exige désormais une carte bancaire liée, même pour rester
> à 0 franc. Comme tu n'as pas besoin de ça, on garde Firebase uniquement
> pour la connexion et le texte (100% gratuit, sans carte), et on confie les
> fichiers à Cloudinary, qui reste gratuit sans carte pour ce volume-là
> (25 crédits/mois offerts, 1 crédit = 1 Go — largement assez pour 500 Mo).

---

## Partie 1 — Firebase (connexion + textes)

1. Va sur **console.firebase.google.com** et connecte-toi avec un compte Google.
2. Clique **Ajouter un projet**. Donne-lui un nom (ex : `anniversaire-site`).
   Si on te propose Google Analytics, tu peux le **désactiver** — inutile ici.
3. Une fois le projet créé, sur la page d'accueil du projet, clique l'icône
   **`</>`** (Web) pour enregistrer une application web.
4. Donne un surnom à l'appli (ex : `studio`). Tu n'as pas besoin de cocher
   "Configurer Firebase Hosting".
5. Firebase affiche un bloc de code avec un objet `firebaseConfig` qui
   ressemble à ça :
   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "anniversaire-site.firebaseapp.com",
     projectId: "anniversaire-site",
     storageBucket: "anniversaire-site.firebasestorage.app",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcd1234"
   };
   ```
   **Copie ces 6 valeurs** dans `config.js`, à la place de `"COLLE_ICI..."`.
6. Dans le menu de gauche : **Build → Authentication → Get started**.
7. Onglet **Sign-in method** → clique **Email/Password** → active-le → Enregistrer.
8. Onglet **Users** → **Add user** → renseigne un email et un mot de passe
   (n'importe lesquels, ils n'ont pas besoin d'exister vraiment — ce sera
   *tes* identifiants pour te connecter au studio).
9. Toujours dans le menu de gauche : **Build → Firestore Database → Create database**.
10. Choisis une région proche de toi (ex : `eur3` pour l'Europe), laisse le
    reste par défaut, clique **Suivant/Créer**.
11. Une fois la base créée, onglet **Règles (Rules)** en haut → remplace tout
    le contenu par :
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    ```
    Clique **Publier**. Cette règle dit : *seule une personne connectée (donc
    toi) peut lire ou écrire quoi que ce soit*.

Firebase est prêt.

---

## Partie 2 — Cloudinary (photos, vidéos, audio)

1. Va sur **cloudinary.com** → **Sign up** (tu peux t'inscrire avec Google,
   c'est le plus rapide). Aucune carte bancaire demandée.
2. Une fois connecté, le **Dashboard** affiche en haut un encart avec ton
   **Cloud name**. Copie-le dans `config.js` (`cloudName`).
3. Va dans **Settings** (icône roue crantée, en haut à droite) → onglet
   **Upload**.
4. Descends jusqu'à **Upload presets** → **Add upload preset**.
5. Règle le plus important : **Signing Mode → Unsigned**.
6. Conseillé (pas obligatoire) pour éviter les mauvaises surprises :
   - **Folder** : `anniversaire` (range tout au même endroit)
   - **Max file size** : `50000000` (50 Mo, un peu au-dessus de ta plus
     grosse vidéo à 32 Mo)
7. Enregistre. Le preset apparaît dans la liste avec un nom généré
   automatiquement (ex : `ml_default` ou un nom aléatoire) — copie ce nom
   exact dans `config.js` (`uploadPreset`).

Cloudinary est prêt.

---

## Partie 3 — `config.js` final

Une fois les deux parties faites, `config.js` doit ressembler à ceci
(avec *tes* vraies valeurs, pas ces exemples) :

```js
export const firebaseConfig = {
  apiKey: "AIzaSyD-exemple1234567890",
  authDomain: "anniversaire-site.firebaseapp.com",
  projectId: "anniversaire-site",
  storageBucket: "anniversaire-site.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6"
};

export const cloudinaryConfig = {
  cloudName: "dabcxyz12",
  uploadPreset: "anniversaire_unsigned"
};
```

Sauvegarde le fichier, envoie-le sur GitHub (comme les autres), et ouvre
`studio.html` dans ton navigateur. Connecte-toi avec l'email/mot de passe
créés à l'étape 8 de la Partie 1.

---

## Bon à savoir côté sécurité

Les clés dans `config.js` ne sont **pas des mots de passe secrets** — une
fois le site en ligne, n'importe qui pourrait techniquement les voir en
regardant le code source de la page. C'est normal et prévu par Firebase et
Cloudinary : ce ne sont que des "adresses" vers tes services.

- Côté **Firebase**, la vraie protection est la règle qu'on a mise à
  l'étape 11 : sans se connecter avec ton email/mot de passe, personne ne
  peut lire ni écrire tes textes.
- Côté **Cloudinary**, un preset "Unsigned" reste techniquement utilisable
  par quelqu'un qui tomberait sur son nom — c'est pour ça qu'on a limité la
  taille et le dossier à l'étape 6. Le risque réel est faible (il faudrait
  déjà savoir où chercher), mais garde ça en tête : c'est un compromis
  normal pour un outil sans serveur.

---

## Dépannage

- **"Connexion impossible"** → l'email/mot de passe ne correspond pas à
  l'utilisateur créé dans Firebase (Authentication → Users). Tu peux en
  créer un nouveau ou modifier le mot de passe existant depuis cet écran.
- **"Envoi impossible (code 400 ou 401)"** → vérifie qu'il n'y a pas de
  faute de frappe dans `cloudName` ou `uploadPreset`, et que le preset est
  bien en mode **Unsigned** (pas Signed).
- **Rien ne se passe après connexion** → ouvre les outils de développement
  du navigateur (souvent une icône ⋮ → Plus d'outils → Outils de
  développement) et regarde l'onglet Console pour le message d'erreur exact.
