/* Accueil : ouverture, métiers, carte des risques (épinglée), cinq protections (galerie épinglée),
   méthode (tuyauterie), test d'éligibilité TPE (manomètre), engagements (registre), questions, appel final. */
import { html, brut } from '../../outils/gabarit.mjs';
import { image, cachet, cote, repere, registre, manometre, recue } from '../gabarits/visuels.mjs';
import { plan } from '../gabarits/plan.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: recue('accueil-ouverture') ? 'grok/accueil-ouverture-1168.webp' : null };

const orus = (c, texte, classe = 'bouton') => html`<a class="${classe}" href="${c.site.liens.orus}" target="_blank" rel="noopener">${texte}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span><span class="fleche-ext" aria-hidden="true">↗</span></a>`;

export default (c) => {
  const zones = c.donnees.zones;
  const metiers = c.donnees.metiers;
  const article = c.donnees.articles[0];
  return html`
<section class="hero" id="debut">
  <div class="hero-texte">
    ${repere('', c.t('accueil.hero.repere'))}
    <h1 class="hero-titre" data-titre-anime data-anime="gsap">${c.t('accueil.hero.titre1')}<br>${c.t('accueil.hero.titre2')}<br><em class="mot-cle">${c.t('accueil.hero.titre3')}</em></h1>
    <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <div class="hero-actions" data-anime="gsap">
      ${c.lien('devis', { classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-magnetique' })}
      <a class="bouton bouton--contour" href="#tpe">${c.t('accueil.hero.action2')}</a>
    </div>
    <p class="hero-info" data-info-cle data-anime="gsap"><span class="pastille-ok" aria-hidden="true"></span>${c.t('accueil.hero.info', { n: c.site.contact.orias })}</p>
  </div>
  <div class="cadre-plan hero-cadre" data-cadre>
    ${cote(c.s('accueil.hero.coteGauche'), 'cadre-cote')}
    <div class="cadre-image" data-encre>${image(c, 'accueil-ouverture', { classe: 'hero-media', priorite: true, sizes: '(max-width: 760px) 100vw, 52vw' })}</div>
    <span class="cadre-repere cadre-repere--hg" aria-hidden="true"></span><span class="cadre-repere cadre-repere--bd" aria-hidden="true"></span>
    ${cachet(c, { classe: 'cadre-cachet hero-cachet' })}
  </div>
</section>

<section class="metiers conteneur" id="metiers">
  <div class="section-tete">
    ${repere('01', c.t('accueil.metiers.repere'))}
    <h2 data-titre-anime>${c.t('accueil.metiers.titre')}</h2>
    <p data-anime>${c.t('accueil.metiers.texte')}</p>
  </div>
  <ul class="metiers-grille" data-classeur>${metiers.map((m, i) => html`<li class="fiche-metier${m.aCompleter ? ' fiche-metier--attente' : ''}${m.versTpe ? ' fiche-metier--tpe' : ''}" style="--i:${i}" data-fiche>
    <article class="fiche-metier-corps" data-incline>
      <span class="fiche-onglet" aria-hidden="true">${m.numero}</span>
      ${image(c, m.image, { classe: 'fiche-metier-media', sizes: '(max-width: 760px) 80vw, 24vw', ratio: '4 / 5' })}
      <h3 class="fiche-metier-nom">${m.nom}</h3>
      <p class="fiche-metier-question">${m.question}</p>
      ${m.aCompleter ? html`<p class="etiquette-attente">${c.t('accueil.metiers.aCompleter')}</p>` : ''}
      <p class="fiche-metier-action">${m.page
        ? c.lien(m.page, { classe: 'lien-fleche', texte: html`${c.t('accueil.metiers.voir')}<span class="visuellement-cache"> : ${m.nom}</span>` })
        : m.versTpe
          ? html`<a class="lien-fleche" href="#tpe">${c.t('accueil.metiers.tpe')}</a>`
          : c.lien('devis', { params: `metier=${m.cle}`, classe: 'lien-fleche', texte: html`${c.t('accueil.metiers.devis')}<span class="visuellement-cache"> : ${m.nom}</span>` })}</p>
    </article>
  </li>`)}</ul>
</section>

<section class="carte" id="carte" data-entete-cache>
  <div class="carte-scene conteneur">
    <div class="carte-plan">${plan(c, { id: 'carte-plan', titre: c.s('accueil.carte.titrePlan') })}</div>
    <div class="carte-cote">
      <div class="carte-tete">
        ${repere('02', c.t('accueil.carte.repere'))}
        <h2>${c.t('accueil.carte.titre')}</h2>
        <p class="carte-texte">${c.t('accueil.carte.texte')}</p>
      </div>
      <div class="carte-fiches-defile" tabindex="0" role="region" aria-label="${c.s('accueil.carte.liste')}" data-defile-region><ol class="carte-fiches">${zones.map((z) => html`<li class="zone-fiche" id="zone-${z.cle}" data-zone-fiche="${z.cle}">
        <p class="zone-fiche-tete"><span class="zone-fiche-lettre" aria-hidden="true">${z.numero}</span><span class="zone-fiche-nom">${z.nom}</span></p>
        <p class="zone-fiche-sous">${c.t('accueil.carte.risques')}</p>
        <ul class="puces-risques">${z.risques.map((r) => html`<li>${r}</li>`)}</ul>
        <p class="zone-fiche-sous">${c.t('accueil.carte.garanties')}</p>
        <ul class="zone-garanties">${z.garanties.map((g) => html`<li><strong>${g.nom}</strong> ${g.detail}</li>`)}</ul>
      </li>`)}</ol></div>
      <div class="carte-pied">
        <div class="carte-onglets" role="group" aria-label="${c.s('accueil.carte.liste')}">${zones.map((z, i) => html`<button type="button" class="carte-onglet" data-zone-onglet="${z.cle}" data-index="${i}" aria-label="${z.numero} : ${z.nom}">${z.numero}</button>`)}</div>
        <p class="carte-compteur" data-indicateur><strong data-carte-compte>6</strong>/6 ${c.t('accueil.carte.compteur')}</p>
      </div>
      <p class="carte-consigne"><span class="sur-souris">${c.t('accueil.carte.consigne')}</span><span class="sur-tactile">${c.t('accueil.carte.consigneTactile')}</span></p>
    </div>
  </div>
</section>

<section class="protections ecran epingle" id="protections" data-entete-cache data-plein-ecran>
  <div class="conteneur protections-tete">
    ${repere('03', c.t('accueil.protections.repere'))}
    <h2>${c.t('accueil.protections.titre')}</h2>
    <p>${c.t('accueil.protections.texte')} <span class="indice-glisser">${c.t('commun.glisser')}</span></p>
  </div>
  <div class="piste protections-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.protections.region')}">
    ${c.donnees.protections.map((p) => html`<article class="protection" id="protection-${p.cle}">
      ${image(c, p.image, { classe: 'protection-media', sizes: '(max-width: 760px) 78vw, 30vw' })}
      <div class="protection-texte">
        <p class="protection-numero">${p.numero}<span>/05</span></p>
        <h3>${p.titre}</h3>
        <p>${p.texte}</p>
      </div>
    </article>`)}
  </div>
  <div class="regle" aria-hidden="true"><span class="regle-remplie"></span></div>
</section>

<section class="methode conteneur" id="methode">
  <div class="methode-cote">
    ${repere('04', c.t('accueil.methode.repere'))}
    <h2 data-titre-anime>${c.t('accueil.methode.titre')}</h2>
    <p data-anime>${c.t('accueil.methode.texte')}</p>
    ${image(c, 'accueil-methode', { classe: 'methode-media', sizes: '(max-width: 760px) 100vw, 40vw', ratio: '3 / 2' })}
  </div>
  <ol class="etapes" data-tuyauterie>
    <li class="tuyau" aria-hidden="true"><span class="tuyau-plein"></span></li>
    ${c.donnees.methode.map((e) => html`<li class="etape" data-etape>
      <span class="vanne" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15"/><path d="M20 7V33M7 20H33"/></svg></span>
      <p class="etape-numero">${e.numero}</p>
      <h3>${e.titre}</h3>
      <p>${e.texte}</p>
      ${e.lien ? c.lien(e.lien.page, { ancre: e.lien.ancre, params: e.lien.params, classe: 'lien-fleche', texte: e.lien.texte }) : ''}
    </li>`)}
  </ol>
</section>

<section class="tpe" id="tpe">
  <div class="conteneur tpe-grille">
    <div class="tpe-visuel">
      ${image(c, 'accueil-tpe', { classe: 'tpe-media', sizes: '(max-width: 760px) 100vw, 38vw', ratio: '4 / 5' })}
      <div class="tpe-manometre" data-superpose>${manometre(c)}</div>
    </div>
    <div class="tpe-texte">
      ${repere('05', c.t('accueil.tpe.repere'))}
      <h2 data-titre-anime>${c.t('accueil.tpe.titre')}</h2>
      <p data-anime>${c.t('accueil.tpe.texte')}</p>
      <p class="tpe-criteres" data-anime>${c.t('accueil.tpe.criteres')}</p>
      <form class="eligibilite" data-eligibilite aria-describedby="eligibilite-verdict">
        <p class="eligibilite-titre">${c.t('accueil.tpe.test')}</p>
        ${[['activite', 'q1', 'cafe', 'autre'], ['surface', 'q2', 'petite', 'grande'], ['ca', 'q3', 'petit', 'grand']].map(([nom, q, oui, non]) => html`<fieldset class="choix">
          <legend>${c.t(`accueil.tpe.${q}`)}</legend>
          <label class="choix-option"><input type="radio" name="${nom}" value="${oui}" data-ok="1"><span>${c.t(`accueil.tpe.${q}a`)}</span></label>
          <label class="choix-option"><input type="radio" name="${nom}" value="${non}" data-ok="0"><span>${c.t(`accueil.tpe.${q}b`)}</span></label>
        </fieldset>`)}
        <p class="eligibilite-verdict" id="eligibilite-verdict" role="status" data-verdict data-attente="${c.t('accueil.tpe.verdictAttente')}" data-oui="${c.t('accueil.tpe.verdictOui')}" data-non="${c.t('accueil.tpe.verdictNon')}">${c.t('accueil.tpe.verdictAttente')}</p>
        <div class="eligibilite-actions">
          ${orus(c, c.t('accueil.tpe.orus'), 'bouton')}
          ${c.lien('devis', { classe: 'bouton bouton--contour', texte: c.t('accueil.tpe.mesure') })}
        </div>
        <p class="tpe-partenaire">${c.t('accueil.tpe.partenaire')}</p>
      </form>
      <ul class="puces-avantages"><li>${c.t('accueil.tpe.avantage1')}</li><li>${c.t('accueil.tpe.avantage2')}</li><li>${c.t('accueil.tpe.avantage3')}</li></ul>
    </div>
  </div>
</section>

<section class="engagements conteneur" id="engagements">
  ${registre(c, { classe: 'engagements-registre' })}
  <div class="engagements-texte">
    ${repere('06', c.t('accueil.engagements.repere'))}
    <h2 data-titre-anime>${c.t('accueil.engagements.titre')}</h2>
    <p data-anime>${c.t('accueil.engagements.texte')}</p>
    <ul class="engagements-liste">${c.donnees.engagements.points.map((p) => html`<li data-anime><h3>${p.titre}</h3><p>${p.texte}</p></li>`)}</ul>
    <p data-anime>${c.lien('reglementaire', { classe: 'lien-fleche', texte: c.t('accueil.engagements.lien') })}</p>
  </div>
</section>

<section class="questions conteneur" id="questions">
  <div class="questions-liste">
    ${repere('07', c.t('accueil.faq.repere'))}
    <h2 data-titre-anime>${c.t('accueil.faq.titre')}</h2>
    ${c.donnees.faq.map((f) => html`<details class="question" data-anime><summary><span>${f.q}</span><span class="question-signe" aria-hidden="true"></span></summary><div class="question-reponse"><p>${f.r}</p></div></details>`)}
  </div>
  <aside class="article-carte" aria-label="${c.s('accueil.article.repere')}">
    ${repere('', c.t('accueil.article.repere'))}
    <a href="${c.url(article.page)}" data-libelle="${c.libelle(article.page)}" class="article-lien" data-incline>
      ${image(c, article.image, { classe: 'article-media', sizes: '(max-width: 760px) 100vw, 34vw', ratio: '3 / 2' })}
      <span class="article-date">${article.dateTexte} · ${article.lecture}</span>
      <span class="article-titre">${article.titre}</span>
      <span class="lien-fleche">${c.t('accueil.article.lire')}</span>
    </a>
  </aside>
</section>

<section class="final" id="final">
  ${image(c, 'accueil-final', { classe: 'final-media', sizes: '100vw' })}
  <div class="final-voile" aria-hidden="true"></div>
  <div class="conteneur final-texte">
    <h2 class="final-titre" data-titre-anime>${c.t('accueil.final.titre')}</h2>
    <p data-anime>${c.t('accueil.final.texte')}</p>
    <p class="final-actions" data-anime>
      ${c.lien('devis', { classe: 'bouton bouton--clair', texte: c.t('accueil.final.devis'), attrs: 'data-magnetique' })}
      ${c.lien('services', { ancre: 'rendez-vous', classe: 'bouton bouton--contour-clair', texte: c.t('accueil.final.rdv') })}
    </p>
    <p class="final-email" data-anime><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
  </div>
</section>
`;
};
