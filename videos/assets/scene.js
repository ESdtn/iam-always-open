// Moteur de scène partagé par toutes les vidéos.
// Il construit le terrain une fois, en plan large, puis fournit des fabriques d'éléments (joueurs, zones, tracés,
// étiquettes) et des aides pour les animer sur une timeline GSAP. Tout est piloté par le temps de la timeline :
// aucun hasard, aucune horloge, pour que chaque image soit reproductible.

function creerScene(hote) {
  const f = terrain();
  const { X, Y, R } = f;
  const NS = 'http://www.w3.org/2000/svg';
  const police = 'Barlow Condensed';

  hote.innerHTML = `<svg class="fond" width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="${NS}">${defs()}
    <g id="monde" data-layout-allow-overflow>${f.base}<g id="c-zones"></g><g id="c-traces"></g><g id="c-joueurs"></g><g id="c-dessus"></g></g>${f.vignette}</svg>`;
  const couche = (nom) => hote.querySelector('#c-' + nom);
  const ajoute = (nom, html) => { couche(nom).insertAdjacentHTML('beforeend', html); return couche(nom).lastElementChild; };
  const lettre = (t, col) => `<text class="lettre" text-anchor="middle" dominant-baseline="central" font-family="${police}" font-weight="700" font-size="${R * (t.length > 1 ? 0.98 : 1.15)}" fill="${col}">${t}</text>`;

  const S = { f, X, Y, R, hote, positions: {} };

  // --- Fabriques. Chaque élément est créé à l'origine puis placé par GSAP, pour pouvoir être déplacé ensuite. ---
  S.joueur = (id, type, texte, x, y, visible = true) => {
    const corps = {
      att: `<circle class="corps" r="${R}" fill="#fff" filter="url(#ombre)"/>${lettre(texte, C.vertTexte)}`,
      ol: `<circle r="${R * 0.72}" fill="${C.gazon}" stroke="#fff" stroke-width="${R * 0.3}"/>`,
      centre: `<rect x="${-R * 0.72}" y="${-R * 0.72}" width="${R * 1.44}" height="${R * 1.44}" rx="${R * 0.18}" fill="${C.gazon}" stroke="#fff" stroke-width="${R * 0.3}"/>`,
      def: `<circle class="halo2" r="${R * 1.85}" fill="none" stroke="${C.jaune}" stroke-width="2.5" opacity="0"/><circle class="halo1" r="${R * 1.42}" fill="none" stroke="${C.jaune}" stroke-width="4.5" opacity="0"/>
            <circle class="corps" r="${R}" fill="${C.ardoise}" stroke="#fff" stroke-width="2.6" filter="url(#ombre)"/>${lettre(texte, '#fff')}`,
      dl: `<path d="M${-R * 0.62},${-R * 0.62} L${R * 0.62},${R * 0.62} M${R * 0.62},${-R * 0.62} L${-R * 0.62},${R * 0.62}" stroke="#fff" stroke-width="${R * 0.36}" stroke-linecap="round"/>`,
    }[type];
    const anneau = type === 'att' ? `<circle class="halo1" r="${R * 1.42}" fill="none" stroke="${C.orange}" stroke-width="4.5" opacity="0"/>` : '';
    const el = ajoute('joueurs', `<g id="${id}" class="joueur ${type}">${anneau}${corps}</g>`);
    gsap.set(el, { x: X(x), y: Y(y), opacity: visible ? 1 : 0 });
    S.positions[id] = [x, y];
    return el;
  };

  S.zone = (id, x, y, rx, ry, texte, type = 'profonde') => {
    const p = type === 'profonde', col = p ? C.ciel : C.jaune;
    return ajoute('zones', `<g id="${id}" opacity="0"><ellipse cx="${X(x)}" cy="${Y(y)}" rx="${rx * 24}" ry="${ry * 24}" fill="${col}" fill-opacity="${p ? 0.2 : 0.22}" stroke="${col}" stroke-width="2.5"/>
      <text x="${X(x)}" y="${Y(y) + (p ? -ry * 12 : 0)}" text-anchor="middle" dominant-baseline="central" font-family="${police}" font-weight="700" font-size="${p ? 19 : 15.5}" letter-spacing="2" fill="${p ? '#e3f3fd' : '#ffe58a'}">${texte}</text></g>`);
  };

  // Tracé : fin 'fleche' = le receveur continue de courir, fin 'stop' = il s'arrête.
  S.trace = (id, pts, { col = C.orange, w = 6.5, fin = 'fleche', op = 1 } = {}) => {
    const P = pts.map(([x, y]) => [X(x), Y(y)]), n = P.length, [x2, y2] = P[n - 1], [x1, y1] = P[n - 2];
    const a = Math.atan2(y2 - y1, x2 - x1), q = (da) => `${x2 - 17 * Math.cos(a + da)},${y2 - 17 * Math.sin(a + da)}`;
    const bout = fin === 'stop'
      ? `<path class="bout" opacity="0" d="M${x2 - 14 * Math.sin(a)},${y2 + 14 * Math.cos(a)} L${x2 + 14 * Math.sin(a)},${y2 - 14 * Math.cos(a)}" stroke="${col}" stroke-width="${w * 1.1}" stroke-linecap="round"/>`
      : `<path class="bout" opacity="0" d="M${q(0.6)} L${x2},${y2} L${q(-0.6)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const el = ajoute('traces', `<g id="${id}" opacity="0" data-op="${op}"><path class="trait" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" d="M${P.map((p) => p.join(',')).join(' L')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="butt" stroke-linejoin="round"/>${bout}</g>`);
    el._pts = pts;
    return el;
  };

  S.etiquette = (id, x, y, texte, { col = C.jaune, coulTexte = C.ardoise, taille = 17, couche: c = 'dessus' } = {}) => {
    const w = texte.length * taille * 0.56 + taille * 1.3, h = taille * 1.55;
    const el = ajoute(c, `<g id="${id}" opacity="0"><g filter="url(#ombre)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${taille * 0.3}" fill="${col}"/></g>
      <text text-anchor="middle" dominant-baseline="central" font-family="${police}" font-weight="700" font-size="${taille}" letter-spacing="${taille * 0.09}" fill="${coulTexte}">${texte}</text></g>`);
    gsap.set(el, { x: X(x), y: Y(y) });
    return el;
  };

  S.ligne = (id, x1, y1, x2, y2, { col = C.jaune, w = 3, tirets = '10 9' } = {}) =>
    ajoute('dessus', `<line id="${id}" opacity="0" x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${tirets ? `stroke-dasharray="${tirets}"` : ''}/>`);

  S.cone = (id, x1, y1, x2, y2, larg = 2.4) => {
    const a = Math.atan2(Y(y2) - Y(y1), X(x2) - X(x1)), dx = Math.sin(a) * larg * 24, dy = -Math.cos(a) * larg * 24;
    return ajoute('zones', `<polygon id="${id}" opacity="0" points="${X(x1)},${Y(y1)} ${X(x2) + dx},${Y(y2) + dy} ${X(x2) - dx},${Y(y2) - dy}" fill="${C.jaune}" fill-opacity=".24"/>`);
  };

  S.cadenas = (id, x, y, ferme) => {
    const el = ajoute('dessus', `<g id="${id}" opacity="0"><g stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" filter="url(#ombre)"><path d="M-10,-5 V-14 A10,10 0 0 1 10,-14 ${ferme ? 'V-5' : ''}"/><rect x="-15" y="-5" width="30" height="23" rx="4.5" fill="#fff" stroke="none"/></g></g>`);
    gsap.set(el, { x: X(x), y: Y(y) });
    return el;
  };

  S.marque = (id, x, y, col = C.rouge) => {
    const el = ajoute('dessus', `<g id="${id}" opacity="0"><path d="M-14,-14 L14,14 M14,-14 L-14,14" stroke="${col}" stroke-width="7" stroke-linecap="round" filter="url(#ombre)"/></g>`);
    gsap.set(el, { x: X(x), y: Y(y) });
    return el;
  };

  S.ballon = (id = 'ballon') => ajoute('dessus', `<g id="${id}" opacity="0"><g class="vol" filter="url(#ombre)"><ellipse rx="15" ry="9" fill="#8a4b22" stroke="#fff" stroke-width="2"/><path d="M-6,0 H6 M-3.5,-2.6 V2.6 M0,-2.6 V2.6 M3.5,-2.6 V2.6" stroke="#fff" stroke-width="1.6"/></g></g>`);

  // --- Aides d'animation. tl = timeline, t = instant en secondes, d = durée. ---
  const sel = (id) => (typeof id === 'string' ? '#' + id : id);
  S.montre = (tl, id, t, d = 0.3, op = 1) => tl.to(sel(id), { opacity: op, duration: d, ease: 'power1.out' }, t);
  S.cache = (tl, id, t, d = 0.3) => tl.to(sel(id), { opacity: 0, duration: d, ease: 'power1.in' }, t);
  S.va = (tl, id, x, y, t, d = 0.5, ease = 'power2.inOut') => { S.positions[id] = [x, y]; return tl.to('#' + id, { x: X(x), y: Y(y), duration: d, ease }, t); };
  S.formation = (tl, f2, t, d = 0.5, decalage = 0) => Object.entries(f2).forEach(([id, [x, y]], i) => S.va(tl, id, x, y, t + i * decalage, d));
  S.entre = (tl, ids, t, decalage = 0.06, d = 0.35) => ids.forEach((id, i) => tl.fromTo('#' + id, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: d, ease: 'back.out(1.8)', immediateRender: false }, t + i * decalage));
  S.sort = (tl, ids, t, d = 0.3) => ids.forEach((id) => tl.to('#' + id, { opacity: 0, duration: d }, t));

  // Dessine un tracé progressivement, puis affiche sa pointe.
  S.dessine = (tl, id, t, d = 0.8) => {
    const el = document.getElementById(id), op = +el.dataset.op;
    tl.set(el, { opacity: op }, t);
    tl.fromTo(el.querySelector('.trait'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease: 'none', immediateRender: false }, t);
    tl.to(el.querySelector('.bout'), { opacity: 1, duration: 0.12 }, t + d - 0.05);
  };
  S.efface = (tl, id, t, d = 0.3) => {
    const el = document.getElementById(id);
    tl.to(el, { opacity: 0, duration: d }, t);
    tl.set(el.querySelector('.trait'), { strokeDashoffset: 1 }, t + d + 0.01);
    tl.set(el.querySelector('.bout'), { opacity: 0 }, t + d + 0.01);
  };
  // Fait courir un joueur le long d'une suite de points, à vitesse constante.
  S.court = (tl, id, pts, t, d) => {
    const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), total = L.reduce((a, b) => a + b, 0);
    let t0 = t;
    pts.slice(1).forEach((p, i) => { const di = d * L[i] / total; S.va(tl, id, p[0], p[1], t0, di, 'none'); t0 += di; });
  };
  S.conflit = (tl, id, t, actif = true) => {
    tl.to(`#${id} .corps`, { fill: actif ? C.jaune : C.ardoise, stroke: actif ? C.jaune : '#fff', duration: 0.25 }, t);
    tl.to(`#${id} .lettre`, { fill: actif ? C.ardoise : '#fff', duration: 0.25 }, t);
    tl.to(`#${id} .halo1`, { opacity: actif ? 1 : 0, duration: 0.25 }, t);
    tl.to(`#${id} .halo2`, { opacity: actif ? 0.45 : 0, duration: 0.25 }, t);
  };
  // Anneau qui apparaît autour d'un joueur, puis s'éteint si une durée est donnée.
  S.halo = (tl, id, t, tenue = 0, col = null) => {
    const h = `#${id} .halo1`;
    if (col) tl.set(h, { stroke: col }, t);
    tl.fromTo(h, { opacity: 0, scale: 1.7, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, t);
    if (tenue) tl.to(h, { opacity: 0, duration: 0.25 }, t + tenue);
  };
  S.lance = (tl, de, vers, t, d = 0.7, id = 'ballon') => {
    const a = Math.atan2(Y(vers[1]) - Y(de[1]), X(vers[0]) - X(de[0])) * 180 / Math.PI;
    tl.set('#' + id, { x: X(de[0]), y: Y(de[1]), rotation: a, opacity: 1 }, t);
    tl.to('#' + id, { x: X(vers[0]), y: Y(vers[1]), duration: d, ease: 'none' }, t);
    tl.fromTo(`#${id} .vol`, { scale: 1 }, { scale: 1.7, duration: d / 2, ease: 'sine.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%', immediateRender: false }, t);
  };
  // Caméra : zoom = facteur par rapport au plan large ; le point (cx, cy) en yards vient se placer en (sx, sy) à l'écran.
  // L'état de la caméra vit dans un objet à part et s'écrit en clair dans l'attribut transform : pas d'ambiguïté d'origine.
  const cam = { z: 1, tx: 0, ty: 0 }, monde = hote.querySelector('#monde');
  const poseCamera = () => monde.setAttribute('transform', `translate(${cam.tx} ${cam.ty}) scale(${cam.z})`);
  S.camera = (tl, t, d, { zoom = 1, cx = 26.667, cy = 2.5, sx = 960, sy = 540 } = {}) =>
    tl.to(cam, { z: zoom, tx: sx - zoom * X(cx), ty: sy - zoom * Y(cy), duration: d, ease: 'power2.inOut', onUpdate: poseCamera }, t);
  S.cameraLarge = (tl, t, d = 0.8) => tl.to(cam, { z: 1, tx: 0, ty: 0, duration: d, ease: 'power2.inOut', onUpdate: poseCamera }, t);

  // Apparition d'un élément d'habillage HTML (pas d'un élément du terrain, que GSAP place déjà par x et y).
  S.apparait = (tl, id, t, d = 0.3) => tl.fromTo(sel(id), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: d, ease: 'power2.out', immediateRender: false }, t);
  // Déplace une extrémité d'une ligne (n = 1 ou 2), pour qu'elle suive un joueur.
  S.bout = (tl, id, n, x, y, t, d, ease = 'none') => tl.to('#' + id, { attr: n === 1 ? { x1: X(x), y1: Y(y) } : { x2: X(x), y2: Y(y) }, duration: d, ease }, t);
  S.poseLigne = (tl, id, x1, y1, x2, y2, t) => tl.set('#' + id, { attr: { x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2) } }, t);
  // Même découpage que S.court, pour l'extrémité d'une ligne attachée à un joueur qui court.
  S.boutCourt = (tl, id, n, pts, t, d) => {
    const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), total = L.reduce((a, b) => a + b, 0);
    let t0 = t;
    pts.slice(1).forEach((p, i) => { const di = d * L[i] / total; S.bout(tl, id, n, p[0], p[1], t0, di); t0 += di; });
  };
  S.cercle = (id, x, y, r = 34, col = C.orange) => {
    const el = ajoute('zones', `<g id="${id}" opacity="0"><circle r="${r}" fill="${col}" fill-opacity=".22" stroke="${col}" stroke-width="4" stroke-dasharray="9 7"/></g>`);
    gsap.set(el, { x: X(x), y: Y(y) });
    return el;
  };
  // Liste d'étapes numérotées (#et1, #et2...) : met la n-ième en avant.
  S.etape = (tl, n, t, total = 3) => { for (let i = 1; i <= total; i++) {
    tl.to('#et' + i, { backgroundColor: i === n ? C.orange : 'rgba(0,0,0,0)', color: i === n ? C.ardoise : 'rgba(255,255,255,.45)', duration: 0.2 }, t);
    tl.to(`#et${i} b`, { color: i === n ? C.ardoise : 'rgba(255,255,255,.55)', duration: 0.2 }, t);
  } };
  // Grande étiquette MAN ou ZONE dans la marge droite (#b-man, #b-zone). famille = 'man', 'zone' ou null.
  S.famille = (tl, famille, t) => ['man', 'zone'].forEach((f) => tl.to('#b-' + f, { opacity: f === famille ? 1 : 0, duration: 0.25 }, t));

  // Tableau d'ardoise plein écran : pendant qu'il couvre tout, le terrain est masqué pour de bon.
  S.ardoise = (tl, id, t0, t1, d = 0.45) => {
    const fond = hote.querySelector('svg.fond');
    tl.to('#' + id, { opacity: 1, duration: d, ease: 'power1.out' }, t0);
    tl.set(fond, { visibility: 'hidden' }, t0 + d + 0.02);
    tl.set(fond, { visibility: 'visible' }, t1 - 0.02);
    tl.to('#' + id, { opacity: 0, duration: d, ease: 'power1.in' }, t1);
  };

  // --- Formation de base : c'est aussi l'état neutre, première et dernière image de chaque vidéo. ---
  S.ATTAQUE = { X: [5.8, -0.8], H: [14, -1.9], Y: [39.3, -1.9], Z: [47.5, -0.8], QB: [26.667, -5], RB: [29.7, -5] };
  S.creerAttaque = (visible = true) => {
    [-3.2, -1.6, 1.6, 3.2].forEach((d, i) => S.joueur('OL' + i, 'ol', '', 26.667 + d, -0.8, visible));
    S.joueur('OLC', 'centre', '', 26.667, -0.8, visible);
    Object.entries(S.ATTAQUE).forEach(([id, [x, y]]) => S.joueur(id, 'att', id, x, y, visible));
    return ['OL0', 'OL1', 'OLC', 'OL2', 'OL3', 'QB', 'RB', 'X', 'H', 'Y', 'Z'];
  };
  S.creerDefense = (formation, visible = false) => {
    [22.4, 25.2, 28.1, 30.9].forEach((x, i) => S.joueur('DL' + i, 'dl', '', x, 0.95, visible));
    Object.entries(formation).forEach(([id, [x, y]]) => S.joueur(id, 'def', id.replace(/[GD]$/, ''), x, y, visible));
    return ['DL0', 'DL1', 'DL2', 'DL3', ...Object.keys(formation)];
  };
  return S;
}

// Sous-titres : une phrase à la fois, calée sur le minutage de la voix.
function creerSousTitres(hote, tl, minutage) {
  const boite = document.createElement('div');
  boite.className = 'sous-titre';
  hote.appendChild(boite);
  minutage.scenes.forEach((sc) => sc.phrases.forEach((p) => {
    const s = document.createElement('span');
    s.textContent = p.texte;
    s.style.opacity = 0;
    boite.appendChild(s);
    tl.set(s, { opacity: 1 }, Math.max(p.t0 - 0.08, 0));
    tl.set(s, { opacity: 0 }, p.t1 + 0.22);
  }));
}
