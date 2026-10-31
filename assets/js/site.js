/* Effets propres à BRASSERIEassur. Le socle gère l'ouverture, les transitions, l'en-tête, le menu,
   le mode calme, les boucles et les mesures : ce fichier ne contient que ce qui est propre au client.
   Effets : compas et capsule (intro), révélation à l'encre, carte des risques épinglée, galerie des protections,
   tuyauterie de la méthode, manomètre d'éligibilité, registre tamponné, fiches cachetées, formulaires en étapes. */
import { demarrer, etat, rafraichir, aller, allerAncre, quand } from './socle/index.js?v=2';
import { revelerEncre, encreFinale } from './encre.js?v=2';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const Split = window.SplitText;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const souris = matchMedia('(hover: hover) and (pointer: fine)').matches;
const petit = () => matchMedia('(max-width: 860px)').matches;
if (gsap && Split) gsap.registerPlugin(Split);

/* ---------- Titres découpés en lignes (masque, marge pour accents et jambages, nouveau découpage au redimensionnement).
   Une fois l'animation jouée, le découpage est retiré : le titre redevient un seul bloc de texte. */
const decoupes = new Map();
function decouperTitres() {
  if (!gsap || !Split || etat.calme || etat.arrivee === 'retour') return;
  const premiers = new Set($$('.hero-titre, .page-titre'));
  $$('[data-titre-anime]').forEach((el) => {
    const etatTitre = { fini: false, split: null };
    decoupes.set(el, etatTitre);
    Split.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'ligne-titre', autoSplit: true, aria: 'auto',
      onSplit(self) {
        etatTitre.split = self;
        if (etatTitre.fini || (premiers.has(el) && etat.pret)) { requestAnimationFrame(() => self.revert()); return null; }
        if (premiers.has(el)) { gsap.set(self.lines, { yPercent: 110 }); return null; }
        return gsap.fromTo(self.lines, { yPercent: 110 }, {
          yPercent: 0, duration: .9, stagger: .09, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onComplete: () => { etatTitre.fini = true; requestAnimationFrame(() => self.revert()); },
        });
      },
    });
  });
}
function finTitre(el) {
  const e = decoupes.get(el);
  if (!e) return;
  e.fini = true;
  if (e.split) e.split.revert();
}

/* ---------- Premier écran : accueil (.hero) ou page intérieure (.page-tete). */
function premierEcran(tl, t0) {
  const titre = $('.hero-titre, .page-titre');
  const d = titre && decoupes.get(titre);
  const lignes = d && d.split ? d.split.lines : [];
  const textes = $$('.hero-intro, .hero-actions, .hero-info, .page-chapo, .page-actions, .page-info');
  if (titre) tl.set(titre, { opacity: 1 }, t0);
  if (lignes.length) {
    tl.fromTo(lignes, { yPercent: 110 }, { yPercent: 0, duration: .75, stagger: .09, ease: 'power3.out' }, t0);
    tl.call(() => finTitre(titre), null, t0 + .75 + .09 * lignes.length + .05);
  }
  if (textes.length) tl.fromTo(textes, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .07, ease: 'power2.out' }, t0 + .22);
  const cadre = $('[data-cadre]');
  if (cadre) {
    tl.call(() => {
      cadre.classList.add('revele');
      $$('.cote', cadre).forEach((c) => c.classList.add('trace'));
      revelerEncre($('[data-encre]', cadre), { duree: 1150 });
    }, null, t0);
    const c = $('.cadre-cachet', cadre);
    if (c) tl.call(() => c.classList.add('tamponne'), null, t0 + .75);
  }
}

