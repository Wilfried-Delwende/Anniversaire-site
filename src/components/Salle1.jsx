import React, { useState, useEffect } from 'react';

export default function Salle1({ onNextRoom }) {
  // On gère l'avancement de la scène avec un état "etape" (de 1 à 9)
  const [etape, setEtape] = useState(1);

  // Dictionnaire contenant toutes les répliques de l'ours
  const messagesOurs = {
    1: "Salut, s'il te plaît tire sur la ficelle pour allumer la lampe",
    2: "C'est pas comme ça que l'on tire. Tire plus fort",
    3: "Décidément il faut tout faire pour toi quoi",
    4: "Tu vois ? À toi maintenant",
    5: "Super ! Tu vois c'était facile .",
    6: "Huh ? Mais qu'est-ce qui se passe ? Attends je sors pour",
    7: "Aaaaah !",
    8: "", // À l'étape 8, c'est le message d'anniversaire qui prend le relais
    9: "Ma surprise te plaît ? Et bien ce n'est pas encore terminé ."
  };

  // Gestion des cinématiques automatiques avec useEffect
  useEffect(() => {
    // Étape 3 : L'ours râle, puis tire lui-même la ficelle après 2.5 secondes
    if (etape === 3) {
      const timer = setTimeout(() => setEtape(4), 2500);
      return () => clearTimeout(timer);
    }
    // Étape 5 : Le joueur a réussi, la lampe va commencer à clignoter
    if (etape === 5) {
      const timer = setTimeout(() => setEtape(6), 2500);
      return () => clearTimeout(timer);
    }
    // Étape 6 : L'ours s'inquiète, puis ça explose !
    if (etape === 6) {
      const timer = setTimeout(() => setEtape(7), 2500);
      return () => clearTimeout(timer);
    }
    // Étape 7 : L'ours crie en s'envolant, apparition de l'arbre
    if (etape === 7) {
      const timer = setTimeout(() => setEtape(8), 2000);
      return () => clearTimeout(timer);
    }
    // Étape 8 : L'arbre est là, puis l'ours retombe au bout de 4 secondes
    if (etape === 8) {
      const timer = setTimeout(() => setEtape(9), 4000);
      return () => clearTimeout(timer);
    }
  }, [etape]);

  // Fonction déclenchée quand Myly clique sur "Tirer la ficelle"
  const handleTirerFicelle = () => {
    if (etape === 1) setEtape(2); // 1er échec
    else if (etape === 2) setEtape(3); // 2ème échec
    else if (etape === 4) setEtape(5); // Réussite après que l'ours ait montré l'exemple
  };

  return (
    <div>
      <h1>SALLE 1 — Le Mystère</h1>

      {/* Zone de dialogue de l'ours */}
      <div>
        <p><strong>L'ours dit :</strong> {messagesOurs[etape]}</p>
      </div>

      {/* Zone interactive de la ficelle */}
      <div>
        {(etape === 1 || etape === 2 || etape === 4) && (
          <button onClick={handleTirerFicelle}>
            Tirer sur la ficelle
          </button>
        )}
      </div>

      {/* Zone visuelle dynamique (qui remplacera le CSS/les images plus tard) */}
      <div>
        {etape >= 4 && etape < 6 && <p>💡 La lampe est allumée normalement.</p>}
        {etape === 6 && <p>💡⚡ La lampe brille très fort et clignote !</p>}
        {etape === 7 && <p>💥 BOUM ! (Explosion)</p>}
        
        {etape >= 8 && (
          <div>
            <h2>🌳 Arbre au feuillage de cœur</h2>
            <p>
              Joyeux anniversaire Ma Myly 🥳🎉🎊<br />
              En ce jour spécial je te souhaite une excellente Santé, la joie et le bonheur durable, la prospérité, le Succès au Baccalauréat à venir , de réussir dans tous ce que tu entreprendras et que le Seigneur soit ton guide tout au long de ta vie 💫✨❤️
            </p>
          </div>
        )}
      </div>

      {/* Passage à la salle suivante */}
      {etape === 9 && (
        <button onClick={onNextRoom}>
          Passer à la suite (Salle 2)
        </button>
      )}
    </div>
  );
}
