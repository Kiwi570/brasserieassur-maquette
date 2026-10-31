/* Services sur rendez-vous : audit assurances, visite de risques, digitalisation (site actuel),
   demande de rendez-vous simulée avec calendrier (jours passés non proposés, calculés à la date réelle). */
import { html } from '../../outils/gabarit.mjs';
import { ouverture, appel } from '../gabarits/sections.mjs';
import { image, repere, capsule, recue } from '../gabarits/visuels.mjs';

export const page = { cle: 'services', fichier: 'services', imagePartage: recue('services-ouverture') ? 'grok/services-ouverture-1168.webp' : null };

export default (c) => {
  const s = c.donnees.services;
  return html`
${ouverture(c, {
  repere: c.t('services.repere'), titre: c.t('services.titre'), texte: c.t('services.texte'), image: 'services-ouverture',
  action: html`<a class="bouton" href="#rendez-vous" data-action-principale data-magnetique>${c.t('services.action')}</a>`,
  info: c.t('services.info'),
})}

<section class="services conteneur" id="services">
  <div class="section-tete">
    ${repere('01', c.t('services.cartesRepere'))}
    <h2 data-titre-anime>${c.t('services.cartesTitre')}</h2>
  </div>
  <ul class="services-grille">${s.map((x) => html`<li class="service" data-anime id="service-${x.cle}">
    ${image(c, x.image, { classe: 'service-media', sizes: '(max-width: 760px) 90vw, 30vw', ratio: '4 / 5' })}
    <h3>${x.nom}</h3>
    ${x.prix ? html`<p class="service-prix" data-prix>${x.prix}</p>` : ''}
    <p class="a-completer">${x.description || c.t('services.description')}</p>
    <a class="bouton bouton--contour" href="${c.url('services', 'rendez-vous', `service=${x.cle}`)}" data-service="${x.cle}">${c.t('services.reserver')}<span class="visuellement-cache"> : ${x.nom}</span></a>
  </li>`)}</ul>
</section>

<section class="rdv conteneur" id="rendez-vous">
  <div class="section-tete">
    ${repere('02', c.t('services.rdv.repere'))}
    <h2 data-titre-anime>${c.t('services.rdv.titre')}</h2>
    <p data-anime>${c.t('services.rdv.texte')}</p>
  </div>
  <div class="rdv-grille">
    <form class="formulaire" data-formulaire data-rdv action="#" novalidate>
      <fieldset class="choix choix--cartes">
        <legend>${c.t('services.rdv.service')}</legend>
        ${s.map((x, i) => html`<label class="choix-option"><input type="radio" name="service" value="${x.cle}"${i === 0 ? html` required` : ''}><span>${x.nom}</span></label>`)}
      </fieldset>
      <div class="champ champ-date">
        <label for="r-date">${c.t('services.rdv.date')}</label>
        <input id="r-date" name="date" type="date" required data-date-source>
        <div class="calendrier" data-calendrier data-precedent="${c.s('services.rdv.moisPrecedent')}" data-suivant="${c.s('services.rdv.moisSuivant')}" data-aujourdhui="${c.s('services.rdv.aujourdhui')}" hidden></div>
        <p class="champ-aide">${c.t('services.rdv.dateAide')}</p>
      </div>
      <fieldset class="choix">
        <legend>${c.t('services.rdv.moment')}</legend>
        <label class="choix-option"><input type="radio" name="moment" value="matin"><span>${c.t('services.rdv.matin')}</span></label>
        <label class="choix-option"><input type="radio" name="moment" value="apres-midi"><span>${c.t('services.rdv.apresmidi')}</span></label>
        <label class="choix-option"><input type="radio" name="moment" value="indifferent" checked><span>${c.t('services.rdv.indifferent')}</span></label>
      </fieldset>
      <div class="champs-deux">
        <div class="champ"><label for="r-entreprise">${c.t('services.rdv.entreprise')}</label><input id="r-entreprise" name="entreprise" autocomplete="organization" required></div>
        <div class="champ"><label for="r-email">${c.t('services.rdv.email')}</label><input id="r-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="champ"><label for="r-tel">${c.t('services.rdv.tel')}</label><input id="r-tel" name="tel" type="tel" autocomplete="tel" required></div>
      <div class="champ"><label for="r-message">${c.t('services.rdv.message')}</label><textarea id="r-message" name="message" rows="4"></textarea></div>
      <p class="mention-donnees">${c.tb('formulaire.donnees')}</p>
      <button type="submit" class="bouton">${c.t('services.rdv.envoyer')}</button>
      <p data-message-envoi data-texte="${c.s('formulaire.simule')}" role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="recap" aria-live="polite" data-recap-rdv data-vide="${c.s('services.rdv.recapVide')}">
      <div class="recap-visuel" data-visuel aria-hidden="true">${capsule(c, { classe: 'recap-capsule' })}</div>
      <p class="recap-titre">${c.t('services.rdv.recap')}</p>
      <dl>
        <div><dt>${c.t('services.rdv.recapService')}</dt><dd data-recap="service">${c.t('services.rdv.recapVide')}</dd></div>
        <div><dt>${c.t('services.rdv.recapDate')}</dt><dd data-recap="date">${c.t('services.rdv.recapVide')}</dd></div>
        <div><dt>${c.t('services.rdv.recapMoment')}</dt><dd data-recap="moment">${c.t('services.rdv.indifferent')}</dd></div>
      </dl>
    </aside>
  </div>
</section>

${appel(c, { sansRdv: true })}
`;
};
