/* Photos des pages et mémoire de la visite.
   - Chaque page a sa façon de faire apparaître ses photos quand elles arrivent à l'écran :
     accueil « du plan à la réalité » (WebGL), Brasseries la cuve qui se remplit, Producteurs l'étiquette qui se colle,
     Négociants le rideau de quai qui se lève, Fabricants la ligne de scanner, Services / À propos / Blog un fondu discret,
     les autres pages aucune animation.
   - Une photo déjà apparue pendant la visite s'affiche directement ensuite, sur toutes les pages ;
     une page déjà vue garde son ouverture dans son état final (classe html.deja-vu, posée par le script critique).
   Rien ne tourne en mode calme ni au retour arrière. */
import { armerDeveloppements, webglDispo } from './effets.js?v=4';

const CLE_PHOTOS = 'ba:photos-vues';
const CLE_PAGES = 'ba:pages-vues';
const lire = (k) => { try { return new Set(JSON.parse(sessionStorage.getItem(k) || '[]')); } catch { return new Set(); } };
const ecrire = (k, s) => { try { sessionStorage.setItem(k, JSON.stringify([...s].slice(-400))); } catch {} };
const photosVues = lire(CLE_PHOTOS);

/** Nom d'une photo : celui du fichier, sans la largeur (brasseries-stock-1168.webp → brasseries-stock). */
export function nomPhoto(media) {
  const img = media && media.querySelector('img');
  return img ? (img.getAttribute('src') || '').replace(/^.*\//, '').replace(/-\d+\.\w+$/, '') : '';
}
export const photoVue = (media) => photosVues.has(nomPhoto(media));
export function marquerPhoto(media) {
  const n = nomPhoto(media);
  if (n && !photosVues.has(n)) { photosVues.add(n); ecrire(CLE_PHOTOS, photosVues); }
}

/** Page déjà vue pendant la visite (décidé avant le premier affichage par le script critique). */
export const pageDejaVue = () => document.documentElement.classList.contains('deja-vu');
export function marquerPage() {
  const p = document.documentElement.dataset.page;
  const s = lire(CLE_PAGES);
  if (p && !s.has(p)) { s.add(p); ecrire(CLE_PAGES, s); }
}

/* ---------- Les apparitions. Chacune part de l'état d'attente posé en CSS (classe photo-attente),
   la retire au premier pas de l'animation et nettoie tout à la fin. */
const ease = 'cubic-bezier(.3, .1, .2, 1)';
const fini = (a) => (a && a.finished ? a.finished.catch(() => {}) : Promise.resolve());
const ajouter = (media, classe) => { const e = document.createElement('span'); e.className = classe; e.setAttribute('aria-hidden', 'true'); e.setAttribute('data-audit-ignorer', ''); media.appendChild(e); return e; };

const STYLES = {
  /* Discret : fondu et léger zoom arrière. */
  fondu(media, img) {
    const a = media.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out' });
    /* Le zoom passe par le cadre de l'image (picture) : l'image elle-même garde ses propres mouvements (parallaxe). */
    (media.querySelector('picture') || img).animate([{ transform: 'scale(1.05)' }, { transform: 'scale(1)' }], { duration: 800, easing: ease });
    return fini(a);
  },
  /* Brasseries : la photo se remplit de bas en haut comme une cuve, sous une crête de mousse. */
  cuve(media, img) {
    const h = media.getBoundingClientRect().height;
    const vague = ajouter(media, 'photo-vague');
    const duree = 1500;
    const a = img.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { duration: duree, easing: ease });
    vague.animate([{ transform: `translate3d(0, ${h - 9}px, 0)` }, { transform: 'translate3d(-50%, -9px, 0)' }], { duration: duree, easing: ease });
    vague.animate([{ opacity: 1 }, { opacity: 1, offset: .82 }, { opacity: 0 }], { duration: duree, easing: 'linear' });
    return fini(a).then(() => vague.remove());
  },
  /* Producteurs : la photo se colle comme une étiquette, puis un reflet la traverse. */
  etiquette(media) {
    const a = media.animate([
      { opacity: 0, transform: 'translateY(26px) rotate(-3.5deg) scale(.93)' },
      { opacity: 1, offset: .45 },
      { transform: 'translateY(-3px) rotate(.8deg) scale(1.012)', offset: .72 },
      { opacity: 1, transform: 'none' },
    ], { duration: 950, easing: 'cubic-bezier(.25, .8, .3, 1)' });
    const reflet = ajouter(media, 'photo-reflet');
    reflet.animate([{ transform: 'translateX(-110%)' }, { transform: 'translateX(110%)' }], { duration: 900, delay: 520, easing: 'cubic-bezier(.5, 0, .3, 1)', fill: 'backwards' });
    return fini(a).then(() => new Promise((r) => setTimeout(r, 950))).then(() => reflet.remove());
  },
  /* Négociants : le rideau métallique du quai se lève, avec un petit à-coup au départ. */
  rideau(media) {
    const rideau = media.querySelector('.photo-rideau');
    if (!rideau) return Promise.resolve();
    const a = rideau.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-7%)', offset: .16 },
      { transform: 'translateY(-5%)', offset: .24 },
      { transform: 'translateY(-101%)' },
    ], { duration: 1350, easing: 'cubic-bezier(.55, 0, .25, 1)', fill: 'forwards' });
    return fini(a).then(() => rideau.remove());
  },
  /* Fabricants : une ligne de scanner balaie la photo sur un fond de plan bleu. */
  scanner(media, img) {
    const h = media.getBoundingClientRect().height;
    const plan = ajouter(media, 'photo-plan');
    const ligne = ajouter(media, 'photo-scan');
    const duree = 1250;
    const a = img.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: duree, easing: 'cubic-bezier(.45, .05, .35, 1)' });
    ligne.animate([{ transform: 'translate3d(0, 0, 0)', opacity: 1 }, { transform: `translate3d(0, ${h - 2}px, 0)`, opacity: 1, offset: .96 }, { transform: `translate3d(0, ${h - 2}px, 0)`, opacity: 0 }], { duration: duree, easing: 'cubic-bezier(.45, .05, .35, 1)' });
    plan.animate([{ opacity: 1 }, { opacity: 1, offset: .7 }, { opacity: 0 }], { duration: duree + 300, easing: 'linear' });
    return fini(a).then(() => new Promise((r) => setTimeout(r, 320))).then(() => { ligne.remove(); plan.remove(); });
  },
};

