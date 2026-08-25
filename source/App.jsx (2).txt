import React, { useState } from 'react';
import Salle0 from './salles/Salle0.jsx';
import Salle1 from './salles/Salle1.jsx';

export default function App() {
  const [salleActuelle, setSalleActuelle] = useState(0);
  const [mode, setMode] = useState(
    localStorage.getItem('museeMylyMode') || 'interactif'
  );

  function basculerMode() {
    setMode((m) => {
      const nouveauMode = m === 'interactif' ? 'observateur' : 'interactif';
      localStorage.setItem('museeMylyMode', nouveauMode);
      return nouveauMode;
    });
  }

  function terminerSalle1() {
    // La salle 2 sera branchée ici au fil de la suite du projet.
    setSalleActuelle(2);
  }

  return (
    <>
      {salleActuelle === 0 && (
        <Salle0
          mode={mode}
          onToggleMode={basculerMode}
          onEntrerSalle1={() => setSalleActuelle(1)}
        />
      )}

      {salleActuelle === 1 && (
        <Salle1 mode={mode} onTerminer={terminerSalle1} />
      )}

      {salleActuelle === 2 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100dvh',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          textAlign: 'center',
          padding: '24px'
        }}>
          Salle 2 — Melody — à venir
        </div>
      )}
    </>
  );
}
