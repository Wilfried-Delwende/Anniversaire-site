import React, { useState, useEffect } from 'react';
import { messagesOurs, messageAnniversaire } from './salle1Data';

export default function Salle1({ onNextRoom }) {
  const [etape, setEtape] = useState(1);

  useEffect(() => {
    if (etape === 3) {
      const timer = setTimeout(() => setEtape(4), 2500);
      return () => clearTimeout(timer);
    }
    if (etape === 5) {
      const timer = setTimeout(() => setEtape(6), 2500);
      return () => clearTimeout(timer);
    }
    if (etape === 6) {
      const timer = setTimeout(() => setEtape(7), 2500);
      return () => clearTimeout(timer);
    }
    if (etape === 7) {
      const timer = setTimeout(() => setEtape(8), 2000);
      return () => clearTimeout(timer);
    }
    if (etape === 8) {
      const timer = setTimeout(() => setEtape(9), 4000);
      return () => clearTimeout(timer);
    }
  }, [etape]);

  const handleTirerFicelle = () => {
    if (etape === 1) setEtape(2);
    else if (etape === 2) setEtape(3);
    else if (etape === 4) setEtape(5);
  };

  return (
    <div>
      <h1>SALLE 1 — Le Mystère</h1>

      <div>
        <p><strong>L'ours dit :</strong> {messagesOurs[etape] || ''}</p>
      </div>

      <div>
        {(etape === 1 || etape === 2 || etape === 4) && (
          <button onClick={handleTirerFicelle}>
            Tirer sur la ficelle
          </button>
        )}
      </div>

      <div>
        {etape >= 4 && etape < 6 && <p>💡 La lampe est allumée normalement.</p>}
        {etape === 6 && <p>💡⚡ La lampe brille très fort et clignote !</p>}
        {etape === 7 && <p>💥 BOUM ! (Explosion)</p>}
        
        {etape >= 8 && (
          <div>
            <h2>🌳 Arbre au feuillage de cœur</h2>
            <h3>{messageAnniversaire.titre}</h3>
            <p>{messageAnniversaire.texte}</p>
          </div>
        )}
      </div>

      {etape === 9 && (
        <button onClick={onNextRoom}>
          Passer à la suite (Salle 2)
        </button>
      )}
    </div>
  );
}
