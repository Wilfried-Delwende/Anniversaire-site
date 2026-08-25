import React from 'react';

/**
 * L'ours, personnage guide de tout le site.
 *
 * Props :
 *  - pose : 'assis' | 'vole' | 'chute' | 'ballon' | 'branche' | 'debout'
 *  - expression : 'neutre' | 'content' | 'surpris' | 'triste' | 'mort-de-rire'
 *  - silhouette : bool — true = uniquement une forme noire (avant révélation)
 *  - style : objet de style CSS pour positionner/transformer le conteneur
 *            (c'est la salle qui appelante qui décide où il apparaît)
 */
export default function Ours({
  pose = 'assis',
  expression = 'neutre',
  silhouette = false,
  style = {}
}) {
  const classesSvg = [
    'bear',
    'bear--pose-' + pose,
    'bear--expr-' + expression,
    silhouette ? 'bear--silhouette' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="bear-wrapper" style={style}>
      <svg className={classesSvg} viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g className="bear__shadow">
          <ellipse cx="100" cy="228" rx="46" ry="8" />
        </g>

        <g className="bear__leg bear__leg--left">
          <ellipse cx="78" cy="205" rx="20" ry="16" />
        </g>
        <g className="bear__leg bear__leg--right">
          <ellipse cx="122" cy="205" rx="20" ry="16" />
        </g>

        <g className="bear__body">
          <ellipse cx="100" cy="160" rx="54" ry="58" />
          <ellipse className="bear__belly" cx="100" cy="172" rx="32" ry="34" />
        </g>

        <g className="bear__arm bear__arm--left">
          <ellipse cx="0" cy="0" rx="14" ry="30" />
          <circle className="bear__patte" cx="0" cy="27" r="12" />
        </g>
        <g className="bear__arm bear__arm--right">
          <ellipse cx="0" cy="0" rx="14" ry="30" />
          <circle className="bear__patte" cx="0" cy="27" r="12" />
        </g>

        <g className="bear__head">
          <circle className="bear__ear bear__ear--left" cx="56" cy="30" r="23" />
          <circle className="bear__ear bear__ear--right" cx="144" cy="30" r="23" />
          <circle className="bear__ear-inner bear__ear-inner--left" cx="56" cy="31" r="11" />
          <circle className="bear__ear-inner bear__ear-inner--right" cx="144" cy="31" r="11" />

          <circle className="bear__face" cx="100" cy="72" r="50" />

          <ellipse className="bear__snout" cx="100" cy="88" rx="27" ry="21" />
          <ellipse className="bear__nose" cx="100" cy="79" rx="10" ry="7" />

          <g className="bear__eye bear__eye--left">
            <circle className="bear__eye-white" cx="79" cy="63" r="8" />
            <circle className="bear__eye-pupil" cx="79" cy="63" r="4.2" />
          </g>
          <g className="bear__eye bear__eye--right">
            <circle className="bear__eye-white" cx="121" cy="63" r="8" />
            <circle className="bear__eye-pupil" cx="121" cy="63" r="4.2" />
          </g>

          <path className="bear__mouth bear__mouth--neutre" d="M 88 96 Q 100 104 112 96" fill="none" strokeLinecap="round" />
          <path className="bear__mouth bear__mouth--content" d="M 82 94 Q 100 112 118 94" fill="none" strokeLinecap="round" />
          <path className="bear__mouth bear__mouth--surpris" d="M 100 92 m -8 0 a 8 9 0 1 0 16 0 a 8 9 0 1 0 -16 0" strokeLinecap="round" />
          <path className="bear__mouth bear__mouth--triste" d="M 88 100 Q 100 90 112 100" fill="none" strokeLinecap="round" />
          <path className="bear__mouth bear__mouth--mort-de-rire" d="M 80 92 Q 100 118 120 92 Q 100 108 80 92 Z" strokeLinecap="round" />

          <ellipse className="bear__blush bear__blush--left" cx="68" cy="82" rx="8" ry="5" />
          <ellipse className="bear__blush bear__blush--right" cx="132" cy="82" rx="8" ry="5" />

          <g className="bear__tear bear__tear--left">
            <path d="M 70 90 Q 66 100 70 108 Q 74 100 70 90 Z" />
          </g>
          <g className="bear__tear bear__tear--right">
            <path d="M 130 90 Q 126 100 130 108 Q 134 100 130 90 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * Silhouette de bras isolée, utilisée uniquement pendant la scène de la
 * veilleuse (avant que l'ours ne soit révélé en entier).
 */
export function OursBrasSilhouette({ style = {} }) {
  return (
    <div className="bear-arm-silhouette-wrapper" style={style}>
      <svg className="bear-arm-silhouette" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g className="bear-arm-silhouette__group">
          <ellipse cx="40" cy="100" rx="46" ry="26" />
          <ellipse className="bear-arm-silhouette__paw" cx="118" cy="108" rx="24" ry="20" />
        </g>
      </svg>
    </div>
  );
}
