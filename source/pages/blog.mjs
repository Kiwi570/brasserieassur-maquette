/* Blog : un article sur le site actuel (13 mai 2024). */
import { html } from '../../outils/gabarit.mjs';
import { ouverture, appel } from '../gabarits/sections.mjs';
import { image, repere, recue } from '../gabarits/visuels.mjs';

export const page = { cle: 'blog', fichier: 'blog', imagePartage: recue('blog-ouverture') ? 'grok/blog-ouverture-1168.webp' : null };

export default (c) => {
  const a = c.donnees.articles;
  return html`
${ouverture(c, {
  repere: c.t('blog.repere'), titre: c.t('blog.titre'), texte: c.t('blog.texte'), image: 'blog-ouverture',
  action: c.lien(a[0].page, { classe: 'bouton', texte: c.t('blog.lire'), attrs: 'data-action-principale data-magnetique' }),
  court: true,
})}
<section class="articles conteneur" id="articles">
  <ul class="articles-liste">${a.map((x) => html`<li class="article-carte article-carte--large" data-anime>
    <a href="${c.url(x.page)}" data-libelle="${c.libelle(x.page)}" class="article-lien" data-incline>
      ${image(c, x.image, { classe: 'article-media', sizes: '(max-width: 760px) 100vw, 56vw', ratio: '3 / 2' })}
      <span class="article-date"><time datetime="${x.date}">${x.dateTexte}</time> · ${x.lecture}</span>
      <span class="article-titre">${x.titre}</span>
      <span class="article-resume">${x.resume}</span>
      <span class="lien-fleche">${c.t('blog.lire')}</span>
    </a>
  </li>`)}</ul>
</section>
${appel(c)}
`;
};
