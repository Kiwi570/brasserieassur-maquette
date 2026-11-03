/* Sections partagées entre les pages : ouverture des pages intérieures, appel final, autres métiers. */
import { html, brut } from '../../outils/gabarit.mjs';
import { image, cachet, cote, repere, capsule, fut } from './visuels.mjs';
import { FORMES, AVEC_TEXTE, texteOuverture } from './ouvertures.mjs';

/**
 * Ouverture d'une page intérieure : texte et action à gauche, image dans un cadre de plan à droite.
 * La cote décrit l'image (donnees/images.json, champ « cote ») ; le cachet n'est posé que sur les pages métiers.
 * @param {object} o { repere, titre, texte, action: html, info, image, cote, court, cachet, tampon (mot du tampon près du titre), decor (html posé dans le cadre) }
 */
export function ouverture(c, o) {
  const forme = o.forme && FORMES[o.forme] ? o.forme : '';
  if (forme) {
    const texte = texteOuverture(c, o);
    return html`<section class="page-tete page-tete--${forme}${o.court ? ' page-tete--court' : ''}" id="debut" data-forme="${forme}">
  ${AVEC_TEXTE.has(forme) ? FORMES[forme](c, o, texte) : html`${texte}
  ${FORMES[forme](c, o)}`}
</section>`;
  }
  return html`<section class="page-tete${o.court ? ' page-tete--court' : ''}" id="debut">
  ${texteOuverture(c, o)}
  <div class="cadre-plan page-tete-cadre" data-cadre>
    ${cote(o.cote || (c.donnees.images[o.image] || {}).cote || o.repere, 'cadre-cote')}
    <div class="cadre-image" data-encre>${image(c, o.image, { classe: 'page-tete-media', priorite: true, sizes: '(max-width: 760px) 100vw, 46vw' })}</div>
    <span class="cadre-repere cadre-repere--hg" aria-hidden="true"></span><span class="cadre-repere cadre-repere--bd" aria-hidden="true"></span>
    ${o.decor || ''}
    ${o.cachet === true ? cachet(c, { classe: 'cadre-cachet' }) : ''}
  </div>
</section>`;
}

/* Appel final de chaque page : devis, rendez-vous. Bande papier entre le contenu et le pied bleu nuit
   (l'e-mail est déjà dans le pied de page). */
export function appel(c, { sansRdv = false, sansDevis = false } = {}) {
  return html`<section class="appel" id="appel">
  <div class="conteneur appel-grille">
    ${fut(c, { classe: 'appel-dessin' })}
    <div class="appel-tete">
      ${repere('', c.t('commun.appel.repere'))}
      <h2 class="appel-titre" data-titre-anime>${c.t('commun.appel.titre')}</h2>
    </div>
    <div class="appel-texte">
      <p data-anime>${c.t('commun.appel.texte')}</p>
      <p class="appel-actions" data-anime>
        ${sansDevis ? '' : c.lien('devis', { classe: 'bouton', texte: c.t('commun.appel.devis'), attrs: 'data-magnetique' })}
        ${sansRdv ? '' : c.lien('services', { ancre: 'rendez-vous', classe: sansDevis ? 'bouton' : 'bouton bouton--contour', texte: c.t('commun.appel.rdv') })}
      </p>
    </div>
  </div>
</section>`;
}

/* Les autres métiers, avec leur image : relie les pages entre elles. */
export function autresMetiers(c, cleCourante) {
  const autres = c.donnees.metiers.filter((m) => m.page && m.cle !== cleCourante);
  return html`<section class="autres conteneur" id="autres-metiers">
  <div class="section-tete">
    ${repere('', c.t('commun.autres.repere'))}
    <h2 data-anime>${c.t('commun.autres.titre')}</h2>
  </div>
  <ul class="autres-liste">${autres.map((m, i) => html`<li class="autre" data-anime style="--delai:${i * 80}ms">
    <a href="${c.url(m.page)}" data-libelle="${c.libelle(m.page)}" class="autre-lien" data-incline>
      ${image(c, m.image, { classe: 'autre-media', sizes: '(max-width: 760px) 80vw, 26vw', ratio: '4 / 3' })}
      <span class="autre-numero">${m.numero}</span>
      <span class="autre-nom">${m.nom}</span>
      <span class="autre-question">${m.question}</span>
      <span class="autre-voir">${c.t('commun.autres.voir')}<span aria-hidden="true"> →</span></span>
    </a>
  </li>`)}</ul>
</section>`;
}

export { repere, cote, cachet, image, capsule };
