// Kit de dessin « Le tableau du coach ».
// Fonctions pures qui renvoient du SVG : fond d'ardoise, gribouillis à la craie, terrain, joueurs, zones, tracés.
// Aucun hasard non déterministe : le même appel produit toujours la même image.

const C = {
  ardoise: '#1d1e20', cadre: '#3f4042', papier: '#fbfaf6', craie: '#f2efe9', gris: '#8a8d8f', encre: '#2a2b2d',
  orange: '#f5821f', bleu: '#2b8fd6', jaune: '#ffb400', jauneFonce: '#e89b00', ciel: '#8ecbf0', rouge: '#e5484d',
};

// Filtres et dégradés partagés. À placer une fois par SVG.
function defs() {
  return `<defs>
    <filter id="craie" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="9" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.4 2.55" result="gm"/>
      <feComposite in="d" in2="gm" operator="in"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="2"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.2 1.06"/>
    </filter>
    <filter id="flou"><feGaussianBlur stdDeviation="70"/></filter>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="cone" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="${C.jaune}" stop-opacity="0.05"/><stop offset="1" stop-color="${C.jaune}" stop-opacity="0.38"/>
    </linearGradient>
  </defs>`;
}

// Fond d'ardoise : traces d'effaçage, grain, vignette.
function fond() {
  const traces = [[420, 300, 520, 190, -18], [1380, 240, 460, 170, 12], [980, 760, 640, 210, -6], [300, 880, 380, 150, 20], [1640, 820, 360, 160, -24]]
    .map(([x, y, rx, ry, r]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${x} ${y})" fill="#fff" opacity="0.045" filter="url(#flou)"/>`).join('');
  return `<rect width="1920" height="1080" fill="${C.ardoise}"/>${traces}
    <rect width="1920" height="1080" filter="url(#grain)" opacity="0.10"/>
    <rect width="1920" height="1080" fill="url(#vignette)"/>`;
}

// --- Gribouillis à la craie ---
const trait = (d, col, w, op = 1) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;

function croix(x, y, s, col = C.craie, w = 7, rot = 0, op = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})" filter="url(#craie)">${trait(`M${-s},${-s} Q${s * 0.1},${-s * 0.15} ${s},${s}`, col, w, op)}${trait(`M${s},${-s} Q${-s * 0.05},${s * 0.1} ${-s},${s}`, col, w, op)}</g>`;
}
function rond(x, y, r, col = C.craie, w = 6, op = 1) {
  return `<g transform="translate(${x} ${y})" filter="url(#craie)">${trait(`M${r},0 A${r},${r * 0.94} 0 1 1 ${r * 0.86},${-r * 0.42} A${r * 1.04},${r} 0 0 1 ${r * 0.98},${r * 0.2}`, col, w, op)}</g>`;
}
function fleche(x1, y1, cx, cy, x2, y2, col = C.craie, w = 6, op = 1, tete = 22, tirets = '') {
  const a = Math.atan2(y2 - cy, x2 - cx), p = (da) => `${x2 - tete * Math.cos(a + da)},${y2 - tete * Math.sin(a + da)}`;
  return `<g filter="url(#craie)" opacity="${op}"><path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${tirets ? `stroke-dasharray="${tirets}"` : ''}/>
    ${trait(`M${p(0.55)} L${x2},${y2} L${p(-0.55)}`, col, w)}</g>`;
}
function hachures(x, y, n, pas, long, col = C.orange, w = 7, vertical = true, op = 1) {
  let s = '';
  for (let i = 0; i < n; i++) s += vertical ? trait(`M${x},${y + i * pas} l${long},${-4 + (i % 3) * 3}`, col, w, op) : trait(`M${x + i * pas},${y} l${-10 + (i % 2) * 4},${long}`, col, w, op);
  return `<g filter="url(#craie)">${s}</g>`;
}

