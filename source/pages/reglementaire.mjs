/* Cadre réglementaire : tiré des pages « Réglementaire » et « Devoir de conseils » du site actuel.
   Barre de lecture et sommaire qui suit la lecture. Adresse de l'ACPR vérifiée sur acpr.banque-france.fr. */
import { html } from '../../outils/gabarit.mjs';
import { ouverture } from '../gabarits/sections.mjs';
import { recue } from '../gabarits/visuels.mjs';

export const page = { cle: 'reglementaire', fichier: 'reglementaire', sansAction: true, imagePartage: recue('reglementaire-ouverture') ? 'grok/reglementaire-ouverture-1168.webp' : null };

export default (c) => {
  const sections = c.donnees.reglementaire;
  return html`
<div data-barre-lecture aria-hidden="true"></div>
${ouverture(c, { forme: 'document', repere: c.t('reglementaire.repere'), titre: c.t('reglementaire.titre'), texte: c.t('reglementaire.texte'), image: 'reglementaire-ouverture', court: true, cachet: false, tampon: c.s('commun.tamponClasse') })}
<div class="texte-long conteneur" data-sans-visuel>
  <nav class="sommaire" data-sommaire aria-label="${c.s('commun.sommaire')}"><p class="sommaire-titre">${c.t('commun.sommaire')}</p><ul>${sections.map((s) => html`<li><a href="#${s.id}" data-sans-transition>${s.titre}</a></li>`)}</ul></nav>
  <div class="texte-long-corps">
  ${sections.map((s) => html`<section id="${s.id}" data-sans-visuel${s.aCompleter ? html` class="section-a-completer"` : ''}>
    <h2>${s.titre}</h2>
    ${s.paragraphes.map((p) => html`<p${s.aCompleter ? html` class="a-completer"` : ''}>${p}</p>`)}
    ${s.liste ? html`<ul class="liste-reglementaire">${s.liste.map((l) => html`<li>${l}</li>`)}</ul>` : ''}
    ${s.lienOrias ? html`<p><a class="lien-fleche" href="${c.site.liens.orias}" target="_blank" rel="noopener">${c.t('reglementaire.orias')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></p>` : ''}
    ${s.emailRgpd ? html`<p>${c.t('reglementaire.rgpdEcrire')} <a class="lien-email" href="mailto:${c.site.contact.emailRgpd}">${c.site.contact.emailRgpd}</a></p>` : ''}
  </section>`)}
  </div>
</div>
`;
};
