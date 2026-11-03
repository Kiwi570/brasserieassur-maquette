/* Page 404 : « Cette cuve est vide. » */
import { html } from '../../outils/gabarit.mjs';
import { ouverture } from '../gabarits/sections.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
${ouverture(c, {
  forme: 'cuve-vide', repere: c.t('introuvable.repere'), titre: c.t('introuvable.titre'), texte: c.t('introuvable.texte'), image: '404-cuve-vide',
  action: html`${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })} ${c.lien('devis', { classe: 'bouton bouton--contour-clair', texte: c.t('introuvable.devis') })}`,
})}
`;
