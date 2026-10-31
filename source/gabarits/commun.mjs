/* Gabarit commun BRASSERIEassur : head, intro (compas et capsule), en-tête, menu, pied de page,
   barre fixe du téléphone, voile. Conventions data-* du socle conservées (voir socle/README.md). */
import { html, brut } from '../../outils/gabarit.mjs';
import { capsule, cachet } from './visuels.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle]);

const marque = (c, classe = '') => html`<span class="marque ${classe}"><span class="marque-b">${c.s('commun.marqueB')}</span><span class="marque-a">${c.s('commun.marqueA')}</span></span>`;

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

function intro(c) {
  /* Compas : pointe sèche au centre, mine sur le cercle ; le groupe tourne autour du centre. */
  return html`<div class="ouverture-panneau" data-ouverture data-gouttiere="${c.site.couleurs.ouverture}" aria-hidden="true">
  <div class="ouverture-scene">
    <div class="ouverture-dessin">
      <svg class="ouverture-guide" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47"/><path d="M50 0V100M0 50H100"/></svg>
      ${capsule(c, { classe: 'ouverture-capsule' })}
      <svg class="ouverture-compas" viewBox="0 0 100 100" aria-hidden="true">
        <g class="compas"><path class="compas-jambe" d="M50 50 L72 22"/><path class="compas-jambe" d="M72 22 L97 50"/><circle class="compas-tete" cx="72" cy="22" r="3.4"/><path class="compas-poignee" d="M72 18.6 L74 12"/><circle class="compas-pointe" cx="50" cy="50" r="1.4"/></g>
      </svg>
      ${cachet(c, { classe: 'ouverture-cachet' })}
    </div>
    <p class="ouverture-nom">${marque(c)}</p>
    <p class="ouverture-ligne"><span class="ouverture-trait"></span><span class="ouverture-ligne-texte">${c.t('commun.introLigne')}</span></p>
  </div>
</div>`;
}

function entete(c) {
  const a = c.site.actionEntete;
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}" aria-label="${c.s('commun.accueilLogo')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img src="/assets/images/logo.svg" alt="" width="40" height="40" data-logo-entete>${marque(c)}
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k, { classe: 'nav-lien' })}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      ${a ? html`<a class="bouton bouton--entete" href="${c.url(a.page)}" data-libelle="${c.libelle(a.page)}"><span class="long">${c.t('commun.actionEntete')}</span><span class="court">${c.t('commun.actionEnteteCourt')}</span></a>` : ''}
      <button type="button" data-menu-bouton popovertarget="menu" aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span class="menu-icone" aria-hidden="true"><span></span><span></span></span><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu popover role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <div class="menu-groupe">
      <p class="menu-titre">${c.t('commun.menuMetiers')}</p>
      <ul>${c.site.menu.metiers.map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
    </div>
    <div class="menu-groupe">
      <p class="menu-titre">${c.t('commun.menuCabinet')}</p>
      <ul>${c.site.menu.cabinet.map((k, i) => html`<li style="--i:${i + 4}">${c.lien(k, { classe: 'menu-lien menu-lien--petit' })}</li>`)}</ul>
    </div>
  </div>
  <div class="menu-pied">
    <a class="bouton" href="${c.url('devis')}" data-libelle="${c.libelle('devis')}">${c.t('commun.actionEntete')}</a>
    <a class="menu-email" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a>
    <button type="button" class="bouton bouton--contour-clair menu-fermer-sansjs" popovertarget="menu" popovertargetaction="hide">${c.t('commun.fermer')}</button>
    <button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button>
  </div>
</div>`;
}

function pied(c) {
  const liste = (cles) => html`<ul>${cles.map((k) => html`<li>${c.lien(k)}</li>`)}</ul>`;
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-grille">
    <div class="pied-marque">
      <img src="/assets/images/logo-clair.svg" alt="" width="64" height="64">
      <p class="pied-nom">${marque(c)}</p>
      <p>${c.t('commun.pied.activite')}</p>
      <p><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
      <p class="pied-orias">${c.t('commun.pied.orias', { n: c.site.contact.orias })} <a href="${c.site.liens.orias}" target="_blank" rel="noopener">${c.t('commun.pied.oriasLien')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></p>
    </div>
    <nav aria-label="${c.s('commun.menuMetiers')}"><p class="pied-titre">${c.t('commun.menuMetiers')}</p>${liste(c.site.menu.metiers)}</nav>
    <nav aria-label="${c.s('commun.menuCabinet')}"><p class="pied-titre">${c.t('commun.menuCabinet')}</p>${liste(c.site.menu.cabinet)}</nav>
    <div>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas">
    <p>${c.t('commun.maquette')}</p>
    <ul><li>${c.lien('mentions-legales')}</li><li>${c.lien('confidentialite')}</li></ul>
    <p>${c.t('commun.pied.copyright')}</p>
  </div>
</footer>`;
}

function barre(c) {
  const a = c.site.actionEntete;
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="mailto:${c.site.contact.email}">${c.t('commun.ecrire')}</a>
  ${a ? html`<a class="bouton" href="${c.url(a.page)}" data-libelle="${c.libelle(a.page)}">${c.t('commun.actionEnteteCourt')}</a>` : ''}
</div>`;
}

function voile(c) {
  return html`<div data-voile data-gouttiere="${c.site.couleurs.voile}" aria-hidden="true"><div class="voile-contenu">
  ${capsule(c, { classe: 'voile-capsule' })}
  <span class="voile-cote"><span class="voile-cote-trait"></span></span>
  <span class="voile-vers">${c.t('commun.voileVers')}</span>
  <span data-voile-libelle>${c.libelle(c.page.cle)}</span>
</div></div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-page="${c.page.cle}"${c.site.curseur ? brut(' data-curseur') : ''}>
${tete(c)}
<body id="haut">
${voile(c)}
${intro(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}
