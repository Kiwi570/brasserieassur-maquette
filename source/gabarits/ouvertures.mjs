/* Ouvertures des pages : une mise en scène par page, liée à son métier.
   Chaque forme reçoit le bloc de texte commun (repère, titre, chapô, action, information clé) et pose son visuel.
   Les éléments animés portent data-tete-anime : leur état de départ est posé par le script (rien de caché sans JavaScript),
   leur état final est l'état normal de la page. */
import { html, brut } from '../../outils/gabarit.mjs';
import { image, cachet, cote, repere, cuve as petiteCuve, enveloppe } from './visuels.mjs';

export function texteOuverture(c, o, { classe = '' } = {}) {
  return html`<div class="page-tete-texte ${classe}">
    ${repere('', o.repere)}
    <h1 class="page-titre" data-titre-anime data-anime="gsap">${o.titre}</h1>
    ${o.tampon ? cachet(c, { classe: 'titre-cachet', texte: o.tampon }) : ''}
    ${o.texte ? html`<p class="page-chapo" data-anime="gsap">${o.texte}</p>` : ''}
    ${o.action ? html`<div class="page-actions" data-anime="gsap">${o.action}</div>` : ''}
    ${o.info ? html`<p class="page-info" data-info-cle data-anime="gsap">${o.info}</p>` : ''}
  </div>`;
}

const photo = (c, o, sizes) => image(c, o.image, { classe: 'page-tete-media', priorite: true, sizes });

/* ---------- Brasseries : la photo dans la silhouette d'un fermenteur, qui se remplit. */
const CUVE = 'M8 15 C 12 7, 30 3, 50 3 C 70 3, 88 7, 92 15 L 92 66 L 57 88 L 57 93 L 43 93 L 43 88 L 8 66 Z';
function cuve(c, o) {
  const graduations = [20, 32, 44, 56].map((y, i) => `<path d="M95 ${y}H${i % 2 ? 98 : 99.5}"/>`).join('');
  return html`<div class="tete-cuve" data-cadre>
  <div class="tete-cuve-scene">
    <div class="tete-cuve-corps" data-tete-anime>${photo(c, o, '(max-width: 860px) 70vw, 34vw')}<span class="tete-cuve-mousse" aria-hidden="true" data-tete-anime></span></div>
    <svg class="tete-cuve-trait" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path class="tct-corps" d="${brut(CUVE)}" pathLength="1" data-tete-anime/>
      <path class="tct-detail" d="M8 25H92M8 46H92M8 66H92M14 66L10 100M86 66L90 100M38 92.5L30 100M62 92.5L70 100" pathLength="1" data-tete-anime/>
      <path class="tct-niveau" d="M95 14V64" data-tete-anime/>
      <g class="tct-graduations" data-tete-anime>${brut(graduations)}</g>
    </svg>
    <p class="tete-cuve-niveau" aria-hidden="true" data-tete-anime><span>${c.s('ouvertures.niveau')}</span> <strong data-niveau>100</strong> %</p>
  </div>
  ${cote(c.s('ouvertures.cuveCote'), 'cadre-cote tete-cuve-cote')}
  ${o.cachet ? cachet(c, { classe: 'cadre-cachet' }) : ''}
</div>`;
}

/* ---------- Producteurs : composition d'étiquette de bouteille, photo en médaillon. */
function etiquette(c, o, texte) {
  const id = 'med-arc';
  return html`<div class="tete-etiquette" data-tete-anime>
  <p class="etiquette-bandeau" aria-hidden="true"><span>${c.s('ouvertures.etiquetteHaut')}</span></p>
  ${texte}
  <p class="etiquette-pied" aria-hidden="true"><span>${c.s('ouvertures.etiquetteBas')}</span></p>
</div>
<div class="tete-medaillon" data-cadre>
  <div class="medaillon-photo" data-tete-anime>${photo(c, o, '(max-width: 860px) 60vw, 30vw')}</div>
  <svg class="medaillon-anneau" viewBox="0 0 200 200" aria-hidden="true" focusable="false" data-audit-ignorer data-tete-anime>
    <circle class="ma-cercle" cx="100" cy="100" r="97" pathLength="1"/>
    <circle class="ma-cercle ma-cercle--fin" cx="100" cy="100" r="80" pathLength="1"/>
    <path id="${id}" d="M100 100m-88 0a88 88 0 1 1 176 0a88 88 0 1 1 -176 0" fill="none"/>
    <text class="ma-texte"><textPath href="#${id}">${c.s('ouvertures.medaillon')}</textPath></text>
  </svg>
  ${o.cachet ? cachet(c, { classe: 'cadre-cachet medaillon-cachet' }) : ''}
</div>`;
}

