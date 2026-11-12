// Kit de dessin « Le tableau du coach ».
// Fonctions pures qui renvoient du SVG : ardoise, gribouillis à la craie, terrain en gazon, joueurs, zones, tracés.
// Aucun hasard non déterministe : le même appel produit toujours la même image.

const C = {
  ardoise: '#1d1e20', craie: '#f2efe9', gris: '#8a8d8f',
  gazon: '#1f5a2b', gazonClair: '#246331', horsJeu: '#143d1e', vertTexte: '#12391b',
  blanc: '#ffffff', orange: '#ff8a1f', jaune: '#ffc400', ciel: '#9fd4f5', los: '#3ea0ee', bleu: '#2b8fd6', rouge: '#ff5a5f',
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
    <filter id="ombre" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity=".45"/></filter>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="50%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.6"/>
    </radialGradient>
  </defs>`;
}

// Fond d'ardoise, pour les titres et les cartes : traces d'effaçage, grain, vignette.
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
// Caméra : ppy = pixels par yard, ox = abscisse en pixels de la touche gauche, oy = ordonnée en pixels de la ligne de mêlée.
// Plan large de référence : ppy 24, ox 320, oy 600, soit de -20 à +25 yards sur toute la hauteur.
function terrain({ ppy = 24, ox = 320, oy = 600, W = 1920, H = 1080 } = {}) {
  const X = (x) => ox + x * ppy, Y = (y) => oy - y * ppy;
  const L = 53.333, k = ppy / 24;
  const yHaut = Math.ceil((oy) / ppy) + 1, yBas = -Math.ceil((H - oy) / ppy) - 1;
  const R = Math.min(0.72 * ppy, 30), police = 'Barlow Condensed';

  // Gazon : hors-jeu sombre, bandes de tonte tous les 5 yards, grain, vignette.
  let base = `<rect width="${W}" height="${H}" fill="${C.horsJeu}"/>`;
  for (let y = Math.floor(yBas / 5) * 5; y < yHaut; y += 5) {
    base += `<rect x="${X(0)}" y="${Y(y + 5)}" width="${L * ppy}" height="${5 * ppy}" fill="${(Math.abs(y / 5) % 2) ? C.gazonClair : C.gazon}"/>`;
  }
  base += `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.07"/>`;
  // Lignes de 5 yards, repères d'un yard sur les hashes et les touches.
  let lignes = '';
  for (let y = yBas; y <= yHaut; y++) {
    if (y % 5 === 0) {
      if (y !== 0) lignes += `<line x1="${X(0)}" x2="${X(L)}" y1="${Y(y)}" y2="${Y(y)}" stroke="#fff" stroke-width="${2.5 * k}" opacity=".8"/>`;
    } else {
      for (const [a, b] of [[0.3, 1], [19.65, 20.35], [32.98, 33.68], [L - 1, L - 0.3]]) lignes += `<line x1="${X(a)}" x2="${X(b)}" y1="${Y(y)}" y2="${Y(y)}" stroke="#fff" stroke-width="${2 * k}" opacity=".6"/>`;
    }
  }
  // Grands chiffres couchés : distance à la ligne de mêlée.
  for (const y of [-10, 10, 20]) {
    if (Y(y) < -40 || Y(y) > H + 40) continue;
    lignes += `<text transform="translate(${X(8)} ${Y(y)}) rotate(-90)" text-anchor="middle" dominant-baseline="central" font-family="${police}" font-weight="700" font-size="${3.3 * ppy}" fill="#fff" opacity=".11">${Math.abs(y)}</text>`;
    lignes += `<text transform="translate(${X(L - 8)} ${Y(y)}) rotate(90)" text-anchor="middle" dominant-baseline="central" font-family="${police}" font-weight="700" font-size="${3.3 * ppy}" fill="#fff" opacity=".11">${Math.abs(y)}</text>`;
  }
  // Touches et ligne de mêlée.
  lignes += `<line x1="${X(0)}" x2="${X(0)}" y1="0" y2="${H}" stroke="#fff" stroke-width="${5 * k}"/><line x1="${X(L)}" x2="${X(L)}" y1="0" y2="${H}" stroke="#fff" stroke-width="${5 * k}"/>`;
  lignes += `<line x1="${X(0)}" x2="${X(L)}" y1="${Y(0)}" y2="${Y(0)}" stroke="${C.los}" stroke-width="${4 * k}"/>`;
  // Échelle de profondeur le long de la touche gauche.
  for (const y of [5, 10, 15, 20]) lignes += `<text x="${X(0) - 10 * k}" y="${Y(y) + 6 * k}" text-anchor="end" font-family="${police}" font-weight="700" font-size="${17 * k}" fill="#fff" opacity=".55">+${y}</text>`;
  const vignette = `<rect width="${W}" height="${H}" fill="url(#vignette)"/>`;

  const lettre = (x, y, t, col, taille = R) => `<text x="${X(x)}" y="${Y(y)}" text-anchor="middle" dominant-baseline="central" font-family="${police}" font-weight="700" font-size="${taille * (t.length > 1 ? 0.98 : 1.15)}" fill="${col}">${t}</text>`;

  return {
    X, Y, ppy, R, base: base + lignes, vignette,
    // Attaque : disque blanc avec la lettre du poste. Ligne offensive en anneaux, centre en carré.
    attaquant: (x, y, t) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${R}" fill="#fff" filter="url(#ombre)"/>${lettre(x, y, t, C.vertTexte)}`,
    ligneOff: (x, y) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${R * 0.72}" fill="${C.gazon}" stroke="#fff" stroke-width="${R * 0.3}"/>`,
    centre: (x, y) => `<rect x="${X(x) - R * 0.72}" y="${Y(y) - R * 0.72}" width="${R * 1.44}" height="${R * 1.44}" rx="${R * 0.18}" fill="${C.gazon}" stroke="#fff" stroke-width="${R * 0.3}"/>`,
    // Défense : disque ardoise cerclé de blanc. Ligne défensive en croix à la craie.
    defenseur: (x, y, t, { conflit = false } = {}) => conflit
      ? `<circle cx="${X(x)}" cy="${Y(y)}" r="${R * 1.85}" fill="none" stroke="${C.jaune}" stroke-width="${2.5 * k}" opacity=".45"/><circle cx="${X(x)}" cy="${Y(y)}" r="${R * 1.42}" fill="none" stroke="${C.jaune}" stroke-width="${4.5 * k}"/><circle cx="${X(x)}" cy="${Y(y)}" r="${R}" fill="${C.jaune}" filter="url(#ombre)"/>${lettre(x, y, t, C.ardoise)}`
      : `<circle cx="${X(x)}" cy="${Y(y)}" r="${R}" fill="${C.ardoise}" stroke="#fff" stroke-width="${2.6 * k}" filter="url(#ombre)"/>${lettre(x, y, t, '#fff')}`,
    ligneDef: (x, y) => { const s = R * 0.62; return `<path d="M${X(x) - s},${Y(y) - s} L${X(x) + s},${Y(y) + s} M${X(x) + s},${Y(y) - s} L${X(x) - s},${Y(y) + s}" stroke="#fff" stroke-width="${R * 0.36}" stroke-linecap="round"/>`; },
    zone: (x, y, rx, ry, texte, type = 'profonde') => {
      const p = type === 'profonde', col = p ? C.ciel : C.jaune;
      return `<ellipse cx="${X(x)}" cy="${Y(y)}" rx="${rx * ppy}" ry="${ry * ppy}" fill="${col}" fill-opacity="${p ? 0.2 : 0.22}" stroke="${col}" stroke-width="${2.5 * k}"/>
        <text x="${X(x)}" y="${Y(y) + (p ? -ry * ppy * 0.5 : 0)}" text-anchor="middle" dominant-baseline="central" font-family="${police}" font-weight="700" font-size="${(p ? 19 : 15.5) * k}" letter-spacing="${2 * k}" fill="${p ? '#e3f3fd' : '#ffe58a'}">${texte}</text>`;
    },
    // Tracé : liste de points en yards. fin 'fleche' = le receveur continue de courir, fin 'stop' = il s'arrête.
    trace: (pts, { col = C.orange, w = 6.5 * k, tirets = '', fin = 'fleche', op = 1 } = {}) => {
      const P = pts.map(([x, y]) => [X(x), Y(y)]), n = P.length, [x2, y2] = P[n - 1], [x1, y1] = P[n - 2];
      const a = Math.atan2(y2 - y1, x2 - x1), t = 17 * k, q = (da) => `${x2 - t * Math.cos(a + da)},${y2 - t * Math.sin(a + da)}`;
      const bout = fin === 'stop'
        ? `<path d="M${x2 - 14 * k * Math.sin(a)},${y2 + 14 * k * Math.cos(a)} L${x2 + 14 * k * Math.sin(a)},${y2 - 14 * k * Math.cos(a)}" stroke="${col}" stroke-width="${w * 1.1}" stroke-linecap="round"/>`
        : `<path d="M${q(0.6)} L${x2},${y2} L${q(-0.6)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
      return `<g opacity="${op}"><path d="M${P.map((p) => p.join(',')).join(' L')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${tirets ? `stroke-dasharray="${tirets}"` : ''}/>${bout}</g>`;
    },
    cone: (x1, y1, x2, y2, larg = 2.4) => {
      const a = Math.atan2(Y(y2) - Y(y1), X(x2) - X(x1)), dx = Math.sin(a) * larg * ppy, dy = -Math.cos(a) * larg * ppy;
      return `<polygon points="${X(x1)},${Y(y1)} ${X(x2) + dx},${Y(y2) + dy} ${X(x2) - dx},${Y(y2) - dy}" fill="${C.jaune}" opacity=".22"/>`;
    },
    vol: (x1, y1, cx, cy, x2, y2) => `<path d="M${X(x1)},${Y(y1)} Q${X(cx)},${Y(cy)} ${X(x2)},${Y(y2)}" fill="none" stroke="#fff" stroke-width="${3 * k}" stroke-dasharray="${2 * k} ${10 * k}" stroke-linecap="round" opacity=".9"/>`,
    ballon: (x, y, rot = 0) => `<g transform="translate(${X(x)} ${Y(y)}) rotate(${rot}) scale(${k})" filter="url(#ombre)"><ellipse rx="15" ry="9" fill="#8a4b22" stroke="#fff" stroke-width="2"/><path d="M-6,0 H6 M-3.5,-2.6 V2.6 M0,-2.6 V2.6 M3.5,-2.6 V2.6" stroke="#fff" stroke-width="1.6"/></g>`,
    etiquette: (x, y, texte, { col = C.jaune, coulTexte = C.ardoise } = {}) => {
      const f = 17 * k, w = texte.length * f * 0.56 + 22 * k, h = f * 1.55;
      return `<g transform="translate(${X(x) - w / 2} ${Y(y) - h / 2})" filter="url(#ombre)"><rect width="${w}" height="${h}" rx="${5 * k}" fill="${col}"/><text x="${w / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="central" font-family="${police}" font-weight="700" font-size="${f}" letter-spacing="${1.6 * k}" fill="${coulTexte}">${texte}</text></g>`;
    },
    cadenas: (x, y, ferme = true) => `<g transform="translate(${X(x)} ${Y(y)}) scale(${k})" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"><path d="M-8,-4 V-11 A8,8 0 0 1 8,-11 ${ferme ? 'V-4' : ''}"/><rect x="-12" y="-4" width="24" height="18" rx="3.5" fill="#fff" stroke="none"/></g>`,
  };
}

if (typeof module !== 'undefined') module.exports = { C, defs, fond, croix, rond, fleche, hachures, terrain };
