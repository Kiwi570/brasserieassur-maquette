/* Plan isométrique d'une brasserie type, dessiné en SVG au moment de la génération.
   Six zones (A à F) tirées de donnees/zones.json. Chaque trait a pathLength="1" : il se dessine
   au défilement sans mesure (stroke-dashoffset de 1 à 0). Les volumes sont remplis couleur papier
   et dessinés de l'arrière vers l'avant : les traits cachés le restent. */
import { html, brut } from '../../outils/gabarit.mjs';

const S = 40, C = Math.cos(Math.PI / 6);
const P = (x, y, z = 0) => [(x - y) * C * S, ((x + y) / 2 - z) * S];
const f = (n) => Math.round(n * 10) / 10;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;
const poly = (pts) => 'M' + pts.map(pt).join(' L') + 'Z';

const trait = (d, cls = 'trait', extra = '') => `<path class="${cls}" d="${d}" pathLength="1"${extra}/>`;
const face = (d, cls) => `<path class="face ${cls}" d="${d}"/>`;

/* Pavé : faces visibles dessus, +y (gauche) et +x (droite). */
function pave(x0, x1, y0, y1, z0, z1, { lignes = [] } = {}) {
  const dessus = [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)];
  const gauche = [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)];
  const droite = [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)];
  const contour = poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1), P(x0, y1, z1)]);
  return face(poly(gauche), 'face-g') + face(poly(droite), 'face-d') + face(poly(dessus), 'face-h')
    + trait(contour) + trait(`M${pt(P(x0, y1, z1))} L${pt(P(x1, y1, z1))} L${pt(P(x1, y0, z1))} M${pt(P(x1, y1, z1))} L${pt(P(x1, y1, z0))}`)
    + lignes.map((l) => trait(l, 'trait trait-fin')).join('');
}

/* Ellipse d'un cercle horizontal de rayon r centré en (x, y, z). */
const ell = (x, y, z, r) => { const [cx, cy] = P(x, y, z); return { cx, cy, rx: r * C * Math.SQRT2 * S, ry: r * 0.5 * Math.SQRT2 * S }; };
const arc = (e, avant = true) => `M${f(e.cx - e.rx)} ${f(e.cy)} A${f(e.rx)} ${f(e.ry)} 0 0 ${avant ? 0 : 1} ${f(e.cx + e.rx)} ${f(e.cy)}`;

