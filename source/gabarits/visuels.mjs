/* Composants visuels du projet BRASSERIEassur : images avec emplacement gardé, capsule, cachet,
   cotes, registre ORIAS, manomètre. Tout est dessiné à la génération : aucune image ne manque jamais. */
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, brut } from '../../outils/gabarit.mjs';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const dossierGrok = join(racine, 'assets/images/grok');
const presentes = () => (existsSync(dossierGrok) ? readdirSync(dossierGrok) : []);

/** Vrai si l'image Grok a été reçue et convertie (assets/images/grok/<nom>-<largeur>.webp). */
export const recue = (nom) => presentes().some((f) => new RegExp(`^${nom}-\\d+\\.webp$`).test(f));

/* Motifs dessinés en attendant l'image : traits de plan sur papier, selon le sujet de l'image. */
const MOTIFS = {
  cuves: '<path d="M120 250V120q0-34 40-34t40 34v130M220 250V100q0-30 36-30t36 30v150M110 250h200"/><path class="fin" d="M120 150h80M120 200h80M220 140h72M220 190h72"/>',
  futs: '<path d="M90 250v-70h50v70M160 250v-70h50v70M230 250v-70h50v70M90 180v-70h50v70M160 180v-70h50v70"/><path class="fin" d="M90 215h50M160 215h50M230 215h50M90 145h50M160 145h50"/>',
  plan: '<path d="M80 240l60-150 160 0-60 150z"/><path class="fin" d="M120 200h110M140 150h110M170 110l-40 100M230 110l-40 100"/>',
  cafe: '<path d="M110 250V110h180v140M110 150h180"/><path class="fin" d="M140 250v-60h40v60M220 190h50v30h-50z"/>',
  labo: '<path d="M120 250V130h18v120M160 250V110h18v140M200 250V140h18v110M240 250V120h18v130M100 250h190"/>',
  houblon: '<path d="M200 90q-40 40 0 90q40-50 0-90zM200 180q-50 30-10 80q50-20 10-80z"/><path class="fin" d="M200 90v170"/>',
  camion: '<path d="M80 230V140h150v90M230 230v-60h50l30 30v30M80 230h230"/><circle cx="120" cy="240" r="14"/><circle cx="270" cy="240" r="14"/>',
  chapiteau: '<path d="M80 250l40-120 80-40 80 40 40 120M120 130l80 0M200 90v160"/>',
  batiment: '<path d="M90 250V130l110-40 110 40v120z"/><path class="fin" d="M130 250v-60h40v60M220 170h50v40h-50z"/>',
  manometre: '<circle cx="200" cy="165" r="70"/><path d="M200 165l40-30"/><path class="fin" d="M150 200a60 60 0 1 1 100 0"/>',
  vestiaire: '<path d="M90 120h220M130 120v60M200 120v80M270 120v60M100 250h200"/><path class="fin" d="M120 250v-40h30v40M170 250v-40h30v40"/>',
  ligne: '<path d="M70 210h260v20H70z"/><path class="fin" d="M100 210v-50M140 210v-50M180 210v-50M220 210v-50M260 210v-50M300 210v-50"/>',
  palettes: '<path d="M90 250v-60h100v60M210 250v-60h100v60M90 190v-60h100v60"/><path class="fin" d="M90 220h100M210 220h100M90 160h100"/>',
  soudure: '<path d="M80 200q60-40 120 0t120 0"/><path class="fin" d="M90 210q55-35 110 0t110 0M80 190q60-40 120 0t120 0"/>',
  dossiers: '<path d="M100 250V110h80v140M190 250V100h80v150M110 140h60M200 130h60"/>',
  extincteur: '<path d="M180 250V130q0-20 20-20t20 20v120zM200 110V90h30"/><path class="fin" d="M180 180h40"/>',
  tablette: '<path d="M120 230V110h160v120z"/><path class="fin" d="M140 130h120v80H140z"/>',
  porte: '<path d="M120 250V90h120v160M240 250l50-20V110l-50-20"/><path class="fin" d="M140 110h80v120h-80z"/>',
  capsule: '<circle cx="200" cy="165" r="70"/><circle cx="200" cy="165" r="54" class="fin"/>',
};

/**
 * Image Grok ou, si elle n'est pas encore arrivée, son emplacement dessiné en code (jamais de cadre vide).
 * Les textes alternatifs et cadrages viennent de donnees/images.json.
 */
