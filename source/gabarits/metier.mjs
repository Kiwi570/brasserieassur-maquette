/* Gabarit des pages métiers (brasseries, producteurs, négociants en gros, fabricants de matériel).
   Contenu : donnees/metiers.json, tiré des pages du site actuel. */
import { html } from '../../outils/gabarit.mjs';
import { ouverture, appel, autresMetiers } from './sections.mjs';
import { image, cachet, repere } from './visuels.mjs';
import { plan } from './plan.mjs';

const miniPlan = (c, m) => html`<figure class="mini-plan" data-visuel>
  ${plan(c, { actives: m.zones, id: `plan-${m.cle}`, titre: c.s('metier.planAlt'), classe: 'plan--mini' })}
  <figcaption><strong>${c.t('metier.planTitre')}</strong> ${m.planTexte || c.t('metier.planTexte')}</figcaption>
</figure>`;

const fiches = (c, points, { zones = true } = {}) => html`<ol class="fiches">${points.map((p, i) => html`<li class="fiche" data-anime${p.ancre ? html` id="${p.ancre}"` : ''}${zones && p.zone ? html` data-zone-lien="${p.zone}"` : ''}>
  <p class="fiche-numero">${String(i + 1).padStart(2, '0')}</p>
  <h3>${p.titre}</h3>
  <p>${p.texte}</p>
  ${cachet(c, { classe: 'fiche-cachet' })}
</li>`)}</ol>`;

export function pageMetier(c, cle) {
  const m = c.donnees.metiers.find((x) => x.cle === cle);
  const action = c.lien('devis', { params: `metier=${m.cle}`, classe: 'bouton', texte: m.actionDevis, attrs: 'data-action-principale data-magnetique' });
  let corps;

  if (cle === 'producteur') {
    corps = html`
<section class="responsabilites conteneur" id="responsabilites">
  <div class="section-tete">
    ${repere('01', c.t('metier.responsabilitesRepere'))}
    <h2 data-titre-anime>${m.pointsTitre}</h2>
    <p data-anime>${m.pointsIntro}</p>
  </div>
  <ol class="blocs">${m.points.map((p, i) => html`<li class="bloc${i % 2 ? ' bloc--inverse' : ''}">
    ${image(c, p.image, { classe: 'bloc-media', sizes: '(max-width: 760px) 100vw, 44vw', ratio: '3 / 2' })}
    <div class="bloc-texte">
      <p class="fiche-numero">${String(i + 1).padStart(2, '0')}</p>
      <h3 data-anime>${p.titre}</h3>
      <p data-anime>${p.texte}</p>
    </div>
  </li>`)}</ol>
</section>
<section class="points conteneur" id="garanties-liees">
  <div class="points-cote">
    ${repere('02', c.t('metier.garantiesRepere'))}
    <h2 data-titre-anime>${c.t('metier.lieesTitre')}</h2>
    <p data-anime>${m.lieesIntro}</p>
    ${miniPlan(c, m)}
  </div>
  <ul class="fiches">${m.liees.map((l, i) => html`<li class="fiche" data-anime>
    <p class="fiche-numero">${String(i + 1).padStart(2, '0')}</p>
    <h3>${l.titre}</h3>
    <p>${l.texte}</p>
    <p>${c.lien(l.page, { ancre: l.ancre, classe: 'lien-fleche', texte: html`${c.t('metier.lieesVoir')}<span class="visuellement-cache"> : ${l.titre}</span>` })}</p>
  </li>`)}</ul>
</section>`;
  } else if (cle === 'fabricant') {
    corps = html`
<section class="legales conteneur" id="garanties-legales">
  <div class="section-tete">
    ${repere('01', c.t('metier.legalesRepere'))}
    <h2 data-titre-anime>${m.legalesTitre}</h2>
  </div>
  <div class="legales-grille">
    ${image(c, 'fabricants-conformite', { classe: 'legales-media', sizes: '(max-width: 760px) 100vw, 40vw', ratio: '3 / 2' })}
    <ol class="fiches fiches--legales">${m.legales.map((g, i) => html`<li class="fiche" data-anime>
      <p class="fiche-numero">${String(i + 1).padStart(2, '0')}</p>
      <h3>${g.titre}</h3>
      <p>${g.texte}</p>
      <p class="fiche-reference">${g.reference}</p>
      ${g.note ? html`<p class="note-valider"><strong>${c.t('metier.note')}</strong> ${g.note}</p>` : ''}
    </li>`)}</ol>
  </div>
</section>
<section class="points conteneur" id="assurances">
  <div class="points-cote">
    ${repere('02', c.t('metier.assurancesRepere'))}
    <h2 data-titre-anime>${m.pointsTitre}</h2>
    <p data-anime>${m.pointsIntro}</p>
    ${miniPlan(c, m)}
  </div>
  ${fiches(c, m.points)}
</section>
<section class="montage conteneur" id="montage">
  <div class="montage-tete">
    ${repere('03', c.t('metier.montageRepere'))}
    <h2 data-titre-anime>${m.montage.titre}</h2>
    <p class="montage-definition" data-anime>${m.montage.definition}</p>
  </div>
  ${image(c, 'fabricants-montage', { classe: 'montage-media', sizes: '(max-width: 760px) 100vw, 44vw', ratio: '3 / 2' })}
  <div class="montage-avantages">
    <h3 data-anime>${m.montage.avantagesTitre}</h3>
    <ul class="avantages">${m.montage.avantages.map((a) => html`<li data-anime><strong>${a.titre}</strong> ${a.texte}</li>`)}</ul>
    <h3 data-anime>${m.montage.souscrireTitre}</h3>
    <p data-anime>${m.montage.souscrire}</p>
    <p class="montage-resume" data-anime>${m.resume}</p>
  </div>
</section>`;
  } else {
    corps = html`
<section class="points conteneur" id="points">
  <div class="points-cote">
    ${repere('01', c.t('metier.assurancesRepere'))}
    <h2 data-titre-anime>${m.pointsTitre}</h2>
    <p data-anime>${m.pointsIntro}</p>
    ${miniPlan(c, m)}
  </div>
  ${fiches(c, m.points)}
</section>
<section class="resume conteneur" id="resume">
  ${image(c, m.resumeImage, { classe: 'resume-media', sizes: '(max-width: 760px) 100vw, 46vw', ratio: '3 / 2' })}
  <div class="resume-texte">
    ${repere('02', c.t('metier.resumeRepere'))}
    <h2 data-titre-anime>${m.resumeTitre}</h2>
    <p data-anime>${m.resume}</p>
    <p data-anime>${c.lien('devis', { params: `metier=${m.cle}`, classe: 'bouton', texte: m.actionDevis })}</p>
  </div>
</section>`;
  }

  return html`
${ouverture(c, { repere: html`${c.t('metier.repere')} ${m.numero}`, titre: m.titre, texte: m.chapo, action, info: m.infoCle, image: m.ouverture, cachet: true })}
${corps}
${autresMetiers(c, m.cle)}
${appel(c)}
`;
}
