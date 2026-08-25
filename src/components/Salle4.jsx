import React, { useState } from 'react';
import { mangueData } from './salle4Data';
import './Salle4.css'; // Assure-toi de créer ce fichier pour le style des rideaux

const Salle4 = ({ onNextRoom }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCurtainClosed, setIsCurtainClosed] = useState(false);
  
  const currentItem = mangueData[currentIndex];

  const handlePullCord = () => {
    // Si on est à la fin, on passe au jeu ou à la salle suivante
    if (currentIndex === mangueData.length - 1) {
      onNextRoom();
      return;
    }

    // 1. On ferme les rideaux
    setIsCurtainClosed(true);

    // 2. On attend 1 seconde pour l'animation, puis on change la recette et on rouvre
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsCurtainClosed(false);
    }, 1500); // 1.5 secondes d'attente
  };

  return (
    <div className="salle4-container">
      {/* L'ours en haut */}
      <div className="bear-dialogue">
        <p className="bear-speech">
          {currentItem.bearPrompt ? currentItem.bearPrompt : currentItem.bearReaction}
        </p>
      </div>

      {/* La zone principale avec les rideaux */}
      <div className="stage-area">
        {/* Les rideaux */}
        <div className={`curtain left-curtain ${isCurtainClosed ? 'closed' : 'open'}`}></div>
        <div className={`curtain right-curtain ${isCurtainClosed ? 'closed' : 'open'}`}></div>

        {/* Le contenu derrière les rideaux */}
        <div className="stage-content">
          <h2>{currentItem.title}</h2>
          
          {currentItem.type === "image" && (
            <img src={currentItem.media} alt={currentItem.title} className="recipe-media" />
          )}
          
          {currentItem.type === "video" && (
            <video src={currentItem.media} controls autoPlay className="recipe-media"></video>
          )}

          <p className="recipe-text">{currentItem.description}</p>
        </div>
      </div>

      {/* La réplique d'action de l'ours */}
      {currentItem.actionText && (
        <div className="bear-action">
          <p>{currentItem.actionText}</p>
        </div>
      )}

      {/* Le bouton "Corde" */}
      <button 
        className="pull-cord-btn" 
        onClick={handlePullCord}
        disabled={isCurtainClosed}
      >
        Tirer la corde 🪢
      </button>
    </div>
  );
};

export default Salle4;
