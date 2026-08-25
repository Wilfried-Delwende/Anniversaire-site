import React from 'react';

const BearGuide = ({ isTalking = false, className = "", style = {} }) => {
  return (
    <div 
      className={`bear-container ${className}`} 
      style={{ 
        width: '45px', 
        height: '45px', 
        display: 'inline-block', 
        position: 'relative',
        ...style 
      }}
    >
      <style>
        {`
          @keyframes bearBreathe {
            0%, 100% { transform: scaleY(1) translateY(0); }
            50% { transform: scaleY(0.96) translateY(2px); }
          }
          @keyframes bearTalk {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .bear-silhouette {
            /* L'animation change selon si l'ours parle ou non */
            animation: ${isTalking ? 'bearTalk 0.3s infinite ease-in-out' : 'bearBreathe 3s infinite ease-in-out'};
            transform-origin: bottom center;
          }
        `}
      </style>
      
      {/* SVG pur, aucun asset externe requis */}
      <svg
        className="bear-silhouette"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <g fill="#212121">
          {/* Oreille Gauche */}
          <circle cx="28" cy="25" r="11" />
          {/* Oreille Droite */}
          <circle cx="72" cy="25" r="11" />
          
          {/* Tête */}
          <circle cx="50" cy="40" r="23" />
          
          {/* Corps (forme poire/arrondie) */}
          <path d="M 30 52 C 18 80, 24 95, 50 95 C 76 95, 82 80, 70 52 Z" />
          
          {/* Bras Gauche */}
          <path d="M 30 58 C 18 68, 14 82, 24 88 C 29 88, 31 78, 34 68 Z" />
          
          {/* Bras Droit */}
          <path d="M 70 58 C 82 68, 86 82, 76 88 C 71 88, 69 78, 66 68 Z" />
        </g>
      </svg>
    </div>
  );
};

export default BearGuide;
            
