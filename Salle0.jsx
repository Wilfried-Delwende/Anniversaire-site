import React, { useState, useRef, useEffect } from 'react';
import { CONTENT } from '../content.js';

export default function Salle0({ mode, onToggleMode, onEntrerSalle1 }) {
  const [sousScene, setSousScene] = useState('accueil'); // 'accueil' | 'couloir'

  return (
    <>
      {sousScene === 'accueil' && (
        <Accueil
          mode={mode}
          onToggleMode={onToggleMode}
          onFranchirLaPorte={() => setSousScene('couloir')}
        />
      )}
      {sousScene === 'couloir' && (
        <Couloir onOuvrirLaPorte={onEntrerSalle1} />
      )}
    </>
  );
}

function Accueil({ mode, onToggleMode, onFranchirLaPorte }) {
  const dejaTermine = localStorage.getItem('museeMylySiteComplete') === 'true';
  const contenu = dejaTermine ? CONTENT.salle0.accueilRevisite : CONTENT.salle0.accueil;

  const libelleMode = mode === 'interactif'
    ? 'Mode : interactif — toucher pour observer'
    : 'Mode : observateur — toucher pour interagir';

  return (
    <div className="scene-accueil">
      <button className="mode-toggle" type="button" onClick={onToggleMode}>
        {libelleMode}
      </button>
      <div className="accueil-card">
        <p className="accueil-eyebrow">{contenu.eyebrow}</p>
        <h1 className="accueil-titre">{contenu.titre}</h1>
        <p className="accueil-desc">{contenu.description}</p>
        <button className="accueil-bouton" type="button" onClick={onFranchirLaPorte}>
          {contenu.bouton}
        </button>
      </div>
    </div>
  );
}

function Couloir({ onOuvrirLaPorte }) {
  const scrollerRef = useRef(null);
  const [indexActuel, setIndexActuel] = useState(0);
  const [enFlash, setEnFlash] = useState(false);

  const totalStations = CONTENT.salle0.indices.length + 1; // + la porte

  function gererScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const largeurStation = scroller.clientWidth;
    const index = Math.round(scroller.scrollLeft / largeurStation);
    setIndexActuel(index);
  }

  function ouvrirLaPorte() {
    setEnFlash(true);
    setTimeout(() => {
      onOuvrirLaPorte();
    }, 500);
  }

  const surLaDerniereStation = indexActuel >= totalStations - 1;
  const numeroAffiche = Math.min(indexActuel + 1, CONTENT.salle0.indices.length);

  return (
    <div className="scene-couloir">
      <div className="couloir-scroll" ref={scrollerRef} onScroll={gererScroll}>
        {CONTENT.salle0.indices.map((texte, i) => (
          <div className="couloir-station" key={i}>
            <p className="couloir-texte">{texte}</p>
          </div>
        ))}

        <div className="couloir-station couloir-porte-station">
          <button
            type="button"
            className="porte"
            aria-label="Ouvrir la porte"
            onClick={ouvrirLaPorte}
          />
          <p className="porte-instruction">Touche la porte</p>
        </div>
      </div>

      <p className="couloir-compteur">{numeroAffiche} / {CONTENT.salle0.indices.length}</p>
      {!surLaDerniereStation && (
        <p className="couloir-hint">Glisse vers la gauche pour avancer</p>
      )}

      <div className={'transition-flash' + (enFlash ? ' is-flashing' : '')} />
    </div>
  );
}