export function image(c, nom, { classe = '', sizes = '100vw', priorite = false, ratio, legende } = {}) {
  const info = c.donnees.images[nom] || {};
  const alt = info.alt || '';
  /* Version téléphone dédiée (grok/<nom>-mobile-<largeur>.webp) : c.media l'ajoute seule si elle existe ;
     sinon l'image d'ordinateur est recadrée par son point de cadrage. */
  if (recue(nom)) return c.media({ nom: `grok/${nom}`, alt, cadrage: info.cadrage || '50% 50%', cadrageMobile: info.cadrageMobile, sizes, priorite, classe, ratio, legende });
  const motif = MOTIFS[info.motif] || MOTIFS.cuves;
  return html`<figure class="media media-provisoire ${classe}" data-visuel data-image-attendue="grok/${nom}"${ratio ? brut(` style="aspect-ratio:${ratio}"`) : ''} role="img" aria-label="${alt}">
  <svg viewBox="0 0 400 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs><pattern id="q-${nom}" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" class="grille"/></pattern></defs>
    <rect width="400" height="330" fill="url(#q-${nom})"/>
    <g class="motif">${brut(MOTIFS[info.motif] ? motif : MOTIFS.cuves)}</g>
  </svg>
  <figcaption class="media-attente">${c.t('commun.imageAttente')}</figcaption>
</figure>`;
}

/* Capsule (21 dents) et monogramme, d'après le logotype provisoire. */
export function capsule(c, { classe = '', monogramme = true, titre = '' } = {}) {
  const L = c.donnees.logo;
  return html`<svg class="capsule ${classe}" viewBox="0 0 100 100"${titre ? html` role="img" aria-label="${titre}"` : brut(' aria-hidden="true" focusable="false"')}>
  <path class="capsule-dents" d="${brut(L.capsule)}" pathLength="1"/>
  <circle class="capsule-disque" cx="50" cy="50" r="38.5"/>
  <circle class="capsule-anneau" cx="50" cy="50" r="35" pathLength="1"/>
  ${monogramme ? brut(`<g class="capsule-monogramme"><path d="${L.B}"/><path d="${L.a}"/></g>`) : ''}
</svg>`;
}

/* Cachet rouge « Couvert » : capsule et texte en couronne. */
let nCachet = 0;
export function cachet(c, { classe = '', texte } = {}) {
  const L = c.donnees.logo;
  const arc = `arc-${++nCachet}`;
  const mot = texte || c.s('commun.cachet');
  return html`<svg class="cachet ${classe}" viewBox="0 0 120 120" aria-hidden="true" focusable="false" data-superpose data-audit-ignorer>
  <g transform="translate(10 10)"><path class="cachet-dents" d="${brut(L.capsule)}"/></g>
  <circle class="cachet-anneau" cx="60" cy="60" r="39"/>
  <path id="${arc}" d="M60 60m-30 0a30 30 0 1 1 60 0a30 30 0 1 1 -60 0" fill="none"/>
  <text class="cachet-texte"><textPath href="#${arc}" startOffset="0">${mot} · ${mot} · </textPath></text>
  <path class="cachet-coche" d="M48 61 L56 69 L73 51"/>
</svg>`;
}

/* Cote de dessin technique : trait, deux talons, libellé au centre. */
export const cote = (texte, classe = '') => html`<span class="cote ${classe}" aria-hidden="true"><span class="cote-trait"></span><span class="cote-texte">${texte}</span></span>`;

/* Repère de section : numéro et intitulé en écriture technique. */
export const repere = (numero, texte) => html`<p class="repere"><span class="repere-numero">${numero}</span><span class="repere-texte">${texte}</span></p>`;

/* Registre ORIAS : fiche dessinée, lignes du registre, tampon. */
export function registre(c, { classe = '' } = {}) {
  return html`<figure class="registre ${classe}" data-visuel>
  <div class="registre-tete">
    <span class="registre-etiquette">${c.t('commun.registre.etiquette')}</span>
    <span class="registre-numero">n° ${c.site.contact.orias}</span>
  </div>
  <p class="registre-titre">${c.t('commun.registre.titre')}</p>
  <ol class="registre-lignes">${c.donnees.engagements.orias.map((l, i) => html`<li style="--i:${i}"><span class="registre-case" aria-hidden="true"></span>${l}</li>`)}</ol>
  ${cachet(c, { classe: 'registre-cachet', texte: c.s('commun.registre.tampon') })}
  <figcaption class="registre-pied">${c.t('commun.registre.verifier')}</figcaption>
</figure>`;
}

