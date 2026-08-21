/* ============================================
   SALLE0.JS — Entrée & Couloir
   ============================================ */

import { CONTENT } from './content.js';
import { STATE, allerA, marquerSiteTermine } from './main.js';
import { demarrerSalle1 } from './salle1.js';

function initSalle0() {
  initAccueil();
  initCouloir();
}

/* ---------- Écran d'accueil ---------- */

function initAccueil() {
  const scene = document.getElementById('scene-accueil');
  const dejaTermine = localStorage.getItem('museeMylySiteComplete') === 'true';
  const contenu = dejaTermine ? CONTENT.salle0.accueilRevisite : CONTENT.salle0.accueil;

  scene.querySelector('.accueil-eyebrow').textContent = contenu.eyebrow;
  scene.querySelector('.accueil-titre').textContent = contenu.titre;
  scene.querySelector('.accueil-desc').textContent = contenu.description;
  scene.querySelector('.accueil-bouton').textContent = contenu.bouton;

  scene.querySelector('.accueil-bouton').addEventListener('click', () => {
    allerA('scene-couloir');
  });

  // Bascule mode interactif / observateur, disponible à tout moment
  const toggle = document.getElementById('modeToggle');
  function rafraichirLibelleToggle() {
    toggle.textContent = STATE.mode === 'interactif'
      ? 'Mode\u00a0: interactif \u2014 toucher pour observer'
      : 'Mode\u00a0: observateur \u2014 toucher pour interagir';
  }
  rafraichirLibelleToggle();
  toggle.addEventListener('click', () => {
    STATE.mode = STATE.mode === 'interactif' ? 'observateur' : 'interactif';
    localStorage.setItem('museeMylyMode', STATE.mode);
    rafraichirLibelleToggle();
  });
}

/* ---------- Couloir ---------- */

function initCouloir() {
  const scroller = document.getElementById('couloirScroll');
  const compteur = document.getElementById('couloirCompteur');
  const hint = document.getElementById('couloirHint');

  // Construction des 5 stations d'indices
  CONTENT.salle0.indices.forEach((texteIndice, index) => {
    const station = document.createElement('div');
    station.className = 'couloir-station';

    const p = document.createElement('p');
    p.className = 'couloir-texte';
    p.textContent = texteIndice;

    station.appendChild(p);
    scroller.appendChild(station);
  });

  // Station finale : la porte
  const stationPorte = document.createElement('div');
  stationPorte.className = 'couloir-station couloir-porte-station';
  stationPorte.innerHTML = `
    <button type="button" class="porte" id="couloirPorte" aria-label="Ouvrir la porte"></button>
    <p class="porte-instruction">Touche la porte</p>
  `;
  scroller.appendChild(stationPorte);

  const totalStations = CONTENT.salle0.indices.length + 1;

  function mettreAJourCompteur() {
    const largeurStation = scroller.clientWidth;
    const indexActuel = Math.round(scroller.scrollLeft / largeurStation);
    const numeroAffiche = Math.min(indexActuel + 1, CONTENT.salle0.indices.length);
    compteur.textContent = numeroAffiche + ' / ' + CONTENT.salle0.indices.length;
    hint.classList.toggle('hidden', indexActuel >= totalStations - 1);
  }

  scroller.addEventListener('scroll', mettreAJourCompteur, { passive: true });
  mettreAJourCompteur();

  document.getElementById('couloirPorte').addEventListener('click', () => {
    const flash = document.getElementById('transitionFlash');
    flash.classList.add('is-flashing');
    setTimeout(() => {
      allerA('scene-salle1');
      flash.classList.remove('is-flashing');
      demarrerSalle1();
    }, 500);
  });
}

export { initSalle0 };
