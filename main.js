/* ============================================
   MAIN.JS
   Chef d'orchestre du site : état global, navigation
   entre les "scènes" (écrans plein cadre), et point
   d'entrée qui initialise chaque salle.
   ============================================ */

import { initSalle0 } from './salle0.js';
import { initSalle1 } from './salle1.js';

const STATE = {
  mode: localStorage.getItem('museeMylyMode') || 'interactif',
  sceneActuelle: 'scene-accueil'
};

/**
 * Affiche la scène demandée (plein cadre) et masque toutes les autres.
 * Chaque salle reste présente dans le DOM en permanence : on bascule
 * juste la visibilité, ce qui permet des transitions instantanées et
 * évite de recharger quoi que ce soit.
 */
function allerA(idScene) {
  document.querySelectorAll('.scene').forEach((scene) => {
    scene.classList.toggle('is-active', scene.id === idScene);
  });
  STATE.sceneActuelle = idScene;
  window.scrollTo(0, 0);
}

/**
 * Marque le site comme entièrement terminé (appelée depuis la toute
 * dernière salle). À partir de là, l'écran d'accueil révèle son vrai
 * titre au lieu du message mystère.
 */
function marquerSiteTermine() {
  localStorage.setItem('museeMylySiteComplete', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
  initSalle0();
  initSalle1();
  allerA('scene-accueil');
});

export { STATE, allerA, marquerSiteTermine };
