/* ============================================
   BEAR.JS
   Le personnage guide de tout le site : un ours 2D
   simple, construit en SVG à partir de formes rondes
   (comme une mascotte illustrée). Pas de sprite ni
   d'image fournie : tout est dessiné en code, posable
   et animable via CSS/GSAP.

   Utilisation :
     const bear = createBear(document.getElementById('bearMount'));
     bear.setPose('vole');
     bear.setExpression('surpris');
     bear.el // l'élément DOM racine, à animer avec GSAP
   ============================================ */

const BEAR_SVG_MARKUP = `
<svg class="bear" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="bear__shadow">
    <ellipse cx="100" cy="228" rx="46" ry="8"></ellipse>
  </g>

  <g class="bear__leg bear__leg--left">
    <ellipse cx="78" cy="205" rx="20" ry="16"></ellipse>
  </g>
  <g class="bear__leg bear__leg--right">
    <ellipse cx="122" cy="205" rx="20" ry="16"></ellipse>
  </g>

  <g class="bear__body">
    <ellipse cx="100" cy="160" rx="54" ry="58"></ellipse>
    <ellipse class="bear__belly" cx="100" cy="172" rx="32" ry="34"></ellipse>
  </g>

  <g class="bear__arm bear__arm--left">
    <ellipse cx="0" cy="0" rx="14" ry="30"></ellipse>
    <circle class="bear__patte" cx="0" cy="27" r="12"></circle>
  </g>
  <g class="bear__arm bear__arm--right">
    <ellipse cx="0" cy="0" rx="14" ry="30"></ellipse>
    <circle class="bear__patte" cx="0" cy="27" r="12"></circle>
  </g>

  <g class="bear__head">
    <circle class="bear__ear bear__ear--left" cx="56" cy="30" r="23"></circle>
    <circle class="bear__ear bear__ear--right" cx="144" cy="30" r="23"></circle>
    <circle class="bear__ear-inner bear__ear-inner--left" cx="56" cy="31" r="11"></circle>
    <circle class="bear__ear-inner bear__ear-inner--right" cx="144" cy="31" r="11"></circle>

    <circle class="bear__face" cx="100" cy="72" r="50"></circle>

    <ellipse class="bear__snout" cx="100" cy="88" rx="27" ry="21"></ellipse>
    <ellipse class="bear__nose" cx="100" cy="79" rx="10" ry="7"></ellipse>

    <g class="bear__eye bear__eye--left">
      <circle class="bear__eye-white" cx="79" cy="63" r="8"></circle>
      <circle class="bear__eye-pupil" cx="79" cy="63" r="4.2"></circle>
    </g>
    <g class="bear__eye bear__eye--right">
      <circle class="bear__eye-white" cx="121" cy="63" r="8"></circle>
      <circle class="bear__eye-pupil" cx="121" cy="63" r="4.2"></circle>
    </g>

    <path class="bear__mouth bear__mouth--neutre" d="M 88 96 Q 100 104 112 96" fill="none" stroke-linecap="round"></path>
    <path class="bear__mouth bear__mouth--content" d="M 82 94 Q 100 112 118 94" fill="none" stroke-linecap="round"></path>
    <path class="bear__mouth bear__mouth--surpris" d="M 100 92 m -8 0 a 8 9 0 1 0 16 0 a 8 9 0 1 0 -16 0" stroke-linecap="round"></path>
    <path class="bear__mouth bear__mouth--triste" d="M 88 100 Q 100 90 112 100" fill="none" stroke-linecap="round"></path>
    <path class="bear__mouth bear__mouth--mort-de-rire" d="M 80 92 Q 100 118 120 92 Q 100 108 80 92 Z" stroke-linecap="round"></path>

    <ellipse class="bear__blush bear__blush--left" cx="68" cy="82" rx="8" ry="5"></ellipse>
    <ellipse class="bear__blush bear__blush--right" cx="132" cy="82" rx="8" ry="5"></ellipse>

    <g class="bear__tear bear__tear--left">
      <path d="M 70 90 Q 66 100 70 108 Q 74 100 70 90 Z"></path>
    </g>
    <g class="bear__tear bear__tear--right">
      <path d="M 130 90 Q 126 100 130 108 Q 134 100 130 90 Z"></path>
    </g>
  </g>
</svg>
`;

const BEAR_ARM_SILHOUETTE_MARKUP = `
<svg class="bear-arm-silhouette" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g class="bear-arm-silhouette__group">
    <ellipse cx="40" cy="100" rx="46" ry="26"></ellipse>
    <ellipse class="bear-arm-silhouette__paw" cx="118" cy="108" rx="24" ry="20"></ellipse>
  </g>
</svg>
`;

/**
 * Crée une instance de l'ours et l'insère dans le conteneur fourni.
 * Renvoie un petit objet de contrôle avec des méthodes pour changer
 * la pose, l'expression, et activer/désactiver le mode silhouette.
 */
function createBear(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'bear-wrapper';
  wrapper.innerHTML = BEAR_SVG_MARKUP;
  container.appendChild(wrapper);

  const el = wrapper.querySelector('.bear');

  function setPose(poseName) {
    // Sur un élément SVG, "className" n'est pas un texte modifiable comme
    // en HTML (c'est un objet SVGAnimatedString) : on utilise classList
    // partout, jamais de manipulation de texte sur className.
    Array.from(el.classList).forEach(function (nomClasse) {
      if (nomClasse.indexOf('bear--pose-') === 0) {
        el.classList.remove(nomClasse);
      }
    });
    el.classList.add('bear--pose-' + poseName);
  }

  function setExpression(expressionName) {
    el.classList.remove(
      'bear--expr-neutre',
      'bear--expr-content',
      'bear--expr-surpris',
      'bear--expr-triste',
      'bear--expr-mort-de-rire'
    );
    el.classList.add('bear--expr-' + expressionName);
  }

  function setSilhouette(isSilhouette) {
    el.classList.toggle('bear--silhouette', !!isSilhouette);
  }

  // État de départ : assis, expression neutre
  setPose('assis');
  setExpression('neutre');

  return {
    el: el,
    wrapper: wrapper,
    setPose: setPose,
    setExpression: setExpression,
    setSilhouette: setSilhouette
  };
}

/**
 * Crée la silhouette de bras isolée (utilisée uniquement pendant la
 * scène de la veilleuse, avant que l'ours ne soit révélé en entier).
 */
function createBearArmSilhouette(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'bear-arm-silhouette-wrapper';
  wrapper.innerHTML = BEAR_ARM_SILHOUETTE_MARKUP;
  container.appendChild(wrapper);

  return {
    el: wrapper.querySelector('.bear-arm-silhouette'),
    wrapper: wrapper
  };
}

export { createBear, createBearArmSilhouette };