/* ---------- Intro : le compas trace la capsule, le nom s'imprime, le cachet tombe, le calque se retire. */
function jouerIntro() {
  if (!gsap) return null;
  const p = $('[data-ouverture]');
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  tl.fromTo('.ouverture-capsule .capsule-dents', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .72, ease: 'power1.inOut' }, .08)
    .fromTo('.compas', { rotation: 0 }, { rotation: 360, duration: .72, ease: 'power1.inOut', svgOrigin: '50 50' }, .08)
    .to('.ouverture-compas', { opacity: 0, duration: .2 }, .78)
    .to('.ouverture-capsule .capsule-dents', { fillOpacity: 1, duration: .22 }, .78)
    .to('.ouverture-capsule .capsule-disque', { opacity: 1, duration: .18 }, .82)
    .fromTo('.ouverture-capsule .capsule-anneau', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .32 }, .86)
    .fromTo('.ouverture-capsule .capsule-monogramme', { opacity: 0, scale: .8, svgOrigin: '50 50' }, { opacity: 1, scale: 1, duration: .32, ease: 'back.out(2)' }, .92)
    .to('.ouverture-guide', { opacity: 0, duration: .3 }, .9)
    .fromTo('.ouverture-nom', { clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0% -10% 0)', duration: .5, ease: 'power3.inOut' }, .95)
    .fromTo('.ouverture-trait', { scaleX: 0 }, { scaleX: 1, duration: .32 }, 1.12)
    .fromTo('.ouverture-ligne-texte', { opacity: 0 }, { opacity: 1, duration: .28 }, 1.22)
    .fromTo('.ouverture-cachet', { opacity: 0, scale: 1.9, rotation: -40 }, { opacity: 1, scale: 1, rotation: -12, duration: .26, ease: 'back.out(2.2)' }, 1.36)
    .fromTo('.ouverture-dessin', { x: 0 }, { keyframes: [{ x: -3, duration: .04 }, { x: 3, duration: .05 }, { x: 0, duration: .05 }] }, 1.6)
    .fromTo(p, { clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)', duration: .62, ease: 'power4.inOut' }, 1.72)
    .fromTo('[data-logo-entete]', { rotation: -200, scale: .4 }, { rotation: 0, scale: 1, duration: .6, ease: 'back.out(1.6)' }, 1.86);
  premierEcran(tl, 1.92);
  return tl;
}

function etatFinalProjet() {
  if (gsap) {
    gsap.set('.hero-titre, .hero-intro, .hero-actions, .hero-info, .page-titre, .page-chapo, .page-actions, .page-info', { clearProps: 'transform,opacity' });
    gsap.set('[data-logo-entete]', { clearProps: 'transform' });
    const titre = $('.hero-titre, .page-titre');
    if (titre) finTitre(titre);
  }
  $$('[data-cadre]').forEach((c) => { c.classList.add('revele'); $$('.cote', c).forEach((x) => x.classList.add('trace')); });
  $$('.cadre-cachet').forEach((c) => c.classList.add('tamponne'));
  encreFinale();
}

function arriveeProjet() {
  if (!gsap) { etatFinalProjet(); return; }
  const tl = gsap.timeline();
  premierEcran(tl, .05);
}

/* ---------- Votre métier : les fiches sortent du classeur en éventail. */
function classeur() {
  const liste = $('[data-classeur]');
  if (!liste || !gsap || etat.calme) return;
  const fiches = $$('[data-fiche]', liste);
  ST.matchMedia({
    '(min-width: 861px)': () => {
      gsap.fromTo(fiches, { y: 90, x: (i) => (3 - i) * 26, rotation: (i) => (i - 3) * 3.2, opacity: 0 }, {
        y: 0, x: 0, rotation: 0, opacity: 1, duration: 1, stagger: .07, ease: 'power3.out',
        scrollTrigger: { trigger: liste, start: 'top 82%', once: true },
      });
    },
    '(max-width: 860px)': () => {
      gsap.fromTo(fiches, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .06, ease: 'power2.out', scrollTrigger: { trigger: liste, start: 'top 90%', once: true } });
    },
  });
}

