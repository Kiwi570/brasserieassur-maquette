/* Mentions légales : fiche à fournir par le client, éditeur, hébergeur (adresse vérifiée sur vercel.com), crédits. */
import { html } from '../../outils/gabarit.mjs';
import { ouverture } from '../gabarits/sections.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', sansAction: true, imagePartage: null };
const sections = ['fiche', 'editeur', 'hebergeur', 'credits'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
${ouverture(c, { forme: 'sobre', repere: c.t('mentions.repere'), titre: c.t('mentions.titre'), image: 'legal-ouverture', court: true, cachet: false, tampon: c.s('commun.tamponClasse') })}
<div class="texte-long conteneur" data-sans-visuel>
  <nav class="sommaire" data-sommaire aria-label="${c.s('commun.sommaire')}"><p class="sommaire-titre">${c.t('commun.sommaire')}</p><ul>${sections.map((s) => html`<li><a href="#${s}" data-sans-transition>${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
  <div class="texte-long-corps">
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel${s === 'fiche' ? html` class="fiche-a-fournir"` : ''}><h2>${c.t(`mentions.${s}.titre`)}</h2><p${s === 'fiche' ? html` class="a-completer"` : ''}>${c.t(`mentions.${s}.texte`)}</p></section>`)}
  </div>
</div>
`;
