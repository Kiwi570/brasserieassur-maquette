/* Contact : formulaire du site actuel (entreprise, e-mail, objet, message, téléphone), simulé. */
import { html } from '../../outils/gabarit.mjs';
import { ouverture } from '../gabarits/sections.mjs';
import { repere, enveloppe, recue, cachet } from '../gabarits/visuels.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: recue('contact-ouverture') ? 'grok/contact-ouverture-1168.webp' : null };

export default (c) => html`
${ouverture(c, {
  repere: c.t('contact.repere'), titre: c.t('contact.titre'), texte: c.t('contact.texte'), image: 'contact-ouverture',
  action: html`<a class="bouton" href="#message" data-action-principale data-magnetique>${c.t('contact.action')}</a>`,
  court: true,
})}
<section class="contact conteneur" id="message">
  <aside class="contact-cote">
    ${enveloppe(c, { classe: 'contact-dessin' })}
    ${repere('01', c.t('contact.coordonnees'))}
    <p class="contact-email"><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
    <p class="a-completer">${c.t('contact.telephone')}</p>
    <p class="a-completer">${c.t('contact.adresse')}</p>
    <p class="contact-autres-titre">${c.t('contact.autresTitre')}</p>
    <ul class="contact-autres">
      <li>${c.lien('devis', { classe: 'lien-fleche', texte: c.t('contact.autresDevis') })}</li>
      <li>${c.lien('services', { ancre: 'rendez-vous', classe: 'lien-fleche', texte: c.t('contact.autresRdv') })}</li>
      <li>${c.lien('reglementaire', { ancre: 'reclamations', classe: 'lien-fleche', texte: c.t('contact.autresReglementaire') })}</li>
    </ul>
  </aside>
  <form class="formulaire" data-formulaire action="#" novalidate>
    ${repere('02', c.t('contact.formRepere'))}
    <h2>${c.t('contact.formTitre')}</h2>
    <div class="champs-deux">
      <div class="champ"><label for="c-entreprise">${c.t('contact.entreprise')}</label><input id="c-entreprise" name="entreprise" autocomplete="organization" required></div>
      <div class="champ"><label for="c-email">${c.t('contact.email')}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
    </div>
    <div class="champs-deux">
      <div class="champ"><label for="c-objet">${c.t('contact.objet')}</label>
        <select id="c-objet" name="objet" required><option value="" disabled selected>${c.t('contact.objetChoisir')}</option><option value="devis">${c.t('contact.objetDevis')}</option><option value="rdv">${c.t('contact.objetRdv')}</option><option value="contrat">${c.t('contact.objetContrat')}</option><option value="autre">${c.t('contact.objetAutre')}</option></select></div>
      <div class="champ"><label for="c-tel">${c.t('contact.tel')}</label><input id="c-tel" name="tel" type="tel" autocomplete="tel"></div>
    </div>
    <div class="champ"><label for="c-message">${c.t('contact.message')}</label><textarea id="c-message" name="message" rows="6" required></textarea></div>
    <p class="mention-donnees">${c.tb('formulaire.donnees')}</p>
    <button type="submit" class="bouton">${c.t('contact.envoyer')}</button>
    ${cachet(c, { classe: 'envoi-cachet', texte: c.s('commun.tamponSimule') })}
    <p data-message-envoi data-texte="${c.s('formulaire.simule')}" role="status" tabindex="-1" hidden></p>
  </form>
</section>
`;