/* Cylindre vertical, avec dôme, cône inférieur sur pieds, ou cerclages. */
function cylindre(x, y, r, z0, z1, { dome = 0, cone = 0, pieds = false, cercles = [] } = {}) {
  const b = ell(x, y, z0, r), h = ell(x, y, z1, r);
  let s = '';
  if (pieds) {
    const bas = cone ? z0 - cone : z0;
    [[-0.7, -0.7], [0.7, -0.7], [0.7, 0.7], [-0.7, 0.7]].forEach(([dx, dy]) => {
      s += trait(`M${pt(P(x + dx * r, y + dy * r, bas + 0.2))} L${pt(P(x + dx * r, y + dy * r, 0))}`, 'trait trait-fin');
    });
  }
  if (cone) {
    const [ax, ay] = P(x, y, z0 - cone);
    const dc = `M${f(b.cx - b.rx)} ${f(b.cy)} L${f(ax)} ${f(ay)} L${f(b.cx + b.rx)} ${f(b.cy)} A${f(b.rx)} ${f(b.ry)} 0 0 0 ${f(b.cx - b.rx)} ${f(b.cy)}Z`;
    s += face(dc, 'face-d') + trait(`M${f(b.cx - b.rx)} ${f(b.cy)} L${f(ax)} ${f(ay)} L${f(b.cx + b.rx)} ${f(b.cy)}`);
  }
  const corps = `M${f(h.cx - h.rx)} ${f(h.cy)} L${f(b.cx - b.rx)} ${f(b.cy)} A${f(b.rx)} ${f(b.ry)} 0 0 0 ${f(b.cx + b.rx)} ${f(b.cy)} L${f(h.cx + h.rx)} ${f(h.cy)} A${f(h.rx)} ${f(h.ry)} 0 0 0 ${f(h.cx - h.rx)} ${f(h.cy)}Z`;
  s += face(corps, 'face-g');
  /* Reflet vertical : rend le volume lisible. */
  s += `<path class="reflet" d="M${f(h.cx - h.rx * 0.45)} ${f(h.cy + h.ry * 0.9)} L${f(b.cx - b.rx * 0.45)} ${f(b.cy + b.ry * 0.9)}"/>`;
  s += trait(`M${f(h.cx - h.rx)} ${f(h.cy)} L${f(b.cx - b.rx)} ${f(b.cy)} ${arc(b).replace(/^M[^A]+/, '')} L${f(h.cx + h.rx)} ${f(h.cy)}`);
  cercles.forEach((z) => { const e = ell(x, y, z, r); s += trait(arc(e), 'trait trait-fin'); });
  if (dome) {
    const [dx, dy] = P(x, y, z1 + dome);
    s += face(`M${f(h.cx - h.rx)} ${f(h.cy)} Q${f(dx)} ${f(dy - dome * S * 0.6)} ${f(h.cx + h.rx)} ${f(h.cy)} A${f(h.rx)} ${f(h.ry)} 0 0 1 ${f(h.cx - h.rx)} ${f(h.cy)}Z`, 'face-h');
    s += trait(`M${f(h.cx - h.rx)} ${f(h.cy)} Q${f(dx)} ${f(dy - dome * S * 0.6)} ${f(h.cx + h.rx)} ${f(h.cy)}`);
    s += trait(arc(h), 'trait trait-fin');
  } else {
    s += `<ellipse class="face face-h" cx="${f(h.cx)}" cy="${f(h.cy)}" rx="${f(h.rx)}" ry="${f(h.ry)}"/>`;
    s += trait(`M${f(h.cx - h.rx)} ${f(h.cy)} A${f(h.rx)} ${f(h.ry)} 0 1 0 ${f(h.cx + h.rx)} ${f(h.cy)} A${f(h.rx)} ${f(h.ry)} 0 1 0 ${f(h.cx - h.rx)} ${f(h.cy)}`);
  }
  return s;
}

const tuyau = (pts) => trait('M' + pts.map((p) => pt(P(...p))).join(' L'), 'trait trait-tuyau');

