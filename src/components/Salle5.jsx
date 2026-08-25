import React, { useState } from 'react';
import { salle5Data } from '../data/salle5Data';

function Salle5({ onNextRoom }) {
  const [etape, setEtape] = useState('intro'); // 'intro', 'livre', ou 'outro'
  const [currentPage, setCurrentPage] = useState(0);

  const page = salle5Data.pages[currentPage];

  const handleNextPage = () => {
    if (currentPage < salle5Data.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setEtape('outro');
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="salle5-container">
      <h2>{salle5Data.titre}</h2>

      {etape === 'intro' && (
        <div className="intro-section">
          <div className="ours-reaction">
            <strong>L'ours dit :</strong> "{salle5Data.introOurs}"
          </div>
          <button onClick={() => setEtape('livre')}>Ouvrir le livre</button>
        </div>
      )}

      {etape === 'livre' && (
        <div className="book-layout">
          <div className="media-section">
            {page.typeMedia === 'photo' ? (
              <img src={page.urlMedia} alt={`Souvenir page ${page.id}`} className="media-content" />
            ) : (
              <video src={page.urlMedia} controls className="media-content" />
            )}
          </div>
          
          <div className="text-section">
            {/* On gère les sauts de ligne pour les longs textes comme la page 26 */}
            <p style={{ whiteSpace: 'pre-wrap' }}>{page.description}</p>
            
            {page.repliqueOurs && (
              <div className="ours-reaction">
                <strong>L'ours dit :</strong> "{page.repliqueOurs}"
              </div>
            )}
          </div>

          <div className="navigation-buttons">
            <button onClick={handlePrevPage} disabled={currentPage === 0}>Page précédente</button>
            <span className="page-counter">Page {currentPage + 1} / {salle5Data.pages.length}</span>
            <button onClick={handleNextPage}>
              {currentPage === salle5Data.pages.length - 1 ? "Fermer le livre" : "Page suivante"}
            </button>
          </div>
        </div>
      )}

      {etape === 'outro' && (
        <div className="outro-section">
          <div className="ours-reaction">
            <strong>L'ours pleure et dit :</strong> "{salle5Data.outroOurs}"
          </div>
          <button onClick={onNextRoom} className="final-button">Continuer vers la Révélation</button>
        </div>
      )}
    </div>
  );
}

export default Salle5;
      