/* ---------- Négociants : grand quai de chargement, le rideau métallique se lève sur l'entrepôt. */
function rideau(c, o) {
  return html`<div class="tete-quai" data-cadre>
  <p class="quai-panneau" aria-hidden="true" data-tete-anime><span>${c.s('ouvertures.quai')}</span> <strong>04</strong></p>
  <div class="quai-porte">
    ${photo(c, o, '(max-width: 860px) 100vw, 1280px')}
    <span class="quai-rideau" aria-hidden="true" data-tete-anime><span class="quai-poignee"></span></span>
  </div>
  <span class="quai-seuil" aria-hidden="true"><span class="quai-butoir"></span><span class="quai-butoir"></span></span>
  ${o.cachet ? cachet(c, { classe: 'cadre-cachet quai-cachet' }) : ''}
</div>`;
}

/* ---------- Fabricants : planche technique sur fond de plan bleu, la photo passe au scanner. */
function planBleu(c, o) {
  const reperes = c.s('ouvertures.planReperes').split('|');
  const pos = [[22, 30, -1], [70, 22, 1], [58, 74, 1]];
  return html`<div class="tete-planche" data-cadre>
  <div class="planche-cadre">
    <div class="planche-photo" data-tete-anime>${photo(c, o, '(max-width: 860px) 100vw, 50vw')}</div>
    <span class="planche-scan" aria-hidden="true" data-tete-anime></span>
    <span class="cadre-repere cadre-repere--hg" aria-hidden="true"></span><span class="cadre-repere cadre-repere--bd" aria-hidden="true"></span>
    <ul class="planche-reperes" aria-hidden="true" data-audit-ignorer>${reperes.map((r, i) => html`<li class="planche-repere planche-repere--${pos[i][2] < 0 ? 'g' : 'd'}" style="--x:${pos[i][0]}%;--y:${pos[i][1]}%" data-tete-anime><span class="pr-point"></span><span class="pr-ligne"></span><span class="pr-texte"><em>${String.fromCharCode(65 + i)}</em> ${r}</span></li>`)}</ul>
  </div>
  <p class="planche-cartouche" aria-hidden="true" data-tete-anime><span>${c.s('ouvertures.planche')}</span><span>${c.s('ouvertures.echelle')}</span></p>
  ${o.cachet ? cachet(c, { classe: 'cadre-cachet' }) : ''}
</div>`;
}

/* ---------- Services : les trois services en mosaïque de photos, qui s'assemblent. */
function mosaique(c, o) {
  const s = c.donnees.services;
  return html`<div class="tete-mosaique" data-cadre>
  ${s.map((x, i) => html`<div class="mosaique-tuile mosaique-tuile--${i + 1}" data-tete-anime>
    ${image(c, x.image, { classe: 'mosaique-media', priorite: i === 0, sizes: i === 0 ? '(max-width: 860px) 60vw, 28vw' : '(max-width: 860px) 40vw, 20vw' })}
    <span class="mosaique-etiquette" aria-hidden="true"><em>${String(i + 1).padStart(2, '0')}</em> ${x.nom}</span>
  </div>`)}
  ${cote(c.s('ouvertures.mosaiqueCote'), 'cadre-cote mosaique-cote')}
</div>`;
}

/* ---------- Devis : pas de grande photo ; la cuve de la demande en grand, avec ses quatre étapes. */
function devis(c, o) {
  return html`<div class="tete-devis" data-cadre>
  <div class="tete-devis-cuve" data-tete-anime>${petiteCuve(c, { classe: 'tete-devis-dessin' })}</div>
  <ol class="tete-devis-etapes" aria-hidden="true">${['e1', 'e2', 'e3', 'e4'].map((e, i) => html`<li data-tete-anime><span>${i + 1}</span>${c.t(`devis.${e}`)}</li>`)}</ol>
</div>`;
}

/* ---------- À propos : mise en page de magazine, grande typo, photo en colonne étroite, citation. */
function magazine(c, o) {
  return html`<p class="magazine-numero" aria-hidden="true" data-tete-anime><span>${c.s('ouvertures.magazine')}</span><span>${c.s('ouvertures.magazineNumero')}</span></p>
<figure class="magazine-colonne" data-cadre>
  <div class="magazine-photo" data-tete-anime>${photo(c, o, '(max-width: 860px) 100vw, 26vw')}</div>
</figure>`;
}

/* ---------- Réglementaire : document officiel, titre tapé à la machine, tampon, photo agrafée. */
function documentOfficiel(c, o, texte) {
  return html`<div class="tete-document" data-tete-anime>
  <p class="document-entete" aria-hidden="true"><span>${c.s('commun.marqueB')}<em>${c.s('commun.marqueA')}</em></span><span>${c.s('ouvertures.documentRef')}</span></p>
  ${texte}
  <p class="document-pied" aria-hidden="true"><span>${c.s('ouvertures.documentPied')}</span><span>${c.s('ouvertures.documentPage')}</span></p>
  <div class="document-agrafe" data-cadre>
    <div class="document-photo" data-tete-anime>${photo(c, o, '(max-width: 860px) 40vw, 18vw')}</div>
    <svg class="document-trombone" viewBox="0 0 24 64" aria-hidden="true" focusable="false"><path d="M8 50V10a6 6 0 0 1 12 0v40a9 9 0 0 1-18 0V16"/></svg>
  </div>
</div>`;
}