/* Objets de chaque zone, du fond vers l'avant. */
const objets = {
  brassage: () => pave(0.4, 3.6, 0.4, 3.6, 0, 0.25)
    + cylindre(1.3, 1.3, 0.62, 0.25, 1.75, { dome: 0.45, cercles: [0.9] })
    + cylindre(2.75, 1.3, 0.62, 0.25, 1.75, { dome: 0.45, cercles: [0.9] })
    + tuyau([[1.3, 1.3, 2.35], [1.3, 1.3, 2.7], [2.75, 1.3, 2.7], [2.75, 1.3, 2.35]])
    + cylindre(2.0, 2.75, 0.55, 0.25, 1.45, { cercles: [0.8] }),
  fermentation: () => cylindre(5.1, 1.1, 0.5, 1.0, 3.1, { cone: 0.55, pieds: true, cercles: [1.7, 2.4] })
    + cylindre(6.7, 1.1, 0.5, 1.0, 3.1, { cone: 0.55, pieds: true, cercles: [1.7, 2.4] })
    + tuyau([[5.1, 1.1, 3.1], [5.1, 1.1, 3.45], [6.7, 1.1, 3.45], [6.7, 1.1, 3.1]])
    + cylindre(5.1, 2.8, 0.5, 1.0, 3.1, { cone: 0.55, pieds: true, cercles: [1.7, 2.4] })
    + cylindre(6.7, 2.8, 0.5, 1.0, 3.1, { cone: 0.55, pieds: true, cercles: [1.7, 2.4] }),
  conditionnement: () => pave(9.2, 10.6, 0.7, 1.9, 0, 1.6, { lignes: [`M${pt(P(9.4, 1.9, 1.3))} L${pt(P(10.4, 1.9, 1.3))}`] })
    + pave(8.4, 11.6, 2.2, 2.8, 0, 0.75)
    + [8.8, 9.3, 9.8, 10.3, 10.8, 11.3].map((x) => cylindre(x, 2.5, 0.1, 0.75, 1.1)).join(''),
  accueil: () => pave(0.5, 3.5, 4.6, 7.4, 0, 1.9, {
    lignes: [
      `M${pt(P(1.0, 7.4, 0))} L${pt(P(1.0, 7.4, 1.25))} L${pt(P(1.8, 7.4, 1.25))} L${pt(P(1.8, 7.4, 0))}`,
      `M${pt(P(2.3, 7.4, 0.8))} L${pt(P(3.1, 7.4, 0.8))} L${pt(P(3.1, 7.4, 1.4))} L${pt(P(2.3, 7.4, 1.4))}Z`,
      `M${pt(P(3.5, 5.2, 0.8))} L${pt(P(3.5, 6.8, 0.8))} L${pt(P(3.5, 6.8, 1.4))} L${pt(P(3.5, 5.2, 1.4))}Z`,
    ],
  }),
  stockage: () => pave(4.4, 7.6, 4.4, 5.0, 0, 2.2, {
    lignes: [0.75, 1.5].map((z) => `M${pt(P(4.4, 5.0, z))} L${pt(P(7.6, 5.0, z))} L${pt(P(7.6, 4.4, z))}`),
  })
    + [[4.8, 6.3], [5.5, 6.3], [6.2, 6.3], [4.8, 7.1], [5.5, 7.1]].map(([x, y]) => cylindre(x, y, 0.3, 0, 0.8, { cercles: [0.15, 0.65] })).join('')
    + pave(6.6, 7.6, 6.6, 7.6, 0, 0.9, { lignes: [`M${pt(P(6.6, 7.6, 0.45))} L${pt(P(7.6, 7.6, 0.45))} L${pt(P(7.6, 6.6, 0.45))}`] }),
  livraison: () => pave(8.4, 11.6, 4.4, 4.9, 0, 0.6)
    + pave(8.8, 11.2, 5.4, 6.9, 0.3, 1.9, { lignes: [`M${pt(P(9.6, 6.9, 0.3))} L${pt(P(9.6, 6.9, 1.9))}`, `M${pt(P(10.4, 6.9, 0.3))} L${pt(P(10.4, 6.9, 1.9))}`] })
    + pave(11.2, 12.0, 5.5, 6.8, 0.3, 1.35, { lignes: [`M${pt(P(12.0, 5.7, 0.85))} L${pt(P(12.0, 6.6, 0.85))} L${pt(P(12.0, 6.6, 1.25))} L${pt(P(12.0, 5.7, 1.25))}Z`] })
    + [[9.3, 6.9], [10.9, 6.9], [11.7, 6.8]].map(([x, y]) => { const [cx, cy] = P(x, y, 0.3); return `<ellipse class="face face-roue" cx="${f(cx)}" cy="${f(cy)}" rx="${f(0.24 * S)}" ry="${f(0.3 * S)}"/>` + trait(`M${f(cx)} ${f(cy - 0.3 * S)} A${f(0.24 * S)} ${f(0.3 * S)} 0 1 0 ${f(cx)} ${f(cy + 0.3 * S)} A${f(0.24 * S)} ${f(0.3 * S)} 0 1 0 ${f(cx)} ${f(cy - 0.3 * S)}`); }).join(''),
};

/* Emprise au sol et position de l'étiquette de chaque zone. */
const emprises = {
  brassage: [0, 4, 0, 4, [2.0, 2.0, 2.9]], fermentation: [4, 8, 0, 4, [5.9, 2.0, 4.0]], conditionnement: [8, 12, 0, 4, [10.0, 1.6, 2.4]],
  accueil: [0, 4, 4, 8, [2.0, 6.0, 2.6]], stockage: [4, 8, 4, 8, [6.0, 6.0, 3.0]], livraison: [8, 12, 4, 8, [10.0, 6.2, 2.7]],
};
const ORDRE = ['brassage', 'fermentation', 'conditionnement', 'accueil', 'stockage', 'livraison'];

