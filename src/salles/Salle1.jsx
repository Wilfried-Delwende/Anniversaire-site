import React, { useState, useRef, useEffect } from 'react';
import { CONTENT } from '../content.js';
import Ours, { OursBrasSilhouette } from '../components/Ours.jsx';

const COULEURS_CONFETTIS = ['#e8b262', '#e88fa0', '#f6e0c4', '#a8d4a8', '#f2c9dd', '#6fa8d8'];
const COULEURS_FEUILLES = ['#e88fa0', '#f2b6c6', '#e8b262', '#f6d4de', '#d88fa8', '#c9587a'];

export default function Salle1({ mode, onTerminer }) {
  // ---------- Pièce / veilleuse ----------
  const [dialogue, setDialogue] = useState('');
  const [dialogueVisible, setDialogueVisible] = useState(false);
  const [lampeAllumee, setLampeAllumee] = useState(false);
  const [pieceEclairee, setPieceEclairee] = useState(false);
  const [scintille, setScintille] = useState(false);
  const [brasEntre, setBrasEntre] = useState(false);
  const [tirage, setTirage] = useState(false);

  // ---------- Caméra (ours) et monde (fond) ----------
  const [mondeTranslation, setMondeTranslation] = useState(-100); // en dvh
  const [mondeVaVite, setMondeVaVite] = useState(false);

  const [oursVisible, setOursVisible] = useState(false);
  const [oursSilhouette, setOursSilhouette] = useState(true);
  const [oursPose, setOursPose] = useState('assis');
  const [oursExpression, setOursExpression] = useState('neutre');
  const [oursStyle, setOursStyle] = useState({
    transition: 'none',
    transform: 'translate(-50%, 50dvh) scale(1)',
    opacity: 1
  });

  const [flashExplosion, setFlashExplosion] = useState(false);

  // ---------- Ciel ----------
  const [confettis, setConfettis] = useState([]);
  const [texteAnniversaireVisible, setTexteAnniversaireVisible] = useState(false);
  const [gateauVisible, setGateauVisible] = useState(false);
  const [bougieSoufflee, setBougieSoufflee] = useState(false);
  const [texteVoeuVisible, setTexteVoeuVisible] = useState(false);
  const [boutonSoufflerVisible, setBoutonSoufflerVisible] = useState(false);

  const [eclaboussureVisible, setEclaboussureVisible] = useState(false);
  const [ballonStyle, setBallonStyle] = useState({ opacity: 0 });
  const [coeurStyle, setCoeurStyle] = useState({ opacity: 0 });

  // ---------- Sol / arbre ----------
  const [arbrePousse, setArbrePousse] = useState(false);
  const [feuilles, setFeuilles] = useState([]);
  const [messageArbreVisible, setMessageArbreVisible] = useState(false);
  const [boutonSuiteVisible, setBoutonSuiteVisible] = useState(false);

  const demarreeRef = useRef(false);
  const resolveAttenteRef = useRef(null);

  useEffect(() => {
    if (demarreeRef.current) return;
    demarreeRef.current = true;
    demarrerSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Utilitaires de séquencement ---------- */

  function pause(ms) {
    const duree = mode === 'observateur' ? ms * 0.6 : ms;
    return new Promise((resolve) => setTimeout(resolve, duree));
  }

  function attendreInteraction(delaiAuto) {
    return new Promise((resolve) => {
      if (mode === 'observateur') {
        setTimeout(resolve, delaiAuto * 0.6);
        return;
      }
      resolveAttenteRef.current = resolve;
    });
  }

  function gererInteraction() {
    if (resolveAttenteRef.current) {
      const r = resolveAttenteRef.current;
      resolveAttenteRef.current = null;
      r();
    }
  }

  function animerTirage() {
    setTirage(true);
    setTimeout(() => setTirage(false), 220);
  }

  function genererConfettis(nombre) {
    const pieces = [];
    for (let i = 0; i < nombre; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100 + '%',
        background: COULEURS_CONFETTIS[Math.floor(Math.random() * COULEURS_CONFETTIS.length)],
        animationDuration: (1.8 + Math.random() * 1.4) + 's',
        animationDelay: (Math.random() * 0.5) + 's'
      });
    }
    setConfettis(pieces);
  }

  /**
   * Teste si un point (px, py) se trouve à l'intérieur du triangle formé
   * par les 3 points fournis. Méthode des signes, simple à vérifier.
   */
  function pointDansTriangle(px, py, ax, ay, bx, by, cx, cy) {
    function signe(x1, y1, x2, y2, x3, y3) {
      return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
    }
    const d1 = signe(px, py, ax, ay, bx, by);
    const d2 = signe(px, py, bx, by, cx, cy);
    const d3 = signe(px, py, cx, cy, ax, ay);
    const aUnNegatif = d1 < 0 || d2 < 0 || d3 < 0;
    const aUnPositif = d1 > 0 || d2 > 0 || d3 > 0;
    return !(aUnNegatif && aUnPositif);
  }

  /**
   * Feuillage en forme de cœur : deux cercles (lobes) + un triangle
   * (pointe). Rejet des points hors-forme. Mêmes valeurs que la version
   * validée précédemment (r=60, 150 feuilles).
   */
  function genererFeuilles(nombre) {
    const centreX = 110;
    const centreY = 95;
    const r = 60;

    const lobeGaucheX = centreX - r * 0.5;
    const lobeDroitX = centreX + r * 0.5;
    const lobeY = centreY - r * 0.15;
    const rayonLobe = r * 0.62;

    const triangleBaseY = centreY + r * 0.05;
    const triangleGaucheX = centreX - r * 0.98;
    const triangleDroiteX = centreX + r * 0.98;
    const trianglePointeY = centreY + r * 1.05;

    const resultat = [];
    let tentatives = 0;
    const tentativesMax = nombre * 40;

    while (resultat.length < nombre && tentatives < tentativesMax) {
      tentatives++;
      const x = centreX + (Math.random() * 2 - 1) * r * 1.05;
      const y = centreY + (Math.random() * 2 - 1) * r * 1.15;

      const dansLobeGauche = Math.hypot(x - lobeGaucheX, y - lobeY) <= rayonLobe;
      const dansLobeDroit = Math.hypot(x - lobeDroitX, y - lobeY) <= rayonLobe;
      const dansTriangle = pointDansTriangle(
        x, y,
        triangleGaucheX, triangleBaseY,
        triangleDroiteX, triangleBaseY,
        centreX, trianglePointeY
      );

      if (!dansLobeGauche && !dansLobeDroit && !dansTriangle) continue;

      resultat.push({
        id: resultat.length,
        left: x,
        top: y,
        scale: (0.7 + Math.random() * 0.7).toFixed(2),
        couleur: COULEURS_FEUILLES[Math.floor(Math.random() * COULEURS_FEUILLES.length)]
      });
    }
    return resultat;
  }

  /* ---------- Séquence principale ---------- */

  async function demarrerSequence() {
    await phaseVeilleuse();
    await phaseExplosion();
    await phaseCiel();
    await phaseChute();
    await phaseArbre();
  }

  async function phaseVeilleuse() {
    setDialogue(CONTENT.salle1.repliqueAccueil);
    setDialogueVisible(true);

    // Tentative 1 : échec
    await attendreInteraction(2200);
    animerTirage();
    await pause(300);
    setDialogue(CONTENT.salle1.repliqueRate1);
    await pause(1800);

    // Tentative 2 : échec
    await attendreInteraction(2200);
    animerTirage();
    await pause(300);
    setDialogue(CONTENT.salle1.repliqueRate2);
    await pause(1600);

    // L'ours montre l'exemple avec la silhouette de son bras
    setBrasEntre(true);
    await pause(750);
    animerTirage();
    setPieceEclairee(false);
    setLampeAllumee(true);
    await pause(550);
    setLampeAllumee(false);
    setBrasEntre(false);
    setDialogue(CONTENT.salle1.repliqueDemo);
    await pause(1800);

    // Tentative 3 : réussite, la lumière reste allumée pour de bon
    await attendreInteraction(2200);
    animerTirage();
    setLampeAllumee(true);
    setPieceEclairee(true);
    setDialogue(CONTENT.salle1.repliqueReussite);
    await pause(2400);

    // La veilleuse scintille anormalement
    setScintille(true);
    setDialogue(CONTENT.salle1.repliqueSurprise);
    await pause(1600);
    setScintille(false);
  }

  async function phaseExplosion() {
    setDialogueVisible(false);
    setFlashExplosion(true);

    setOursVisible(true);
    setOursSilhouette(false);
    setOursPose('vole');
    setOursExpression('surpris');
    setOursStyle({ transition: 'none', transform: 'translate(-50%, 40dvh) scale(1.1)', opacity: 1 });

    await pause(120);
    setDialogue(CONTENT.salle1.criEnvol);
    setDialogueVisible(true);

    // Petit écrasement avant le décollage
    setOursStyle({ transition: 'transform 0.12s ease-in', transform: 'translate(-50%, 46dvh) scale(1.25, 0.8)', opacity: 1 });
    await pause(120);

    setMondeVaVite(true);
    setMondeTranslation(0); // montre le ciel

    // Décollage : trajectoire longue et rapide
    setOursStyle({
      transition: 'transform 0.85s cubic-bezier(0.5, 0, 0.75, 0.15), opacity 0.4s ease 0.5s',
      transform: 'translate(-50%, -160dvh) scale(0.25)',
      opacity: 0
    });

    await pause(850);
    setMondeVaVite(false);
    setDialogueVisible(false);
    setOursVisible(false);
  }

  async function phaseCiel() {
    genererConfettis(60);
    setTexteAnniversaireVisible(true);

    await pause(500);
    setGateauVisible(true);
    await pause(700);
    setTexteVoeuVisible(true);
    setBoutonSoufflerVisible(true);

    await attendreInteraction(2600);
    setBougieSoufflee(true);
    setTexteVoeuVisible(false);
    setBoutonSoufflerVisible(false);

    await pause(500);
  }

  async function phaseChute() {
    setDialogue(CONTENT.salle1.criEnvol);
    setDialogueVisible(true);

    setOursPose('chute');
    setOursExpression('surpris');
    setOursVisible(true);
    setOursStyle({ transition: 'none', transform: 'translate(-50%, -150dvh) scale(0.3)', opacity: 1 });

    await pause(150);

    // Chute rapide qui traverse la strate "gâteau/pièce"
    setMondeVaVite(true);
    setMondeTranslation(-100); // montre la pièce
    setOursStyle({
      transition: 'transform 0.7s cubic-bezier(0.5, 0, 1, 0.4)',
      transform: 'translate(-50%, 15dvh) scale(1)',
      opacity: 1
    });

    await pause(700);
    setEclaboussureVisible(true);
    setTimeout(() => setEclaboussureVisible(false), 700);
    setDialogueVisible(false);

    await pause(250);

    // Il attrape un ballon : la chute ralentit
    setBallonStyle({
      left: '58%', top: '20dvh', opacity: 1,
      transition: 'transform 1.6s ease, opacity 0.3s ease',
      transform: 'translateY(0dvh)'
    });
    setOursPose('ballon');

    setMondeVaVite(false);
    setMondeTranslation(-160);
    setOursStyle({
      transition: 'transform 1.6s ease',
      transform: 'translate(-50%, 55dvh) scale(1)',
      opacity: 1
    });

    setTimeout(() => {
      setBallonStyle((s) => ({ ...s, transform: 'translateY(35dvh)' }));
    }, 20);

    // Le petit cœur tombe plus vite et le dépasse
    setCoeurStyle({
      left: '46%', top: '10dvh', opacity: 1,
      transition: 'transform 1.1s cubic-bezier(0.5, 0, 1, 0.5), opacity 0.3s ease',
      transform: 'translateY(0dvh)'
    });
    await pause(50);
    setCoeurStyle((s) => ({ ...s, transform: 'translateY(120dvh)' }));

    await pause(1700);
    setCoeurStyle((s) => ({ ...s, opacity: 0 }));
  }

  async function phaseArbre() {
    setMondeTranslation(-200); // montre le sol
    await pause(900);

    setArbrePousse(true);
    await pause(1000);
    setFeuilles(genererFeuilles(150));

    await pause(600);
    setMessageArbreVisible(true);

    await pause(2600);

    // L'ours (toujours accroché à son ballon) descend se poser SUR l'arbre
    setOursStyle({
      transition: 'transform 1.3s cubic-bezier(0.34, 1.1, 0.4, 1)',
      transform: 'translate(-50%, 36dvh) scale(1)',
      opacity: 1
    });
    setBallonStyle((s) => ({ ...s, transition: 'transform 1.3s ease', transform: 'translateY(-20dvh)' }));

    await pause(1300);
    setOursPose('branche');
    setOursExpression('content');
    await pause(500);
    setBallonStyle((s) => ({ ...s, opacity: 0 }));

    await pause(400);
    setOursStyle({
      transition: 'transform 0.6s ease-in',
      transform: 'translate(-50%, 68dvh) scale(1)',
      opacity: 1
    });
    setOursPose('debout');

    await pause(600);
    setDialogue(CONTENT.salle1.repliqueFinArbre);
    setDialogueVisible(true);

    setBoutonSuiteVisible(true);
    await attendreInteraction(2000);
    setBoutonSuiteVisible(false);

    onTerminer();
  }

  /* ---------- Rendu ---------- */

  const classeMonde = 'salle1-monde' + (mondeVaVite ? ' va-vite' : '');
  const styleMonde = { transform: 'translateY(' + mondeTranslation + 'dvh)' };
  const classeHalo = 'halo-lampe' + (lampeAllumee ? ' est-allumee' : '') + (scintille ? ' scintille' : '');
  const classeLampe = 'lampe' + (lampeAllumee ? ' est-allumee' : '') + (tirage ? ' tire' : '');
  const classeCouchePiece = 'salle1-couche salle1-couche--piece' + (pieceEclairee ? ' est-eclairee' : '');

  return (
    <div className="scene-salle1">
      <div className={classeMonde} style={styleMonde}>

        {/* Strate haute : le ciel */}
        <div className="salle1-couche salle1-couche--ciel">
          <div className="nuages" />
          <div className="confettis">
            {confettis.map((c) => (
              <div
                key={c.id}
                className="confetti-piece"
                style={{
                  left: c.left,
                  background: c.background,
                  animationDuration: c.animationDuration,
                  animationDelay: c.animationDelay
                }}
              />
            ))}
          </div>

          <p className={'texte-anniversaire' + (texteAnniversaireVisible ? ' montre' : '')}>
            Joyeux Anniversaire 🎉
          </p>

          <div className={'gateau' + (gateauVisible ? ' montre' : '')}>
            <div className={'bougie' + (bougieSoufflee ? ' est-soufflee' : '')}>
              <span className="bougie-flamme" />
              18
            </div>
            <div className="gateau-etage gateau-etage--3" />
            <div className="gateau-etage gateau-etage--2" />
            <div className="gateau-etage gateau-etage--1" />
          </div>

          <p className={'texte-voeu' + (texteVoeuVisible ? ' montre' : '')}>Souffle et fais un vœu</p>
          {boutonSoufflerVisible && (
            <button className="bouton-souffler montre" type="button" onClick={gererInteraction}>
              Souffle la bougie 💨
            </button>
          )}

          <div className="ballon-volant" style={ballonStyle} />
          <div className="coeur-volant" style={coeurStyle} />
        </div>

        {/* Strate du milieu : la pièce */}
        <div className={classeCouchePiece}>
          <div className={classeHalo} />
          <button
            type="button"
            className={classeLampe}
            aria-label="Tirer sur la ficelle de la veilleuse"
            onClick={gererInteraction}
          >
            <span className="lampe-globe" />
            <span className="lampe-fil" />
            <span className="lampe-poignee" />
          </button>
          <div className={'montage-bras' + (brasEntre ? ' entre' : '')}>
            <OursBrasSilhouette />
          </div>
          <div className={'eclaboussure-gateau' + (eclaboussureVisible ? ' montre' : '')} />
        </div>

        {/* Strate basse : le sol et l'arbre */}
        <div className="salle1-couche salle1-couche--sol">
          {messageArbreVisible && (
            <p className="message-final">{CONTENT.salle1.messageArbre}</p>
          )}
          <div className={'arbre' + (arbrePousse ? ' pousse' : '')}>
            <div className="arbre-feuillage">
              {feuilles.map((f) => (
                <div
                  key={f.id}
                  className="feuille-coeur"
                  style={{
                    left: f.left + 'px',
                    top: f.top + 'px',
                    transform: 'scale(' + f.scale + ')',
                    '--couleur-feuille': f.couleur
                  }}
                />
              ))}
            </div>
            <div className="arbre-tronc" />
          </div>
        </div>

      </div>

      {/* Couche caméra fixe : l'ours s'y déplace indépendamment du fond */}
      {oursVisible && (
        <div id="bearCameraLayer" style={oursStyle}>
          <Ours pose={oursPose} expression={oursExpression} silhouette={oursSilhouette} />
        </div>
      )}

      <div className={'bear-dialogue' + (dialogueVisible ? ' is-visible' : '')}>
        <p>{dialogue}</p>
      </div>

      {boutonSuiteVisible && (
        <button className="bouton-suite-salle1" type="button" onClick={gererInteraction}>
          Continuer
        </button>
      )}

      <div className={'explosion-flash' + (flashExplosion ? ' flash-explosion' : '')} />
    </div>
  );
}