/* ---------- Carte des risques : le plan se trace, les zones s'allument une à une et reçoivent leur cachet. */
function carteDesRisques() {
  const section = $('.carte');
  if (!section) return;
  const svg = $('.plan', section);
  const zones = $$('.zone', svg);
  const fiches = $$('[data-zone-fiche]', section);
  const onglets = $$('[data-zone-onglet]', section);
  const lettres = $$('[data-zone-lettre]', section);
  const compte = $('[data-carte-compte]', section);
  const n = fiches.length;
  let courant = -1, st = null;

  const montrer = (i, couvertes) => {
    if (i === courant && couvertes === undefined) return;
    courant = i;
    zones.forEach((z, k) => {
      const cle = z.dataset.zone;
      const idx = fiches.findIndex((f) => f.dataset.zoneFiche === cle);
      z.classList.toggle('est-active', idx === i);
      z.classList.toggle('est-couverte', idx <= (couvertes ?? i));
    });
    fiches.forEach((f, k) => f.classList.toggle('est-active', k === i));
    lettres.forEach((l) => l.classList.toggle('est-active', l.dataset.zoneLettre === (fiches[i] && fiches[i].dataset.zoneFiche)));
    onglets.forEach((o, k) => { o.classList.toggle('est-active', k === i); o.classList.toggle('est-couvert', k <= (couvertes ?? i)); o.setAttribute('aria-pressed', String(k === i)); });
    if (compte) compte.textContent = String(Math.max(0, (couvertes ?? i) + 1));
  };

  /* Sans épinglage (téléphone, mode calme) : tout est visible, un toucher met une zone en avant. */
  const libre = () => {
    zones.forEach((z) => z.classList.add('est-couverte'));
    const choisir = (cle) => {
      zones.forEach((z) => z.classList.toggle('est-active', z.dataset.zone === cle));
      lettres.forEach((l) => l.classList.toggle('est-active', l.dataset.zoneLettre === cle));
      fiches.forEach((f) => f.classList.toggle('est-active', f.dataset.zoneFiche === cle));
    };
    zones.forEach((z) => z.addEventListener('click', () => {
      choisir(z.dataset.zone);
      const f = fiches.find((x) => x.dataset.zoneFiche === z.dataset.zone);
      if (f && f.parentElement.scrollWidth > f.parentElement.clientWidth) f.parentElement.scrollTo({ left: f.offsetLeft - f.parentElement.offsetLeft, behavior: etat.calme ? 'auto' : 'smooth' });
    }));
    fiches.forEach((f) => f.addEventListener('click', () => choisir(f.dataset.zoneFiche)));
  };
  libre();
  if (compte) compte.textContent = String(n);
  if (!gsap || !ST || etat.calme) return;

  /* Dessin du plan au premier passage (aussi sur téléphone). */
  const traits = $$('.trait', svg), faces = [...$$('.face, .reflet', svg), ...$$('.plan-lettre', section)];

  ST.matchMedia({
    '(min-width: 961px) and (min-height: 600px)': () => {
      section.classList.add('carte--epinglee');
      const region = $('[data-defile-region]', section);
      if (region) { region.removeAttribute('tabindex'); region.removeAttribute('role'); }
      zones.forEach((z) => z.classList.remove('est-couverte', 'est-active'));
      gsap.set(traits, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(faces, { opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: 'none' } });
      tl.to(traits, { strokeDashoffset: 0, duration: 1, stagger: { amount: .6 } }, 0)
        .to(faces, { opacity: 1, duration: .5, stagger: { amount: .3 } }, .7)
        .to({}, { duration: 6 });
      montrer(0, -1);
      st = ST.create({
        trigger: section, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 4.6), pin: true, anticipatePin: 1,
        animation: tl, scrub: .5, invalidateOnRefresh: true,
        onUpdate: (s) => {
          const p = s.progress, debut = 1.5 / 7.5;
          if (p < debut) { montrer(0, -1); return; }
          const q = (p - debut) / (1 - debut);
          const i = Math.min(n - 1, Math.floor(q * n));
          montrer(i, q > .98 ? n - 1 : i - (q * n - i < .35 ? 1 : 0));
        },
      });
      onglets.forEach((o, i) => { o.onclick = () => {
        const debut = 1.5 / 7.5, cible = debut + (1 - debut) * ((i + .55) / n);
        aller(st.start + (st.end - st.start) * cible);
      }; });
      return () => {
        section.classList.remove('carte--epinglee');
        if (region) { region.setAttribute('tabindex', '0'); region.setAttribute('role', 'region'); }
        gsap.set(traits, { clearProps: 'strokeDasharray,strokeDashoffset' });
        gsap.set(faces, { clearProps: 'opacity' });
        zones.forEach((z) => z.classList.add('est-couverte'));
        fiches.forEach((f) => f.classList.remove('est-active'));
        onglets.forEach((o) => { o.onclick = null; });
        courant = -1;
        if (compte) compte.textContent = String(n);
      };
    },
    '(max-width: 960px), (max-height: 599px)': () => {
      const cadre = svg.parentElement;
      svg.classList.add('a-dessiner'); cadre.classList.add('a-dessiner');
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { svg.classList.add('dessine'); cadre.classList.add('dessine'); io.disconnect(); } }), { threshold: .25 });
      io.observe(svg);
      return () => { io.disconnect(); svg.classList.remove('a-dessiner'); cadre.classList.remove('a-dessiner'); };
    },
  });
}

