/* Page métier : contenu dans donnees/metiers.json (« brasserie »), gabarit source/gabarits/metier.mjs. */
import { pageMetier } from '../gabarits/metier.mjs';
import { recue } from '../gabarits/visuels.mjs';

const ouverture = { brasserie: 'brasseries-ouverture', producteur: 'producteurs-ouverture', negociant: 'negociants-ouverture', fabricant: 'fabricants-ouverture' }['brasserie'];
export const page = { cle: 'brasseries', fichier: 'brasseries', imagePartage: recue(ouverture) ? `grok/${ouverture}-1168.webp` : null };

export default (c) => pageMetier(c, 'brasserie');
