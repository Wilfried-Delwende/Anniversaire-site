import React from 'react';
import './Salle0.css';
import { salle0Data } from './salle0Data';

const Salle0 = () => {
  return (
    <div className="salle0-wrapper">
      <div className="salle0-container">
        {salle0Data.map((bloc) => (
          <div key={bloc.id} className="salle0-message">
            <p>{bloc.contenu}</p>
          </div>
        ))}
        <div className="salle0-porte-container">
          <button className="porte-salle-1">Ouvrir la porte</button>
        </div>
      </div>
    </div>
  );
};

export default Salle0;