/* ---------- Cinq protections : galerie horizontale épinglée, règle graduée. */
function protections() {
  const section = $('.protections');
  const piste = section && $('.protections-piste', section);
  if (!piste || !gsap || !ST || etat.calme) return;
  ST.matchMedia({
    '(min-width: 861px)': () => {
      piste.removeAttribute('tabindex');
      const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth);
      const regle = $('.regle-remplie', section);
      gsap.fromTo(piste, { x: 0 }, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => '+=' + distance(), pin: true, anticipatePin: 1, scrub: .6, invalidateOnRefresh: true,
          onUpdate: (s) => { if (regle) regle.style.transform = `scaleX(${s.progress})`; },
        },
      });
      return () => piste.setAttribute('tabindex', '0');
    },
  });
}

/* ---------- Méthode : la tuyauterie se remplit, chaque vanne s'ouvre à son passage. */
function tuyauterie() {
  const liste = $('[data-tuyauterie]');
  if (!liste || !gsap || !ST || etat.calme) { $$('[data-etape]').forEach((e) => e.classList.add('est-ouverte')); return; }
  const plein = $('.tuyau-plein', liste);
  const etapes = $$('[data-etape]', liste);
  let seuils = [];
  const mesurer = () => {
    const h = liste.offsetHeight || 1;
    seuils = etapes.map((e) => (e.offsetTop + 20) / h);
  };
  gsap.fromTo(plein, { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: {
      trigger: liste, start: 'top 65%', end: 'bottom 60%', scrub: .4, onRefresh: mesurer,
      onUpdate: (s) => etapes.forEach((e, i) => e.classList.toggle('est-ouverte', s.progress >= seuils[i] - .02)),
    },
  });
}

/* ---------- Test d'éligibilité : l'aiguille du manomètre oriente vers le devis en ligne ou l'étude sur mesure. */
function eligibilite() {
  const f = $('[data-eligibilite]');
  if (!f) return;
  const aiguille = $('[data-aiguille]');
  const verdict = $('[data-verdict]', f);
  const maj = () => {
    const rep = ['activite', 'surface', 'ca'].map((n) => f.querySelector(`input[name="${n}"]:checked`));
    const ok = rep.filter((r) => r && r.dataset.ok === '1').length, ko = rep.filter((r) => r && r.dataset.ok === '0').length;
    const complet = ok + ko === 3;
    let angle = -60 + ok * 34 - ko * 18;
    f.classList.remove('est-oui', 'est-non');
    verdict.classList.remove('est-oui', 'est-non');
    if (complet && ok === 3) { angle = 82; f.classList.add('est-oui'); verdict.classList.add('est-oui'); verdict.textContent = verdict.dataset.oui; }
    else if (ko) { angle = Math.min(angle, -88); f.classList.add('est-non'); verdict.classList.add('est-non'); verdict.textContent = verdict.dataset.non; }
    else verdict.textContent = verdict.dataset.attente;
    if (aiguille) aiguille.style.transform = `rotate(${angle}deg)`;
  };
  f.addEventListener('change', maj);
  f.addEventListener('submit', (e) => e.preventDefault());
  maj();
}

