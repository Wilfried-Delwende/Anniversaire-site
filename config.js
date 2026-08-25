/* ============================================
   CONFIGURATION — à remplir avant d'utiliser le studio
   ============================================
   Ce fichier n'est pas un secret à cacher : les clés ci-dessous
   sont conçues par Firebase et Cloudinary pour être visibles côté
   client (elles apparaîtront dans le code source de la page, et
   c'est normal). La vraie protection vient de deux choses :
     1. Les règles de sécurité Firestore (lecture/écriture réservées
        aux comptes connectés) — voir GUIDE-CONFIGURATION.md.
     2. Le "upload preset" Cloudinary configuré en mode restreint
        (formats autorisés + taille max) — voir GUIDE-CONFIGURATION.md.

   Suis le guide pas à pas dans GUIDE-CONFIGURATION.md pour savoir
   où trouver chacune de ces valeurs.
*/

export const firebaseConfig = {
  apiKey: "AIzaSyDsb6jLUi8We48e_GjXBGe5rRDQ9J0hXJM",
  authDomain: "anniversaire-site.firebaseapp.com",
  projectId: "anniversaire-site",
  storageBucket: "anniversaire-site.firebasestorage.app",
  messagingSenderId: "176274853119",
  appId: "1:176274853119:web:dc21194ae0246cc41b50ca"
};

export const cloudinaryConfig = {
  cloudName: "adpmubt3",
  uploadPreset: "anniversaire_medias"
};
