import React, { useState, useEffect } from 'react';
import { oursDialogues, cartesVoeux, messageFinal } from './salle6Data';

const Salle6 = () => {
  const [etape, setEtape] = useState(0);
  
  // On gère dynamiquement l'état des cartes en fonction de notre fichier de données
  const [cartesOuvertes, setCartesOuvertes] = useState(
    cartesVoeux.reduce((acc, carte) => ({ ...acc, [carte.id]: false }), {})
  );
  
  const [texteFinal, setTexteFinal] = useState('');

  useEffect(() => {
    if (etape === 3) {
      let i = 0;
      const interval = setInterval(() => {
        setTexteFinal(messageFinal.slice(0, i));
        i++;
        if (i > messageFinal.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [etape]);

  const toggleCarte = (id) => {
    setCartesOuvertes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="salle-6-container">
      
      {/* DIALOGUES DE L'OURS */}
      <div className="ours-dialogue">
        {etape === 0 && (
          <div>
            <p>{oursDialogues[0]}</p>
            <button onClick={() => setEtape(1)}>Suivant</button>
          </div>
        )}
        {etape === 1 && (
          <div>
            {/* Split permet de gérer les sauts de ligne proprement */}
            {oursDialogues[1].split('\n').map((paragraphe, index) => (
              <p key={index}>{paragraphe}</p>
            ))}
            <button onClick={() => setEtape(2)}>Voir les cartes</button>
          </div>
        )}
      </div>

      {/* CARTES DE VOEUX GÉNÉRÉES DYNAMIQUEMENT */}
      {etape >= 2 && (
        <div className="cartes-voeux">
          <h2>Clique sur les cartes pour lire les messages</h2>
          
          {cartesVoeux.map((carte) => (
            <div key={carte.id} className="carte" onClick={() => toggleCarte(carte.id)}>
              <h3>De {carte.expediteur}</h3>
              {cartesOuvertes[carte.id] && <p>{carte.message}</p>}
            </div>
          ))}

          {etape === 2 && <button onClick={() => setEtape(3)}>Dernière surprise</button>}
        </div>
      )}

      {/* MESSAGE FINAL */}
      {etape === 3 && (
        <div className="message-final-typewriter">
          {/* Pour respecter les sauts de ligne dans React */}
          <p style={{ whiteSpace: 'pre-line' }}>{texteFinal}</p>
        </div>
      )}

    </div>
  );
};

export default Salle6;
              