/* ---------- Questions : ouverture et fermeture animées sans à-coup. */
function questions() {
  $$('details.question').forEach((d) => {
    const s = $('summary', d), r = $('.question-reponse', d);
    s.addEventListener('click', (e) => {
      if (etat.calme || !r.animate) return;
      e.preventDefault();
      if (d.open) {
        const a = r.animate([{ height: r.offsetHeight + 'px' }, { height: '0px' }], { duration: 320, easing: 'cubic-bezier(.65,0,.35,1)' });
        a.onfinish = () => { d.open = false; rafraichir(); };
      } else {
        d.open = true;
        const h = r.offsetHeight;
        r.animate([{ height: '0px' }, { height: h + 'px' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => rafraichir();
      }
    });
  });
}

/* ---------- Registre, mini-plans et capsules : déclenchés à l'arrivée à l'écran. */
function aLEcran() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.classList.contains('registre')) el.classList.add('tamponne');
    if (el.classList.contains('plan')) { el.classList.add('dessine'); el.parentElement.classList.add('dessine'); }
    io.unobserve(el);
  }), { threshold: .3 });
  $$('.registre').forEach((r) => (etat.calme ? r.classList.add('tamponne') : io.observe(r)));
  $$('.plan--mini').forEach((p) => { if (etat.calme || !gsap) return; p.classList.add('a-dessiner'); p.parentElement.classList.add('a-dessiner'); io.observe(p); });
}

/* ---------- Parallaxes : photo d'ouverture, cave de l'appel final, capsule de l'appel. */
function parallaxes() {
  if (!gsap || !ST || etat.calme) return;
  const heroImg = $('.hero-media img, .page-tete-media img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.08, yPercent: 0 }, { scale: 1.08, yPercent: 3.5, ease: 'none', scrollTrigger: { trigger: heroImg.closest('section'), start: 'top top', end: 'bottom top', scrub: true } });
  const cave = $('.final-media img');
  if (cave) gsap.fromTo(cave, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } });
  $$('.appel-capsule').forEach((c) => gsap.fromTo(c, { rotation: -40 }, { rotation: 80, ease: 'none', scrollTrigger: { trigger: c.closest('.appel'), start: 'top bottom', end: 'bottom top', scrub: 1 } }));
}

/* ---------- Micro-interactions à la souris : boutons magnétiques, fiches qui s'inclinent. */
function microInteractions() {
  if (!souris || etat.calme || !gsap) return;
  $$('[data-magnetique]').forEach((b) => {
    let r = null;
    b.addEventListener('pointerenter', () => { r = b.getBoundingClientRect(); });
    b.addEventListener('pointermove', (e) => {
      if (!r) return;
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .22, y: (e.clientY - r.top - r.height / 2) * .32, duration: .35, ease: 'power2.out' });
    });
    b.addEventListener('pointerleave', () => { r = null; gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1, .45)' }); });
  });
  $$('[data-incline]').forEach((el) => {
    let r = null;
    el.addEventListener('pointerenter', () => { r = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', (e) => {
      if (!r) return;
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      gsap.to(el, { rotationY: px * 7, rotationX: -py * 6, y: -4, transformPerspective: 900, duration: .4, ease: 'power2.out' });
    });
    el.addEventListener('pointerleave', () => { r = null; gsap.to(el, { rotationY: 0, rotationX: 0, y: 0, duration: .6, ease: 'power3.out' }); });
  });
}

