import React from 'react';

export default function App() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      color: '#f5f1ea',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.6, marginBottom: '8px' }}>
          TEST DE DÉPLOIEMENT
        </p>
        <h1>Bonjour Myly 👋</h1>
        <p style={{ opacity: 0.7, marginTop: '8px' }}>
          Si tu vois ce message, la chaîne React + Vite + GitHub Actions fonctionne.
        </p>
      </div>
    </div>
  );
}
