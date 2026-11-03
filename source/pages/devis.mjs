/* Demande de devis : les champs du formulaire du site actuel, répartis en quatre étapes,
   récapitulatif en direct, orientation vers le devis en ligne (Orus) pour les TPE éligibles. */
import { html } from '../../outils/gabarit.mjs';
import { ouverture, appel } from '../gabarits/sections.mjs';
import { image, repere, capsule, cuve, cachet, recue } from '../gabarits/visuels.mjs';

export const page = { cle: 'devis', fichier: 'devis', imagePartage: recue('devis-ouverture') ? 'grok/devis-ouverture-1168.webp' : null };

const champ = (id, libelle, attrs = '', type = 'text') => html`<div class="champ"><label for="d-${id}">${libelle}</label><input id="d-${id}" name="${id}" type="${type}" ${attrs}></div>`;

export default (c) => {
  const orus = html`<a class="bouton" href="${c.site.liens.orus}" target="_blank" rel="noopener">${c.t('devis.eligibleLien')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span><span class="fleche-ext" aria-hidden="true">↗</span></a>`;
  const etapes = ['e1', 'e2', 'e3', 'e4'];
  return html`
${ouverture(c, {
  forme: 'devis', repere: c.t('devis.repere'), titre: c.t('devis.titre'), texte: c.t('devis.texte'), image: 'devis-ouverture',
  action: html`<a class="bouton" href="#formulaire" data-action-principale data-magnetique>${c.t('devis.action')}</a>`,
  info: c.t('devis.info'),
  court: true,
})}

<section class="devis conteneur" id="formulaire">
  <div class="section-tete">
    ${repere('01', c.t('devis.formRepere'))}
    <h2 data-titre-anime>${c.t('devis.formTitre')}</h2>
    <p data-anime>${c.t('devis.etapesAnnonce')}</p>
  </div>
  <div class="devis-grille">
    <form class="formulaire etapes-form" data-formulaire data-etapes action="#" novalidate>
      <ol class="etapes-progres" aria-hidden="true">${etapes.map((e, i) => html`<li data-progres="${i}"><span>${i + 1}</span><em class="etapes-libelle">${c.t(`devis.${e}`)}</em></li>`)}</ol>
      <div class="etapes-cadre" data-etapes-cadre>
        <fieldset class="etape-form" data-etape-form="0">
          <legend><span class="etape-compte">${c.t('devis.etape')} 1 ${c.t('devis.sur')} 4</span> ${c.t('devis.e1')}</legend>
          <div class="choix choix--cartes choix--metiers" role="radiogroup" aria-label="${c.s('devis.metier')}">
            ${c.donnees.metiers.map((m, i) => html`<label class="choix-option"><input type="radio" name="metier" value="${m.cle}"${i === 0 ? html` required` : ''}><span>${m.nom}</span></label>`)}
            <label class="choix-option"><input type="radio" name="metier" value="autre"><span>${c.t('devis.autre')}</span></label>
          </div>
        </fieldset>
        <fieldset class="etape-form" data-etape-form="1">
          <legend><span class="etape-compte">${c.t('devis.etape')} 2 ${c.t('devis.sur')} 4</span> ${c.t('devis.e2')}</legend>
          ${champ('adresse', c.t('devis.adresse'), 'autocomplete="street-address" required')}
          <div class="champ"><label for="d-occupation">${c.t('devis.occupation')}</label>
            <select id="d-occupation" name="occupation" required><option value="">—</option><option value="proprietaire">${c.t('devis.occProprio')}</option><option value="locataire">${c.t('devis.occLocataire')}</option><option value="autre">${c.t('devis.occAutre')}</option></select></div>
          <div class="champs-deux">
            ${champ('superficie', c.t('devis.superficie'), 'inputmode="numeric" min="0" required', 'number')}
            ${champ('contenu', c.t('devis.contenu'), 'inputmode="numeric" min="0"', 'number')}
          </div>
          <div class="champ"><label for="d-protections">${c.t('devis.protections')}</label><textarea id="d-protections" name="protections" rows="2"></textarea></div>
        </fieldset>
        <fieldset class="etape-form" data-etape-form="2">
          <legend><span class="etape-compte">${c.t('devis.etape')} 3 ${c.t('devis.sur')} 4</span> ${c.t('devis.e3')}</legend>
          ${champ('entreprise', c.t('devis.entreprise'), 'autocomplete="organization" required')}
          <div class="champs-deux">
            ${champ('ca', c.t('devis.ca'), 'inputmode="numeric" min="0" required', 'number')}
            ${champ('salaries', c.t('devis.salaries'), 'inputmode="numeric" min="0"', 'number')}
          </div>
          <div class="champ"><label for="d-activites">${c.t('devis.activites')}</label><textarea id="d-activites" name="activites" rows="3" required></textarea></div>
        </fieldset>
        <fieldset class="etape-form" data-etape-form="3">
          <legend><span class="etape-compte">${c.t('devis.etape')} 4 ${c.t('devis.sur')} 4</span> ${c.t('devis.e4')}</legend>
          <div class="champ"><label for="d-contrat">${c.t('devis.contrat')}</label><input id="d-contrat" name="contrat" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" data-max-mo="15" data-trop="${c.s('devis.fichierTrop')}" aria-describedby="d-contrat-aide"><p class="champ-aide" id="d-contrat-aide">${c.t('devis.contratAide')}</p></div>
          <div class="champs-deux">
            ${champ('email', c.t('devis.email'), 'autocomplete="email" required', 'email')}
            ${champ('tel', c.t('devis.tel'), 'autocomplete="tel" required', 'tel')}
          </div>
          <p class="mention-donnees">${c.tb('formulaire.donnees')}</p>
        </fieldset>
      </div>
      <div class="etapes-boutons">
        <button type="button" class="bouton bouton--contour" data-etape-precedente hidden>${c.t('devis.precedent')}</button>
        <button type="button" class="bouton" data-etape-suivante hidden>${c.t('devis.suivant')}</button>
        <button type="submit" class="bouton" data-etape-envoi>${c.t('devis.envoyer')}</button>
      </div>
      ${cachet(c, { classe: 'envoi-cachet', texte: c.s('commun.tamponSimule') })}
      <p data-message-envoi data-texte="${c.s('formulaire.simule')}" role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="recap recap--devis" data-recap-devis data-vide="${c.s('devis.recapVide')}">
      <div class="recap-visuel" data-visuel aria-hidden="true">${cuve(c, { classe: 'recap-cuve' })}<span class="recap-etape" data-recap-etape>1/4</span></div>
      <p class="recap-titre">${c.t('devis.recapTitre')}</p>
      <dl>
        <div><dt>${c.t('devis.e1')}</dt><dd data-recap="metier">${c.t('devis.recapVide')}</dd></div>
        <div><dt>${c.t('devis.superficie')}</dt><dd data-recap="superficie">${c.t('devis.recapVide')}</dd></div>
        <div><dt>${c.t('devis.ca')}</dt><dd data-recap="ca">${c.t('devis.recapVide')}</dd></div>
        <div><dt>${c.t('devis.entreprise')}</dt><dd data-recap="entreprise">${c.t('devis.recapVide')}</dd></div>
      </dl>
      <div class="recap-eligible" data-recap-eligible hidden role="status">
        <p>${c.t('devis.eligible')}</p>
        ${orus}
      </div>
    </aside>
  </div>
</section>

<section class="tpe tpe--devis" id="tpe">
  <div class="conteneur tpe-grille">
    <div class="tpe-visuel">${image(c, 'accueil-tpe', { classe: 'tpe-media', sizes: '(max-width: 760px) 100vw, 34vw', ratio: '4 / 5' })}</div>
    <div class="tpe-texte">
      ${repere('02', c.t('devis.tpeRepere'))}
      <h2 data-titre-anime>${c.t('devis.tpeTitre')}</h2>
      <p data-anime>${c.t('devis.tpeTexte')}</p>
      <p data-anime>${orus}</p>
      <ul class="puces-avantages"><li>${c.t('accueil.tpe.avantage1')}</li><li>${c.t('accueil.tpe.avantage2')}</li><li>${c.t('accueil.tpe.avantage3')}</li></ul>
    </div>
  </div>
</section>

${appel(c, { sansDevis: true })}
`;
};
