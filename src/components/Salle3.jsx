import React, { useState } from 'react';
import { salle3Data } from '../data/salle3Data';
import BearGuide from './BearGuide'; // L'ours en SVG que nous avons créé

const Salle3 = ({ isObservationMode = false, onRoomComplete }) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [insideTheme, setInsideTheme] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  
  // États pour la mécanique d'énigme
  const [inputValue, setInputValue] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [bearMessage, setBearMessage] = useState(salle3Data.themes[0].intro);
  const [isTalking, setIsTalking] = useState(true);

  // État de fin de salle
  const [showNoseJoke, setShowNoseJoke] = useState(false);
  const [showAssassinJoke, setShowAssassinJoke] = useState(false);
  
  const currentTheme = salle3Data.themes[currentThemeIndex];
  const currentChar = currentTheme.characters[currentCharIndex];

  // Gestion de l'entrée dans un thème
  const handleEnterTheme = () => {
    setInsideTheme(true);
    setBearMessage(currentTheme.characters[0].enigme);
  };

  // Validation de la réponse
  const handleCheckAnswer = () => {
    const inputClean = inputValue.toLowerCase().trim();
    const isCorrect = currentChar.motsCles.some(mot => inputClean.includes(mot));
    
    let prefix = isCorrect ? "C'est exact ! " : "Je suis désolé, tu y étais presque... Mais la vérité c'est que : ";
    
    setBearMessage(prefix + currentChar.reponseOurs);
    setIsFlipped(true); // Retourne la carte
  };

  // Passage automatique en mode observation
  const handleObservationSkip = () => {
    setBearMessage("C'est exact ! " + currentChar.reponseOurs);
    setIsFlipped(true);
  };

  // Passage au personnage suivant ou thème suivant
  const handleNext = () => {
    setInputValue("");
    setIsFlipped(false);
    
    if (currentCharIndex < currentTheme.characters.length - 1) {
      setCurrentCharIndex(prev => prev + 1);
      setBearMessage(currentTheme.characters[currentCharIndex + 1].enigme);
    } else {
      // Fin du thème, retour au carrousel principal
      setInsideTheme(false);
      setCurrentCharIndex(0);
      
      if (currentThemeIndex < salle3Data.themes.length - 1) {
        setCurrentThemeIndex(prev => prev + 1);
        setBearMessage(salle3Data.themes[currentThemeIndex + 1].intro);
      } else {
        // Fin de toutes les énigmes, lancement de la phase blagues
        setShowNoseJoke(true);
        setBearMessage(salle3Data.transitionNez.replique1);
      }
    }
  };

  // Séquences de fin (Blagues)
  if (showAssassinJoke) {
    return (
      <div className="salle-container" style={styles.container}>
        <div style={styles.dialogBox}>
          <BearGuide isTalking={true} style={styles.bearPosition} />
          <p>{salle3Data.transitionAssassin.replique}</p>
        </div>
        <div style={styles.gallery}>
          {salle3Data.transitionAssassin.photos.map((photo, i) => (
            <div key={i} style={styles.photoCard}>
              <img src={photo.url} alt="Assassinat" style={styles.image} />
              <p style={{marginTop: '10px'}}>{photo.legende}</p>
            </div>
          ))}
        </div>
        <button onClick={onRoomComplete} style={styles.button}>Passer à la Salle 4</button>
      </div>
    );
  }

  if (showNoseJoke) {
    return (
      <div className="salle-container" style={styles.container}>
        <div style={styles.dialogBox}>
          <BearGuide isTalking={true} style={styles.bearPosition} />
          <p>{salle3Data.transitionNez.replique2}</p>
        </div>
        <div style={styles.gallery}>
          {salle3Data.transitionNez.photos.map((url, i) => (
            <img key={i} src={url} alt="Nez" style={styles.imageGallery} />
          ))}
        </div>
        <button onClick={() => { setShowNoseJoke(false); setShowAssassinJoke(true); }} style={styles.button}>
          Continuer
        </button>
      </div>
    );
  }

  return (
    <div className="salle-container" style={styles.container}>
      {/* Bulle de dialogue de l'Ours */}
      <div style={styles.dialogBox}>
        <BearGuide isTalking={isTalking} style={styles.bearPosition} />
        <p style={{margin: 0}}>{bearMessage}</p>
      </div>

      {!insideTheme ? (
        /* CARROUSEL PRINCIPAL DES THÈMES */
        <div className="theme-carousel" style={styles.card}>
          <img src={currentTheme.coverImage} alt={currentTheme.name} style={styles.image} />
          <h2>{currentTheme.name}</h2>
          <p>{currentTheme.coverDesc}</p>
          <button onClick={handleEnterTheme} style={styles.button}>Entrer dans ce thème</button>
        </div>
      ) : (
        /* CARROUSEL IMBRIQUÉ DES PERSONNAGES (ÉNIGMES) */
        <div className="character-carousel" style={styles.gameArea}>
          
          {/* Carte Flip */}
          <div style={{...styles.flipCard, transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}>
            <div style={styles.flipCardInner}>
              {/* Face Avant : Question */}
              <div style={styles.flipCardFront}>
                <h3>Énigme</h3>
                <p>{currentChar.enigme}</p>
              </div>
              
              {/* Face Arrière : Réponse (Image + Lore) */}
              <div style={styles.flipCardBack}>
                <img src={currentChar.image} alt="Personnage" style={styles.charImage} />
                <p style={{fontSize: '0.8rem', whiteSpace: 'pre-line'}}>{currentChar.desc}</p>
              </div>
            </div>
          </div>

          {/* Zone de contrôle selon le mode */}
          <div style={styles.controls}>
            {!isFlipped ? (
              isObservationMode ? (
                <button onClick={handleObservationSkip} style={styles.button}>Voir la réponse (Mode Observation)</button>
              ) : (
                <div style={{display: 'flex', gap: '10px'}}>
                  <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Tape ta réponse ici..." 
                    style={styles.input}
                  />
                  <button onClick={handleCheckAnswer} style={styles.button}>Valider</button>
                </div>
              )
            ) : (
              <button onClick={handleNext} style={styles.button}>Continuer</button>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
};

// Styles CSS en JS pour aller vite, tu pourras les basculer dans un fichier .css si tu préfères
const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minHeight: '100vh', backgroundColor: '#121212', color: 'white', fontFamily: 'sans-serif' },
  dialogBox: { position: 'relative', background: 'white', color: 'black', padding: '20px', borderRadius: '15px', maxWidth: '600px', margin: '40px 0 20px 0', border: '2px solid #ddd' },
  bearPosition: { position: 'absolute', top: '-42px', right: '20px' },
  card: { background: '#1e1e1e', padding: '20px', borderRadius: '15px', maxWidth: '500px', textAlign: 'center' },
  image: { width: '100%', borderRadius: '10px', maxHeight: '300px', objectFit: 'cover' },
  charImage: { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px' },
  button: { marginTop: '15px', padding: '10px 20px', background: '#e50914', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  gameArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px' },
  controls: { marginTop: '20px', width: '100%' },
  input: { padding: '10px', borderRadius: '8px', border: 'none', flexGrow: 1 },
  gallery: { display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginTop: '20px' },
  imageGallery: { width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' },
  photoCard: { background: '#222', padding: '10px', borderRadius: '10px', width: '200px', textAlign: 'center' },
  
  // Mécanique Flip Card basique
  flipCard: { backgroundColor: 'transparent', width: '300px', height: '450px', perspective: '1000px', transition: 'transform 0.8s', transformStyle: 'preserve-3d' },
  flipCardInner: { position: 'relative', width: '100%', height: '100%', textAlign: 'center', transition: 'transform 0.8s', transformStyle: 'preserve-3d' },
  flipCardFront: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: '#2c3e50', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', borderRadius: '15px', boxSizing: 'border-box' },
  flipCardBack: { position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: '#34495e', color: 'white', transform: 'rotateY(180deg)', borderRadius: '15px', padding: '15px', overflowY: 'auto', boxSizing: 'border-box' }
};

export default Salle3;
      