/* Fût inox en élévation, coté : dessin de l'appel de fin des pages. */
export function fut(c, { classe = '' } = {}) {
  return html`<svg class="dessin ${classe}" viewBox="0 0 220 250" aria-hidden="true" focusable="false" data-visuel>
  <path class="remplissage" d="M52 56C48 100 48 160 52 200H148C152 160 152 100 148 56Z"/>
  <rect class="remplissage" x="48" y="30" width="104" height="26" rx="4"/><rect x="62" y="36" width="26" height="10" rx="5"/><rect x="112" y="36" width="26" height="10" rx="5"/>
  <rect class="remplissage" x="90" y="18" width="20" height="12" rx="2"/><path class="rouge" d="M96 18V12H104V18"/>
  <path d="M50 96Q100 104 150 96M50 104Q100 112 150 104M50 150Q100 158 150 150M50 158Q100 166 150 158"/>
  <path class="fin" d="M51 128Q100 134 149 128"/>
  <rect class="remplissage" x="48" y="200" width="104" height="22" rx="4"/>
  <path class="fin" d="M178 12V222M172 12H184M172 222H184M48 238H152M48 232V244M152 232V244"/>
  <text x="196" y="117" text-anchor="middle" transform="rotate(90 196 117)">${c.t('commun.futCote')}</text>
</svg>`;
}

/* Enveloppe cachetée : dessin de la page Contact. */
export function enveloppe(c, { classe = '' } = {}) {
  return html`<svg class="dessin ${classe}" viewBox="0 0 220 150" aria-hidden="true" focusable="false" data-visuel>
  <rect class="remplissage" x="10" y="22" width="180" height="112" rx="3"/>
  <path d="M10 25L100 88L190 25"/><path class="fin" d="M10 131L78 72M190 131L122 72"/>
  <circle class="rouge" cx="168" cy="44" r="20"/><circle class="rouge fin" cx="168" cy="44" r="14"/>
  <path class="rouge" d="M160 44L166 50L177 38"/>
  <path class="fin" d="M120 40q8 -6 16 0t16 0M120 50q8 -6 16 0t16 0"/>
</svg>`;
}

/* Manomètre du test d'éligibilité : aiguille pilotée par le script, zones « sur mesure » et « en ligne ». */
export function manometre(c) {
  const graduations = Array.from({ length: 31 }, (_, i) => {
    const a = (-120 + i * 8) * Math.PI / 180, r1 = i % 5 ? 70 : 64;
    return `M${(100 + Math.sin(a) * r1).toFixed(1)} ${(100 - Math.cos(a) * r1).toFixed(1)} L${(100 + Math.sin(a) * 78).toFixed(1)} ${(100 - Math.cos(a) * 78).toFixed(1)}`;
  }).join(' ');
  const arcZone = (deb, fin, r) => {
    const p = (d) => [(100 + Math.sin(d * Math.PI / 180) * r).toFixed(1), (100 - Math.cos(d * Math.PI / 180) * r).toFixed(1)];
    const [x1, y1] = p(deb), [x2, y2] = p(fin);
    return `M${x1} ${y1} A${r} ${r} 0 ${fin - deb > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };
  return html`<svg class="manometre" viewBox="0 0 200 170" role="img" aria-labelledby="mano-titre" data-visuel>
  <title id="mano-titre">${c.t('accueil.tpe.manoTitre')}</title>
  <circle class="mano-cadran" cx="100" cy="100" r="88"/>
  <path class="mano-zone mano-zone--mesure" d="${brut(arcZone(-120, 40, 84))}"/>
  <path class="mano-zone mano-zone--ligne" d="${brut(arcZone(40, 120, 84))}"/>
  <path class="mano-graduations" d="${brut(graduations)}"/>
  <text class="mano-libelle" text-anchor="middle"><tspan x="62" y="145">${c.t('accueil.tpe.manoMesure1')}</tspan><tspan x="62" y="158">${c.t('accueil.tpe.manoMesure2')}</tspan></text>
  <text class="mano-libelle mano-libelle--ligne" text-anchor="middle"><tspan x="138" y="146">${c.t('accueil.tpe.manoLigne1')}</tspan><tspan x="138" y="158">${c.t('accueil.tpe.manoLigne2')}</tspan></text>
  <g class="mano-aiguille" data-aiguille><path d="M100 100 L97 104 L100 30 L103 104 Z"/></g>
  <circle class="mano-axe" cx="100" cy="100" r="7"/>
</svg>`;
}
