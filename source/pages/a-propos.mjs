/* À propos : histoire (ADVISSUR et la marque BRASSERIEassur), façon de travailler, engagements, équipe à compléter. */
import { html } from '../../outils/gabarit.mjs';
import { ouverture, appel } from '../gabarits/sections.mjs';
import { image, repere, registre, recue } from '../gabarits/visuels.mjs';

export const page = { cle: 'a-propos', fichier: 'a-propos', imagePartage: recue('apropos-ouverture') ? 'grok/apropos-ouverture-1168.webp' : null };

export default (c) => html`
${ouverture(c, {
  repere: c.t('apropos.repere'), titre: c.t('apropos.titre'), texte: c.t('apropos.texte'), image: 'apropos-ouverture',
  action: c.lien('contact', { classe: 'bouton', texte: c.t('apropos.action'), attrs: 'data-action-principale data-magnetique' }),
  info: c.t('apropos.info'),
})}

<section class="facon conteneur" id="facon">
  <div class="facon-cote">
    ${repere('01', c.t('apropos.faconRepere'))}
    <h2 data-titre-anime>${c.t('apropos.faconTitre')}</h2>
    ${image(c, 'apropos-bureau', { classe: 'facon-media', sizes: '(max-width: 760px) 100vw, 40vw', ratio: '3 / 2' })}
  </div>
  <ol class="fiches">${c.donnees.cabinet.map((x, i) => html`<li class="fiche" data-anime>
    <p class="fiche-numero">${String(i + 1).padStart(2, '0')}</p>
    <h3>${x.titre}</h3>
    <p>${x.texte}</p>
  </li>`)}</ol>
</section>

<section class="engagements conteneur" id="engagements">
  ${registre(c, { classe: 'engagements-registre' })}
  <div class="engagements-texte">
    ${repere('02', c.t('apropos.engagementsRepere'))}
    <h2 data-titre-anime>${c.t('apropos.engagementsTitre')}</h2>
    <ul class="engagements-liste">${c.donnees.engagements.points.map((p) => html`<li data-anime><h3>${p.titre}</h3><p>${p.texte}</p></li>`)}</ul>
    <p data-anime>${c.lien('reglementaire', { classe: 'lien-fleche', texte: c.t('accueil.engagements.lien') })}</p>
  </div>
</section>

<section class="equipe conteneur" id="equipe">
  <div class="equipe-visuel" data-visuel role="img" aria-label="${c.s('apropos.equipeVisuel')}">
    ${[0, 1, 2].map((i) => html`<span class="portrait-vide" style="--i:${i}"><svg viewBox="0 0 100 125" aria-hidden="true"><circle cx="50" cy="44" r="20"/><path d="M14 125c4-30 18-44 36-44s32 14 36 44"/></svg></span>`)}
  </div>
  <div>
    ${repere('03', c.t('apropos.equipeRepere'))}
    <h2 data-titre-anime>${c.t('apropos.equipeTitre')}</h2>
    <p class="a-completer" data-anime>${c.t('apropos.equipeTexte')}</p>
  </div>
</section>

${appel(c)}
`;