/* ---------- Formulaires : groupes de choix obligatoires, fichier de 15 Mo au plus. */
function erreurChamp(champ, message) {
  const hote = champ.closest('.champ, fieldset, .choix') || champ.parentElement;
  const id = 'erreur-' + (champ.id || champ.name);
  let p = document.getElementById(id);
  if (!message) { if (p) p.textContent = ''; champ.removeAttribute('aria-invalid'); return; }
  if (!p) { p = document.createElement('p'); p.id = id; p.className = 'champ-erreur'; p.setAttribute('aria-live', 'polite'); hote.appendChild(p); }
  p.textContent = message;
  champ.setAttribute('aria-invalid', 'true');
}
const MSG = { choix: 'Choisissez une option.', requis: 'Ce champ est à remplir.', email: 'Adresse e-mail à vérifier (exemple : nom@domaine.fr).', tel: 'Numéro à vérifier (10 chiffres).' };
function verifierBloc(bloc) {
  let premier = null;
  const groupes = new Set($$('input[type="radio"][required]', bloc).map((r) => r.name));
  groupes.forEach((nom) => {
    const coches = bloc.querySelector(`input[name="${nom}"]:checked`);
    const premierRadio = bloc.querySelector(`input[name="${nom}"]`);
    erreurChamp(premierRadio, coches ? '' : MSG.choix);
    if (!coches && !premier) premier = premierRadio;
  });
  $$('input:not([type="radio"]):not([type="file"]), select, textarea', bloc).forEach((c) => {
    const v = (c.value || '').trim();
    let m = '';
    if (c.required && !v) m = MSG.requis;
    else if (v && c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = MSG.email;
    else if (v && c.type === 'tel' && v.replace(/[^\d]/g, '').length < 9) m = MSG.tel;
    erreurChamp(c, m);
    if (m && !premier) premier = c;
  });
  return premier;
}
function formulaires() {
  /* Avant le socle (phase de capture) : un groupe de choix obligatoire sans réponse bloque l'envoi. */
  document.addEventListener('submit', (e) => {
    const f = e.target;
    if (!f.matches || !f.matches('[data-formulaire]')) return;
    const premier = verifierBloc(f);
    if (premier && premier.type === 'radio') { e.preventDefault(); e.stopImmediatePropagation(); premier.focus(); }
  }, true);
  $$('input[type="file"][data-max-mo]').forEach((c) => c.addEventListener('change', () => {
    const f = c.files && c.files[0];
    const trop = f && f.size > (+c.dataset.maxMo) * 1024 * 1024;
    erreurChamp(c, trop ? c.dataset.trop : '');
    if (trop) c.value = '';
  }));
}

/* ---------- Demande de devis en quatre étapes : hauteur animée, récapitulatif en direct, orientation TPE. */
function devisEtapes() {
  const f = $('[data-etapes]');
  if (!f) return;
  document.documentElement.classList.add('etapes-js');
  const blocs = $$('[data-etape-form]', f), progres = $$('[data-progres]', f);
  const prec = $('[data-etape-precedente]', f), suiv = $('[data-etape-suivante]', f), envoi = $('[data-etape-envoi]', f);
  const cadre = $('[data-etapes-cadre]', f);
  const recap = $('[data-recap-devis]');
  let i = 0;
  const afficher = (n, focus = true) => {
    const avant = cadre.offsetHeight;
    i = Math.max(0, Math.min(blocs.length - 1, n));
    blocs.forEach((b, k) => b.classList.toggle('est-active', k === i));
    progres.forEach((p, k) => { p.classList.toggle('est-active', k === i); p.classList.toggle('est-faite', k < i); });
    prec.hidden = i === 0; suiv.hidden = i === blocs.length - 1; envoi.hidden = i !== blocs.length - 1;
    if (recap) { recap.style.setProperty('--progres', String((i + 1) / blocs.length)); const e = $('[data-recap-etape]', recap); if (e) e.textContent = `${i + 1}/${blocs.length}`; }
    const apres = cadre.offsetHeight;
    if (!etat.calme && cadre.animate && avant !== apres) cadre.animate([{ height: avant + 'px' }, { height: apres + 'px' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => rafraichir();
    if (focus) { const l = $('legend', blocs[i]); if (l) { l.setAttribute('tabindex', '-1'); l.focus({ preventScroll: true }); } }
  };
  suiv.addEventListener('click', () => {
    const premier = verifierBloc(blocs[i]);
    if (premier) { premier.focus(); return; }
    afficher(i + 1);
    const haut = f.getBoundingClientRect().top;
    if (haut < 0) aller(f);
  });
  prec.addEventListener('click', () => afficher(i - 1));
  /* Récapitulatif et orientation vers le devis en ligne. */
  const vide = recap ? recap.dataset.vide : '';
  const fmt = new Intl.NumberFormat('fr-FR');
  const maj = () => {
    if (!recap) return;
    const val = (n) => { const c = f.querySelector(`[name="${n}"]:checked`) || f.querySelector(`[name="${n}"]:not([type="radio"])`); return c ? c.value.trim() : ''; };
    const metier = f.querySelector('[name="metier"]:checked');
    const champs = {
      metier: metier ? metier.closest('label').textContent.trim() : '',
      superficie: val('superficie') ? `${fmt.format(+val('superficie'))} m²` : '',
      ca: val('ca') ? `${fmt.format(+val('ca'))} €` : '',
      entreprise: val('entreprise'),
    };
    Object.entries(champs).forEach(([k, v]) => { const dd = recap.querySelector(`[data-recap="${k}"]`); if (dd) { dd.textContent = v || vide; dd.classList.toggle('est-vide', !v); } });
    const eligible = metier && metier.value === 'cafe' && val('superficie') !== '' && +val('superficie') < 500 && val('ca') !== '' && +val('ca') < 3000000;
    const bloc = $('[data-recap-eligible]', recap);
    if (bloc) bloc.hidden = !eligible;
  };
  f.addEventListener('input', maj);
  f.addEventListener('change', maj);
  /* Choix déjà fait par le bouton d'origine (?metier=…) : on commence à l'étape suivante. */
  const dejaChoisi = new URLSearchParams(location.search).get('metier') && f.querySelector('[name="metier"]:checked');
  afficher(dejaChoisi ? 1 : 0, false);
  maj();
}

/* ---------- Rendez-vous : calendrier (jours passés barrés, jour même repéré), choix du service, récapitulatif. */
function rendezVous() {
  const f = $('[data-rdv]');
  if (!f) return;
  const source = $('[data-date-source]', f), cal = $('[data-calendrier]', f), recap = $('[data-recap-rdv]');
  const vide = recap ? recap.dataset.vide : '';
  /* Date du jour à l'heure de Paris, pas à celle du visiteur. */
  const parties = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (t) => +parties.find((p) => p.type === t).value;
  const auj = new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
  const iso = (d) => d.toISOString().slice(0, 10);
  const longue = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const moisFmt = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  let mois = new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth(), 1));
  const maxMois = new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth() + 2, 1));
  const majRecap = () => {
    if (!recap) return;
    const s = f.querySelector('[name="service"]:checked'), m = f.querySelector('[name="moment"]:checked');
    const set = (k, v) => { const dd = recap.querySelector(`[data-recap="${k}"]`); if (dd) { dd.textContent = v || vide; dd.classList.toggle('est-vide', !v); } };
    set('service', s ? s.closest('label').textContent.trim() : '');
    set('date', source.value ? longue.format(new Date(source.value + 'T00:00:00Z')) : '');
    set('moment', m ? m.closest('label').textContent.trim() : '');
  };
  const rendre = (focusIso) => {
    const jours = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
    const premier = (mois.getUTCDay() + 6) % 7;
    const nb = new Date(Date.UTC(mois.getUTCFullYear(), mois.getUTCMonth() + 1, 0)).getUTCDate();
    const choisi = source.value;
    let html = `<div class="calendrier-tete"><button type="button" class="calendrier-nav" data-nav-mois="-1" aria-label="${cal.dataset.precedent}"${mois <= new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth(), 1)) ? ' disabled' : ''}>←</button><p class="calendrier-mois" aria-live="polite">${moisFmt.format(mois)}</p><button type="button" class="calendrier-nav" data-nav-mois="1" aria-label="${cal.dataset.suivant}"${mois >= maxMois ? ' disabled' : ''}>→</button></div><div class="calendrier-grille">`;
    html += jours.map((j) => `<span class="calendrier-jsem" aria-hidden="true">${j}</span>`).join('');
    for (let k = 0; k < premier; k++) html += '<span aria-hidden="true"></span>';
    let tabFixe = false;
    for (let d = 1; d <= nb; d++) {
      const date = new Date(Date.UTC(mois.getUTCFullYear(), mois.getUTCMonth(), d)), v = iso(date);
      const passe = date < auj, jourMeme = v === iso(auj), sel = v === choisi;
      const tab = !passe && !tabFixe && (sel || !choisi) ? (tabFixe = true, 0) : -1;
      html += `<button type="button" class="calendrier-jour${jourMeme ? ' est-aujourdhui' : ''}" data-jour="${v}" aria-pressed="${sel}" aria-label="${longue.format(date)}${jourMeme ? ', ' + cal.dataset.aujourdhui : ''}" tabindex="${tab}"${passe ? ' disabled' : ''}>${d}</button>`;
    }
    cal.innerHTML = html + '</div>';
    if (focusIso) { const b = cal.querySelector(`[data-jour="${focusIso}"]`); if (b && !b.disabled) { b.tabIndex = 0; b.focus(); } }
  };
  cal.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav-mois]');
    if (nav && !nav.disabled) { mois = new Date(Date.UTC(mois.getUTCFullYear(), mois.getUTCMonth() + (+nav.dataset.navMois), 1)); rendre(); return; }
    const j = e.target.closest('[data-jour]');
    if (j && !j.disabled) { source.value = j.dataset.jour; erreurChamp(source, ''); rendre(j.dataset.jour); majRecap(); }
  });
  cal.addEventListener('keydown', (e) => {
    const j = e.target.closest('[data-jour]');
    const pas = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (!j || !pas) return;
    e.preventDefault();
    const d = new Date(j.dataset.jour + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + pas);
    if (d < auj) return;
    if (d.getUTCMonth() !== mois.getUTCMonth()) { const m2 = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)); if (m2 > maxMois) return; mois = m2; }
    $$('[data-jour]', cal).forEach((b) => (b.tabIndex = -1));
    rendre(iso(d));
  });
  /* Le calendrier remplace le champ date natif (gardé sans JavaScript). */
  source.type = 'hidden';
  source.classList.add('remplace');
  cal.hidden = false;
  rendre();
  f.addEventListener('change', majRecap);
  /* « Réserver ce service » : choix fait, sans rechargement. */
  $$('[data-service]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const r = f.querySelector(`[name="service"][value="${a.dataset.service}"]`);
    if (r) { r.checked = true; majRecap(); }
    history.replaceState(null, '', `?service=${a.dataset.service}#rendez-vous`);
    allerAncre('#rendez-vous', { pousser: false });
  }));
  majRecap();
}

demarrer({
  preparer() {
    decouperTitres();
    classeur();
    carteDesRisques();
    protections();
    tuyauterie();
    eligibilite();
    questions();
    aLEcran();
    parallaxes();
    microInteractions();
    formulaires();
    devisEtapes();
    rendezVous();
  },
  jouer: jouerIntro,
  etatFinal: etatFinalProjet,
  arrivee: arriveeProjet,
});

/* Retour depuis le cache du navigateur : tout dans son état final. */
quand('retour', etatFinalProjet);
