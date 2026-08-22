/* ============================================
   SALLE1.JS — Le Mystère
   Une seule longue séquence orchestrée, découpée en
   phases claires. Chaque phase est une fonction async :
   on les enchaîne avec await pour garder un déroulé
   lisible de haut en bas, dans l'ordre exact du script.
   ============================================ */

import { CONTENT } from './js-content.js';
import { STATE, allerA } from './js-main.js';
import { createBear, createBearArmSilhouette } from './js-bear.js';

let ours = null;
let oursArrivee = false;

/**
 * Prépare les éléments de la salle 1 (appelé une seule fois au
 * chargement du site). Le vrai déroulé de la scène ne démarre
 * qu'au moment où la porte du couloir est franchie, via
 * demarrerSalle1().
 */
function initSalle1() {
  ours = createBear(document.getElementById('bearCameraLayer'));
  ours.setSilhouette(true);
  ours.wrapper.style.display = 'none';

  createBearArmSilhouette(document.getElementById('montageBras'));

  document.getElementById('boutonLampe').addEventListener('click', () => {
    // Le vrai comportement est géré par attendreTapOuAuto pendant la
    // phase de la veilleuse ; ce gestionnaire ne fait qu'exister pour
    // que le bouton reste "cliquable" visuellement en permanence.
  });
}

/* ---------- Utilitaires ---------- */

function pause(ms) {
  const duree = STATE.mode === 'observateur' ? ms * 0.6 : ms;
  return new Promise((resolve) => setTimeout(resolve, duree));
}

function attendreTapOuAuto(element, delaiAuto) {
  return new Promise((resolve) => {
    if (STATE.mode === 'observateur') {
      setTimeout(resolve, delaiAuto * 0.6);
      return;
    }
    function onTap() {
      element.removeEventListener('click', onTap);
      resolve();
    }
    element.addEventListener('click', onTap);
  });
}

function montrerReplique(texte) {
  const bulle = document.getElementById('dialogueSalle1');
  const p = document.getElementById('texteDialogueSalle1');
  p.textContent = texte;
  bulle.classList.add('is-visible');
}

function cacherReplique() {
  document.getElementById('dialogueSalle1').classList.remove('is-visible');
}

function animerTirage(lampeBtn) {
  lampeBtn.classList.add('tire');
  setTimeout(() => lampeBtn.classList.remove('tire'), 220);
}

function genererConfettis(conteneur, nombre) {
  const couleurs = ['#e8b262', '#e88fa0', '#f6e0c4', '#a8d4a8', '#f2c9dd', '#6fa8d8'];
  for (let i = 0; i < nombre; i++) {
    const morceau = document.createElement('div');
    morceau.className = 'confetti-piece';
    morceau.style.left = Math.random() * 100 + '%';
    morceau.style.background = couleurs[Math.floor(Math.random() * couleurs.length)];
    morceau.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
    morceau.style.animationDelay = (Math.random() * 0.5) + 's';
    conteneur.appendChild(morceau);
  }
}

function genererFeuillesCoeur(conteneur, nombre) {
  const couleurs = ['#e88fa0', '#f2b6c6', '#e8b262', '#f6d4de', '#d88fa8'];
  conteneur.innerHTML = '';
  for (let i = 0; i < nombre; i++) {
    const feuille = document.createElement('div');
    feuille.className = 'feuille-coeur';
    const angle = Math.random() * 360;
    const rayon = 20 + Math.random() * 90;
    const x = 110 + Math.cos((angle * Math.PI) / 180) * rayon;
    const y = 100 + Math.sin((angle * Math.PI) / 180) * rayon * 0.7;
    feuille.style.left = x + 'px';
    feuille.style.top = y + 'px';
    const couleur = couleurs[Math.floor(Math.random() * couleurs.length)];
    feuille.style.setProperty('--couleur-feuille', couleur);
    conteneur.appendChild(feuille);
  }
}

/* ---------- Séquence principale ---------- */

async function demarrerSalle1() {
  await phaseVeilleuse();
  await phaseExplosion();
  await phaseCiel();
  await phaseChute();
  await phaseArbre();
}

/* ---------- Phase 1 : la veilleuse ---------- */

