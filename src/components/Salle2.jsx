import React, { useState, useRef, useEffect } from 'react';
import { mediasSalle2, repliqueOurs } from './salle2Data';

export default function Salle2({ onNextRoom }) {
  const [etape, setEtape] = useState(1);
  const audioTrkRef = useRef(null);
  const audioPianoRef = useRef(null);
  const videoRef = useRef(null);

  // Étape 1 : On joue l'audio de transition TRK dès que possible
  useEffect(() => {
    if (audioTrkRef.current) {
      // Le volume peut être ajusté si besoin
      audioTrkRef.current.volume = 0.5; 
      // Note : l'autoplay direct est parfois bloqué par le navigateur, 
      // il faudra peut-être que Myly clique sur l'écran pour que ça se lance.
      audioTrkRef.current.play().catch(e => console.log("Autoplay bloqué :", e));
    }
  }, []);

  const handleJouerPiano = () => {
    setEtape(2); // On passe à l'étape suivante
    
    // On arrête la musique de transition si elle joue encore
    if (audioTrkRef.current) {
      audioTrkRef.current.pause();
    }
    
    // On lance la musique Happy Birthday
    if (audioPianoRef.current) {
      audioPianoRef.current.play();
    }
  };

  // On passe à l'étape de la vidéo quand la musique de piano est terminée
  const handleMusiqueTerminee = () => {
    setEtape(3);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div>
      <h1>SALLE 2 — Melody</h1>

      {/* Lecteurs audio cachés */}
      <audio ref={audioTrkRef} src={mediasSalle2.audioTransition} />
      <audio 
        ref={audioPianoRef} 
        src={mediasSalle2.audioHappyBirthday} 
        onEnded={handleMusiqueTerminee} 
      />

      {/* Étape 1 : L'ours parle et propose de jouer */}
      {etape === 1 && (
        <div>
          <p><strong>L'ours atterrit sur le piano :</strong> {repliqueOurs}</p>
          <button onClick={handleJouerPiano}>
            🎹 Jouer une mélodie
          </button>
        </div>
      )}

      {/* Étape 2 : L'ours s'emballe sur la musique */}
      {etape === 2 && (
        <div>
          <p>🎶 <em>Happy Birthday en cours de lecture... L'ours s'emballe !</em> 🐻🎵</p>
        </div>
      )}

      {/* Étape 3 : La vidéo de l'envol */}
      {etape === 3 && (
        <div>
          <p>L'ours s'envole !</p>
          <video 
            ref={videoRef} 
            src={mediasSalle2.videoOursEnvol} 
            controls 
            width="100%" 
            style={{ maxWidth: '500px' }}
          />
          <br />
          <button onClick={onNextRoom} style={{ marginTop: '20px' }}>
            Passer à la suite (Salle 3)
          </button>
        </div>
      )}
    </div>
  );
      }
