/* Politique de confidentialité : droits repris de la page RGPD du site actuel, le reste à compléter. */
import { html } from '../../outils/gabarit.mjs';
import { ouverture } from '../gabarits/sections.mjs';

export const page = { cle: 'confidentialite', fichier: 'confidentialite', sansAction: true, imagePartage: null };
const sections = ['responsable', 'donnees', 'finalites', 'duree', 'droits', 'cookies'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
${ouverture(c, { repere: c.t('confidentialite.repere'), titre: c.t('confidentialite.titre'), image: 'legal-ouverture', court: true, cachet: false })}
<div class="texte-long conteneur" data-sans-visuel>
  <nav class="sommaire" data-sommaire aria-label="${c.s('commun.sommaire')}"><p class="sommaire-titre">${c.t('commun.sommaire')}</p><ul>${sections.map((s) => html`<li><a href="#${s}" data-sans-transition>${c.t(`confidentialite.${s}.titre`)}</a></li>`)}</ul></nav>
  <div class="texte-long-corps">
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`confidentialite.${s}.titre`)}</h2><p${/compléter/.test(c.s(`confidentialite.${s}.texte`)) ? html` class="a-completer"` : ''}>${c.t(`confidentialite.${s}.texte`)}</p>${s === 'droits' ? html`<p><a class="lien-email" href="mailto:${c.site.contact.emailRgpd}">${c.site.contact.emailRgpd}</a></p>` : ''}</section>`)}
  </div>
</div>
`;