async function phaseVeilleuse() {
  const lampeBtn = document.getElementById('boutonLampe');
  const halo = document.getElementById('haloLampe');
  const bras = document.getElementById('montageBras');

  montrerReplique(CONTENT.salle1.repliqueAccueil);

  // Tentative 1 : elle tire, rien ne se passe
  await attendreTapOuAuto(lampeBtn, 2200);
  animerTirage(lampeBtn);
  await pause(300);
  montrerReplique(CONTENT.salle1.repliqueRate1);
  await pause(1800);

  // Tentative 2 : elle tire encore, toujours rien
  await attendreTapOuAuto(lampeBtn, 2200);
  animerTirage(lampeBtn);
  await pause(300);
  montrerReplique(CONTENT.salle1.repliqueRate2);
  await pause(1600);

  // L'ours montre l'exemple : silhouette de bras qui entre dans le cadre
  bras.classList.add('entre');
  await pause(750);
  animerTirage(lampeBtn);
  halo.classList.add('est-allumee');
  lampeBtn.classList.add('est-allumee');
  await pause(550);
  halo.classList.remove('est-allumee');
  lampeBtn.classList.remove('est-allumee');
  bras.classList.remove('entre');
  montrerReplique(CONTENT.salle1.repliqueDemo);
  await pause(1800);

  // Tentative 3 : elle tire, ça fonctionne pour de bon
  await attendreTapOuAuto(lampeBtn, 2200);
  animerTirage(lampeBtn);
  halo.classList.add('est-allumee');
  lampeBtn.classList.add('est-allumee');
  montrerReplique(CONTENT.salle1.repliqueReussite);
  await pause(2400);

  // La veilleuse se met à scintiller anormalement
  halo.classList.add('scintille');
  montrerReplique(CONTENT.salle1.repliqueSurprise);
  await pause(1600);
  halo.classList.remove('scintille');
}

/* ---------- Phase 2 : l'explosion et l'envol ---------- */

async function phaseExplosion() {
  const flash = document.getElementById('explosionFlash');
  const monde = document.getElementById('salle1Monde');
  const camera = document.getElementById('bearCameraLayer');

  cacherReplique();
  flash.classList.add('flash-explosion');

  ours.wrapper.style.display = '';
  ours.setSilhouette(false);
  ours.setPose('vole');
  ours.setExpression('surpris');
  camera.style.transition = 'none';
  camera.style.transform = 'translate(-50%, 40dvh) scale(1)';
  camera.style.opacity = '1';

  await pause(150);
  montrerReplique(CONTENT.salle1.criEnvol);

  monde.classList.add('va-vite');
  monde.style.transform = 'translateY(0)';
  camera.style.transition = 'transform 0.7s cubic-bezier(0.6, 0, 0.9, 0.2), opacity 0.5s ease 0.3s';
  camera.style.transform = 'translate(-50%, -60dvh) scale(0.7)';
  camera.style.opacity = '0';

  await pause(750);
  monde.classList.remove('va-vite');
  cacherReplique();
  camera.style.display = 'none';
}

/* ---------- Phase 3 : au-dessus des nuages ---------- */

async function phaseCiel() {
  const confettisConteneur = document.getElementById('confettis');
  const texteAnniv = document.getElementById('texteAnniversaire');
  const gateau = document.getElementById('gateau');
  const bougie = document.getElementById('bougie');
  const texteVoeu = document.getElementById('texteVoeu');
  const boutonSouffler = document.getElementById('boutonSouffler');

  genererConfettis(confettisConteneur, 60);
  texteAnniv.classList.add('montre');

  await pause(500);
  gateau.classList.add('montre');
  await pause(700);
  texteVoeu.classList.add('montre');
  boutonSouffler.classList.add('montre');

  await attendreTapOuAuto(boutonSouffler, 2600);
  bougie.classList.add('est-soufflee');
  texteVoeu.classList.remove('montre');
  boutonSouffler.classList.remove('montre');

  await pause(500);
}

/* ---------- Phase 4 : la chute ---------- */