/* ---------- Contact : plan de quartier dessiné, épingle sur le cabinet, carte postale. */
function quartier(c, o) {
  const rues = ['M-10 150C150 140 300 172 610 128', 'M140 -10L162 490', 'M318 -10L300 490', 'M470 -10C458 150 492 300 470 490', 'M-10 432L610 84', 'M-10 322C200 300 400 342 610 308'];
  return html`<div class="tete-quartier" data-cadre>
  <svg class="quartier-plan" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs><pattern id="qp-hachures" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V8" class="qp-hachure"/></pattern></defs>
    <rect class="qp-ilots" width="600" height="480"/>
    <rect class="qp-ilots-hachures" width="600" height="480" fill="url(#qp-hachures)"/>
    <path class="qp-parc" d="M178 178h108c8 0 12 4 12 12v86c0 8-4 12-12 12H178c-8 0-12-4-12-12v-86c0-8 4-12 12-12Z"/>
    <path class="qp-canal" d="M-10 470C150 440 400 482 610 442"/>
    <g class="qp-rues">${brut(rues.map((d) => `<path class="qp-rue-bord" d="${d}" pathLength="1"/>`).join(''))}${brut(rues.map((d) => `<path class="qp-rue" d="${d}" pathLength="1"/>`).join(''))}</g>
    <mask id="qp-masque" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="480"><path class="qp-trajet-masque" d="M70 404C120 364 196 336 236 306S294 268 309 258" pathLength="1"/></mask>
    <path class="qp-trajet" d="M70 404C120 364 196 336 236 306S294 268 309 258" mask="url(#qp-masque)"/>
    <g class="qp-epingle"><path d="M309 253C296 236 285 224 285 211A24 24 0 1 1 333 211C333 224 322 236 309 253Z"/><circle cx="309" cy="211" r="8"/></g>
    <text class="qp-legende" x="342" y="204">${c.s('ouvertures.quartierCabinet')}</text>
    <text class="qp-coord" x="342" y="224">X 309 · Y 253</text>
  </svg>
  <div class="quartier-enveloppe" data-tete-anime>${enveloppe(c, { classe: 'quartier-dessin' })}</div>
  <div class="quartier-carte" data-tete-anime>${photo(c, o, '(max-width: 860px) 50vw, 18vw')}</div>
  ${cote(c.s('ouvertures.quartierCote'), 'cadre-cote quartier-cote')}
</div>`;
}

/* ---------- Blog : une de journal, l'article à la une. */
function journal(c, o) {
  const a = c.donnees.articles[0];
  return html`<p class="journal-titre-une" aria-hidden="true" data-tete-anime><span>${c.s('ouvertures.journal')}</span></p>
<p class="journal-filet" aria-hidden="true" data-tete-anime><span>${c.s('ouvertures.journalNumero')}</span><span><time datetime="${a.date}">${a.dateTexte}</time></span><span>${c.s('ouvertures.journalSujet')}</span></p>
<figure class="journal-une" data-cadre>
  <div class="journal-photo" data-tete-anime>${photo(c, o, '(max-width: 860px) 100vw, 52vw')}</div>
  <figcaption class="journal-legende" data-tete-anime><span class="journal-rubrique">${c.s('ouvertures.journalUne')}</span> ${a.titre}</figcaption>
</figure>`;
}

/* ---------- Article : le titre sur une grande photo, barre de lecture couleur bière. */
function article(c, o) {
  return html`<div class="article-fond" aria-hidden="true">
  <div class="article-photo" data-tete-anime>${photo(c, o, '100vw')}</div>
  <span class="article-voile"></span>
</div>`;
}

/* ---------- Pages légales : sobres, sans grande photo ; un filet coté sous le titre. */
function sobre(c, o) {
  return html`<div class="tete-sobre" data-cadre>${cote(c.s('ouvertures.sobreCote'), 'cadre-cote sobre-cote')}</div>`;
}

/* ---------- 404 : la cuve vide en plein écran, une lampe tourne à l'intérieur. */
function cuveVide(c, o) {
  return html`<div class="vide-fond" aria-hidden="true">
  <div class="vide-photo" data-tete-anime>${photo(c, o, '100vw')}</div>
  <span class="lumiere-cuve vide-lumiere" data-tete-anime></span>
  <span class="vide-voile"></span>
  <span class="vide-chiffres" data-audit-ignorer data-tete-anime>404</span>
</div>`;
}

export const FORMES = { cuve, etiquette, rideau, 'plan-bleu': planBleu, mosaique, devis, magazine, document: documentOfficiel, quartier, journal, article, sobre, 'cuve-vide': cuveVide };
/* Formes qui reçoivent le texte pour le placer elles-mêmes. */
export const AVEC_TEXTE = new Set(['etiquette', 'document']);
