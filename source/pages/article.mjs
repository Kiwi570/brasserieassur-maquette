/* Article du blog : titre et date du site actuel ; le texte reste à reprendre (page illisible au moment du relevé). */
import { html } from '../../outils/gabarit.mjs';
import { ouverture, appel } from '../gabarits/sections.mjs';

export const page = { cle: 'article', fichier: 'blog/responsabilite-intoxication', sansAction: true, imagePartage: 'grok/blog-intoxication-1168.webp' };

export default (c) => {
  const a = c.donnees.articles[0];
  return html`
<div data-barre-lecture aria-hidden="true"></div>
${ouverture(c, { repere: html`<time datetime="${a.date}">${a.dateTexte}</time> · ${a.lecture}`, titre: a.titre, image: a.image, court: true, cachet: false })}
<article class="texte-long texte-article conteneur" data-sans-visuel>
  <p class="article-chapo">${a.resume}</p>
  <p class="a-completer">${c.t('article.corps')}</p>
  <h2>${c.t('article.liees')}</h2>
  <p>${c.t('article.lieesTexte')}</p>
  <ul class="liste-reglementaire">
    <li>${c.lien('brasseries', { ancre: 'rc-produits', texte: c.t('article.lien1') })}</li>
    <li>${c.lien('fabricants', { ancre: 'assurances', texte: c.t('article.lien2') })}</li>
  </ul>
  <p>${c.lien('blog', { classe: 'lien-fleche lien-fleche--retour', texte: c.t('article.retour') })}</p>
</article>
${appel(c)}
`;
};