// --- Terrain ---
// Repère : x en yards depuis la touche gauche (0 à 53,33), y en yards depuis la ligne de mêlée (positif vers la défense).
function terrain({ theme = 'clair', fx = 160, fy = 120, ppy = 30, yMin = -6, yMax = 20 } = {}) {
  const W = 53.333 * ppy, H = (yMax - yMin) * ppy;
  const X = (x) => fx + x * ppy, Y = (y) => fy + (yMax - y) * ppy;
  const clair = theme === 'clair';
  const t = clair
    ? { ligne: '#d4d7d8', los: '#6f7375', num: '#b9bdbf', att: '#ffffff', attTrait: C.encre, attTexte: C.encre, bleu: '#1f80cc', zoneP: 'rgba(43,143,214,.15)', zonePT: '#4a9fdc', zonePTexte: '#1c6aa8', zoneC: 'rgba(255,180,0,.20)', zoneCT: C.jauneFonce, zoneCTexte: '#9a6500' }
    : { ligne: 'rgba(242,239,233,.20)', los: 'rgba(242,239,233,.75)', num: 'rgba(242,239,233,.38)', att: C.ardoise, attTrait: C.craie, attTexte: C.craie, bleu: C.bleu, zoneP: 'rgba(142,203,240,.17)', zonePT: 'rgba(142,203,240,.75)', zonePTexte: C.ciel, zoneC: 'rgba(255,180,0,.17)', zoneCT: 'rgba(255,180,0,.8)', zoneCTexte: C.jaune };

  let fondTerrain = '';
  if (clair) {
    // Le porte-bloc : cadre sombre, feuille, pince jaune.
    fondTerrain = `<rect x="${fx - 20}" y="${fy - 20}" width="${W + 40}" height="${H + 40}" rx="16" fill="${C.cadre}"/>
      <rect x="${fx}" y="${fy}" width="${W}" height="${H}" rx="3" fill="${C.papier}"/>
      <circle cx="960" cy="${fy - 44}" r="24" fill="none" stroke="${C.jaune}" stroke-width="13"/>
      <rect x="845" y="${fy - 40}" width="230" height="50" rx="5" fill="${C.jaune}"/><rect x="845" y="${fy - 4}" width="230" height="14" rx="4" fill="${C.jauneFonce}"/>`;
  } else {
    fondTerrain = `<rect x="${fx}" y="${fy}" width="${W}" height="${H}" fill="rgba(255,255,255,.025)"/>
      <rect x="${fx}" y="${fy}" width="${W}" height="${H}" fill="none" stroke="${C.craie}" stroke-width="6" opacity=".7" filter="url(#craie)"/>`;
  }
  let lignes = '';
  for (let y = 5; y < yMax; y += 5) {
    lignes += `<line x1="${X(0)}" x2="${X(53.333)}" y1="${Y(y)}" y2="${Y(y)}" stroke="${t.ligne}" stroke-width="3"/>`;
    for (const x of [2.2, 51.1]) lignes += `<text x="${X(x)}" y="${Y(y) + 11}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="30" fill="${t.num}">${y}</text>`;
  }
  for (let y = Math.ceil(yMin) + 1; y < yMax; y++) for (const x of [20, 33.333]) lignes += `<line x1="${X(x) - 7}" x2="${X(x) + 7}" y1="${Y(y)}" y2="${Y(y)}" stroke="${t.ligne}" stroke-width="3"/>`;
  lignes += `<line x1="${X(0)}" x2="${X(53.333)}" y1="${Y(0)}" y2="${Y(0)}" stroke="${t.los}" stroke-width="3.5" stroke-dasharray="14 10"/>`;

  const api = {
    X, Y, t, base: fondTerrain + lignes,
    attaquant: (x, y, lettre = '', r = 20) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${r}" fill="${t.att}" stroke="${t.attTrait}" stroke-width="4"/>` + (lettre ? `<text x="${X(x)}" y="${Y(y) + 7.5}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="22" fill="${t.attTexte}">${lettre}</text>` : ''),
    centre: (x, y) => `<rect x="${X(x) - 15}" y="${Y(y) - 15}" width="30" height="30" rx="5" fill="${t.att}" stroke="${t.attTrait}" stroke-width="4"/>`,
    defenseur: (x, y, lettre, r = 21) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${r}" fill="${t.bleu}"/><text x="${X(x)}" y="${Y(y) + 7.5}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="22" fill="#fff">${lettre}</text>`,
    ligneDef: (x, y, s = 11) => `<path d="M${X(x) - s},${Y(y) - s} L${X(x) + s},${Y(y) + s} M${X(x) + s},${Y(y) - s} L${X(x) - s},${Y(y) + s}" stroke="${t.bleu}" stroke-width="7" stroke-linecap="round"/>`,
    zone: (x, y, rx, ry, texte, type = 'profonde') => {
      const p = type === 'profonde';
      return `<ellipse cx="${X(x)}" cy="${Y(y)}" rx="${rx * ppy}" ry="${ry * ppy}" fill="${p ? t.zoneP : t.zoneC}" stroke="${p ? t.zonePT : t.zoneCT}" stroke-width="3"/>
        <text x="${X(x)}" y="${Y(y) + (p ? -ry * ppy * 0.42 : 7)}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="${p ? 24 : 19}" letter-spacing="2.5" fill="${p ? t.zonePTexte : t.zoneCTexte}">${texte}</text>`;
    },
    // Tracé : liste de points en yards, pointe en chevron ouvert.
    trace: (pts, { col = C.orange, w = 8, tirets = '', tete = 20, op = 1 } = {}) => {
      const P = pts.map(([x, y]) => [X(x), Y(y)]), n = P.length, [x2, y2] = P[n - 1], [x1, y1] = P[n - 2];
      const a = Math.atan2(y2 - y1, x2 - x1), q = (da) => `${x2 - tete * Math.cos(a + da)},${y2 - tete * Math.sin(a + da)}`;
      return `<g opacity="${op}"><path d="M${P.map((p) => p.join(',')).join(' L')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${tirets ? `stroke-dasharray="${tirets}"` : ''}/>
        <path d="M${q(0.6)} L${x2},${y2} L${q(-0.6)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    },
    halo: (x, y) => `<circle cx="${X(x)}" cy="${Y(y)}" r="40" fill="none" stroke="${C.jaune}" stroke-width="3" opacity=".4"/><circle cx="${X(x)}" cy="${Y(y)}" r="31" fill="none" stroke="${C.jaune}" stroke-width="6"/>`,
    cone: (x1, y1, x2, y2, larg = 2.6) => {
      const a = Math.atan2(Y(y2) - Y(y1), X(x2) - X(x1)), dx = Math.sin(a) * larg * ppy, dy = -Math.cos(a) * larg * ppy;
      return `<polygon points="${X(x1)},${Y(y1)} ${X(x2) + dx},${Y(y2) + dy} ${X(x2) - dx},${Y(y2) - dy}" fill="${C.jaune}" opacity=".20"/>`;
    },
    ballon: (x, y, rot = 0) => `<g transform="translate(${X(x)} ${Y(y)}) rotate(${rot})"><ellipse rx="17" ry="10" fill="#8a4b22" stroke="${clair ? C.encre : C.craie}" stroke-width="2.5"/><path d="M-7,0 H7 M-4,-3 V3 M0,-3 V3 M4,-3 V3" stroke="#fff" stroke-width="2"/></g>`,
    etiquette: (x, y, texte, { col = C.jaune, coulTexte = C.encre, ancre = 'middle' } = {}) => {
      const w = texte.length * 12.4 + 30, dx = ancre === 'middle' ? -w / 2 : ancre === 'end' ? -w : 0;
      return `<g transform="translate(${X(x) + dx} ${Y(y) - 19})"><rect width="${w}" height="38" rx="6" fill="${col}"/><text x="${w / 2}" y="27" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="24" letter-spacing="2" fill="${coulTexte}">${texte}</text></g>`;
    },
  };
  return api;
}

if (typeof module !== 'undefined') module.exports = { C, defs, fond, croix, rond, fleche, hachures, terrain };