const enAttente = new Set();

function apparaitre(media, style) {
  const img = media.querySelector('img');
  enAttente.delete(media);
  marquerPhoto(media);
  const anim = STYLES[style];
  const lancer = () => {
    media.classList.remove('photo-attente');
    if (anim && img && media.animate) anim(media, img).then(() => media.removeAttribute('data-photo'));
    else media.removeAttribute('data-photo');
  };
  /* L'image doit être prête, sinon l'animation montrerait une case vide. */
  if (img && !img.complete && img.decode) img.decode().then(lancer, lancer); else lancer();
}

/** Arme les apparitions de la page. selecteur : les photos concernées ; exclure : celles de l'ouverture. */
export function revelerPhotos(style, selecteur, { exclure } = {}) {
  if (!style || style === 'aucune' || !('IntersectionObserver' in window)) return;
  const medias = [...document.querySelectorAll(selecteur)].filter((m) => !(exclure && m.matches(exclure)) && m.querySelector('img') && !photoVue(m));
  if (!medias.length) return;
  if (style === 'developpement') {
    if (webglDispo()) { armerDeveloppements(medias, { auDepart: marquerPhoto }); return; }
    style = 'fondu';
  }
  medias.forEach((m) => {
    m.setAttribute('data-photo', style);
    m.classList.add('photo-attente');
    if (style === 'rideau') ajouter(m, 'photo-rideau');
    enAttente.add(m);
  });
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    apparaitre(e.target, style);
  }), { threshold: .22 });
  medias.forEach((m) => io.observe(m));
}

/** État final : toutes les photos visibles tout de suite. */
export function toutReveler() {
  enAttente.forEach((m) => { m.classList.remove('photo-attente'); m.removeAttribute('data-photo'); m.querySelectorAll('.photo-rideau').forEach((r) => r.remove()); });
  enAttente.clear();
}