async function phaseChute() {
  const monde = document.getElementById('salle1Monde');
  const camera = document.getElementById('bearCameraLayer');
  const eclaboussure = document.getElementById('eclaboussureGateau');
  const ballon = document.getElementById('ballonVolant');
  const coeur = document.getElementById('coeurVolant');

  montrerReplique(CONTENT.salle1.criEnvol);

  ours.setPose('chute');
  ours.setExpression('surpris');
  camera.style.display = '';
  camera.style.transition = 'none';
  camera.style.transform = 'translate(-50%, -60dvh) scale(0.7)';
  camera.style.opacity = '1';

  await pause(150);

  // Chute rapide qui traverse la strate "gâteau/pièce"
  monde.classList.add('va-vite');
  monde.style.transform = 'translateY(-100dvh)';
  camera.style.transition = 'transform 0.65s cubic-bezier(0.5, 0, 1, 0.4)';
  camera.style.transform = 'translate(-50%, 15dvh) scale(1)';

  await pause(550);
  eclaboussure.classList.add('montre');
  setTimeout(() => eclaboussure.classList.remove('montre'), 700);
  cacherReplique();

  await pause(250);

  // Il attrape un ballon : la chute ralentit
  ballon.style.left = '58%';
  ballon.style.top = '20dvh';
  ballon.style.transition = 'opacity 0.3s ease';
  ballon.style.opacity = '1';
  ours.setPose('ballon');

  monde.classList.remove('va-vite');
  monde.style.transition = 'transform 1.6s ease';
  monde.style.transform = 'translateY(-160dvh)';
  camera.style.transition = 'transform 1.6s ease';
  camera.style.transform = 'translate(-50%, 55dvh) scale(1)';
  ballon.style.transition = 'transform 1.6s ease, opacity 0.3s ease';
  ballon.style.transform = 'translateY(35dvh)';

  // Le petit cœur tombe plus vite et le dépasse
  coeur.style.left = '46%';
  coeur.style.top = '10dvh';
  coeur.style.opacity = '1';
  coeur.style.transition = 'transform 1.1s cubic-bezier(0.5, 0, 1, 0.5), opacity 0.3s ease';
  await pause(50);
  coeur.style.transform = 'translateY(120dvh)';

  await pause(1700);
  coeur.style.opacity = '0';
}

/* ---------- Phase 5 : l'arbre au feuillage de cœur ---------- */

async function phaseArbre() {
  const monde = document.getElementById('salle1Monde');
  const camera = document.getElementById('bearCameraLayer');
  const arbre = document.getElementById('arbre');
  const feuillage = document.getElementById('arbreFeuillage');
  const messageFinal = document.getElementById('messageFinalArbre');
  const ballon = document.getElementById('ballonVolant');

  monde.style.transition = 'transform 1s ease';
  monde.style.transform = 'translateY(-200dvh)';
  await pause(900);

  arbre.classList.add('pousse');
  await pause(1000);
  genererFeuillesCoeur(feuillage, 26);

  await pause(600);
  messageFinal.textContent = CONTENT.salle1.messageArbre;
  messageFinal.classList.remove('hidden');

  await pause(2600);

  // L'ours (toujours accroché à son ballon) descend et se pose sur l'arbre
  camera.style.transition = 'transform 1.3s cubic-bezier(0.34, 1.1, 0.4, 1)';
  camera.style.transform = 'translate(-50%, -8dvh) scale(1)';
  ballon.style.transition = 'transform 1.3s ease';
  ballon.style.transform = 'translateY(-20dvh)';

  await pause(1300);
  ours.setPose('branche');
  ours.setExpression('content');
  await pause(500);
  ballon.style.opacity = '0';

  await pause(400);
  camera.style.transition = 'transform 0.5s ease-in';
  camera.style.transform = 'translate(-50%, 6dvh) scale(1)';
  ours.setPose('debout');

  await pause(600);
  montrerReplique(CONTENT.salle1.repliqueFinArbre);

  // Le bouton pour poursuivre vers la salle 2 (en préparation)
  const boutonSuite = document.getElementById('boutonSuiteSalle1');
  boutonSuite.classList.remove('hidden');
  await attendreTapOuAuto(boutonSuite, 2000);
  boutonSuite.classList.add('hidden');

  // La salle 2 sera branchée ici au fil de la suite du projet.
  console.log('Fin de la salle 1 \u2014 transition vers la salle 2 à venir.');
}

export { initSalle1, demarrerSalle1 };