/**
 * @param {object} c contexte du gabarit (zones dans c.donnees.zones)
 * @param {object} o { actives: [cle], etiquettes: true, id, titre }
 */
export function plan(c, { actives = null, etiquettes = true, id = 'plan', titre = '', classe = '' } = {}) {
  const zones = Object.fromEntries(c.donnees.zones.map((z) => [z.cle, z]));
  const sol = [];
  for (let i = 0; i <= 12; i++) sol.push(`M${pt(P(i, 0))} L${pt(P(i, 8))}`);
  for (let j = 0; j <= 8; j++) sol.push(`M${pt(P(0, j))} L${pt(P(12, j))}`);
  const murs = trait(`M${pt(P(0, 8, 0))} L${pt(P(0, 8, 3.6))} L${pt(P(0, 0, 3.6))} L${pt(P(12, 0, 3.6))} L${pt(P(12, 0, 0))}`, 'trait trait-mur')
    + trait(`M${pt(P(0, 0, 0))} L${pt(P(0, 0, 3.6))}`, 'trait trait-mur');
  /* Cote le long du bord avant gauche du bâtiment. */
  const [c1x, c1y] = P(0, 8.9), [c2x, c2y] = P(12, 8.9);
  const cote = trait(`M${f(c1x)} ${f(c1y)} L${f(c2x)} ${f(c2y)} M${f(c1x)} ${f(c1y - 6)} L${f(c1x)} ${f(c1y + 6)} M${f(c2x)} ${f(c2y - 6)} L${f(c2x)} ${f(c2y + 6)}`, 'trait trait-cote');
  const lettres = [];
  const groupes = ORDRE.map((cle) => {
    const z = zones[cle];
    const [x0, x1, y0, y1, [lx, ly, lz]] = emprises[cle];
    const [ex, ey] = P(lx, ly, lz);
    const active = actives ? actives.includes(cle) : false;
    const etiquette = etiquettes ? `<use class="zone-cachet" href="#${id}-cachet" x="${f(ex + 8)}" y="${f(ey - 34)}" width="26" height="26"/>` : '';
    lettres.push({ cle, numero: z.numero, x: (ex + 320) / 800 * 100, y: (ey + 170) / 610 * 100, active });
    return `<g class="zone${active ? ' zone--active' : ''}" data-zone="${cle}">
      <path class="zone-sol" d="${poly([P(x0 + 0.08, y0 + 0.08), P(x1 - 0.08, y0 + 0.08), P(x1 - 0.08, y1 - 0.08), P(x0 + 0.08, y1 - 0.08)])}"/>
      <g class="zone-objets">${objets[cle]()}</g>${etiquette}
    </g>`;
  }).join('');
  const titreId = `${id}-titre`;
  return html`<div class="plan-cadre ${classe ? classe + '-cadre' : ''}"><svg class="plan ${classe}" viewBox="-320 -170 800 610" role="img" aria-labelledby="${titreId}" data-plan="${id}">
  <title id="${titreId}">${titre}</title>
  <defs><symbol id="${id}-cachet" viewBox="0 0 100 100"><path d="${brut(c.donnees.logo.capsule)}" fill="#b23a2e"/><circle cx="50" cy="50" r="36" fill="none" stroke="#f4efe6" stroke-width="5"/><path d="M33 51 L45 63 L68 38" fill="none" stroke="#f4efe6" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></symbol></defs>
  ${brut(`<g class="plan-sol">${sol.map((d) => `<path d="${d}"/>`).join('')}</g>`)}
  ${brut(murs + cote)}
  ${brut(groupes)}
</svg>${etiquettes ? brut(lettres.map((l) => `<span class="plan-lettre${l.active ? ' zone-active' : ''}" data-zone-lettre="${l.cle}" style="left:${f(l.x)}%;top:${f(l.y)}%" aria-hidden="true">${l.numero}</span>`).join('')) : ''}</div>`;
}
