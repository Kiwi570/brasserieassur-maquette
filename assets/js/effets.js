/* Effets signature de BRASSERIEassur.
   - developper(media) : « du plan à la réalité ». La photo apparaît d'abord en dessin technique (ses contours tracés
     à l'encre sur le papier), puis se développe en taches, comme un tirage. Un canvas WebGL est posé sur la photo
     le temps de l'effet, puis disparaît : la vraie photo est dessous, identique. Résolution réduite (l'effet dure
     1,6 s), aucun calcul quand rien ne bouge.
   - armerDeveloppements() : chaque photo du site se développe quand elle arrive à l'écran.
   - bullesEtVapeur(cadre) : fines bulles qui montent et vapeur légère sur la photo d'ouverture de l'accueil,
     écartées par la souris ; arrêtées hors de l'écran.
   - jauge() : tube de niveau de cuve à droite de l'écran (ordinateur), rempli selon la lecture de la page.
   Rien de tout cela ne tourne en mode calme ni au retour arrière (la page revient dans son état final). */

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FRAG = `precision mediump float;
varying vec2 v;
uniform sampler2D img; uniform vec2 taille; uniform vec2 dec; uniform vec2 dim; uniform vec2 pas;
uniform float t; uniform vec3 papier; uniform vec3 encre;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
float lum(vec2 s){ return dot(texture2D(img, s).rgb, vec3(.299, .587, .114)); }
void main(){
  vec2 px = vec2(v.x * taille.x, (1. - v.y) * taille.y);
  vec2 s = (px - dec) / dim;
  float tl = lum(s + vec2(-pas.x, -pas.y)), tc = lum(s + vec2(0., -pas.y)), tr = lum(s + vec2(pas.x, -pas.y));
  float ml = lum(s + vec2(-pas.x, 0.)), mr = lum(s + vec2(pas.x, 0.));
  float bl = lum(s + vec2(-pas.x, pas.y)), bc = lum(s + vec2(0., pas.y)), br = lum(s + vec2(pas.x, pas.y));
  float gx = tr + 2. * mr + br - tl - 2. * ml - bl, gy = bl + 2. * bc + br - tl - 2. * tc - tr;
  float trait = smoothstep(.24, .62, length(vec2(gx, gy)));
  vec2 q = v * vec2(taille.x / taille.y, 1.);
  float bruit = n(q * 5.) * .6 + n(q * 13.) * .4;
  /* 1. tracé : les contours apparaissent de gauche à droite, irrégulièrement. */
  float trace = smoothstep(0., .08, t * 1.9 - (v.x * .62 + bruit * .38));
  float ombre = (1. - lum(s)) * .16 * trace;
  vec3 dessin = mix(papier * (1. - ombre), encre, trait * trace * .82);
  /* 2. développement : la photo monte en taches depuis le bas. */
  float front = (t - .42) * 2.3 - (bruit * .72 + v.y * .28);
  float dev = smoothstep(0., .07, front);
  float lisere = smoothstep(.07, .0, abs(front - .035)) * step(.0, t - .42) * (1. - step(.999, t));
  vec3 photo = texture2D(img, s).rgb;
  vec3 c = mix(dessin, photo, dev);
  c = mix(c, encre, lisere * .3);
  gl_FragColor = vec4(c, 1.);
}`;

const PAPIER = [251 / 255, 248 / 255, 242 / 255];
const ENCRE = [20 / 255, 33 / 255, 61 / 255];

/* Une photo en cours de développement a son propre petit contexte WebGL, rendu directement à l'écran
   (aucune relecture de pixels), détruit dès la fin ; jamais plus de 8 à la fois. */
const actifs = new Set();
const enAttente = [];
const MAX = 4;
let webglOk = null;

function webgl() {
  if (webglOk === null) {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl', { failIfMajorPerformanceCaveat: true });
      let logiciel = false;
      if (gl) {
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        const nom = String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || '');
        logiciel = /swiftshader|llvmpipe|software|basic render/i.test(nom);
        const ext = gl.getExtension('WEBGL_lose_context'); ext && ext.loseContext();
      }
      webglOk = !!gl && !logiciel;
    } catch { webglOk = false; }
  }
  return webglOk;
}

/* Position de la photo dans son cadre (object-fit: cover et point de cadrage). */
function placement(img, w, h) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const k = Math.max(w / iw, h / ih), dw = iw * k, dh = ih * k;
  const pos = getComputedStyle(img).objectPosition.split(' ');
  const pc = (x) => (x && x.endsWith('%') ? parseFloat(x) / 100 : .5);
  return { dec: [(w - dw) * pc(pos[0]), (h - dh) * pc(pos[1])], dim: [dw, dh] };
}

function contexte(canvas, img) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); } catch { return null; }
  /* Le canvas ne garde que la taille utile : la texture reste celle de l'image, le dessin se fait à la taille réduite. */
  const u = (n) => gl.getUniformLocation(prog, n);
  const U = { taille: u('taille'), dec: u('dec'), dim: u('dim'), pas: u('pas'), t: u('t') };
  gl.uniform1i(u('img'), 0);
  gl.uniform3fv(u('papier'), PAPIER);
  gl.uniform3fv(u('encre'), ENCRE);
  return { gl, U };
}

function terminer(it) {
  if (it.fini) return;
  it.fini = true;
  actifs.delete(it);
  cancelAnimationFrame(it.raf);
  it.media.classList.remove('a-developper');
  it.media.classList.add('developpee');
  if (it.canvas && it.canvas.isConnected) it.canvas.remove();
  if (it.gl) { const ext = it.gl.getExtension('WEBGL_lose_context'); ext && ext.loseContext(); }
  it.fin && it.fin();
  const suivant = enAttente.shift();
  if (suivant) lancer(suivant);
}

function dessiner(it, t) {
  const { gl, U } = it;
  gl.viewport(0, 0, it.w, it.h);
  gl.uniform2f(U.taille, it.w, it.h);
  gl.uniform2f(U.dec, it.pl.dec[0] * it.k, it.pl.dec[1] * it.k);
  gl.uniform2f(U.dim, it.pl.dim[0] * it.k, it.pl.dim[1] * it.k);
  gl.uniform2f(U.pas, 1.35 / (it.pl.dim[0] * it.k), 1.35 / (it.pl.dim[1] * it.k));
  gl.uniform1f(U.t, t);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  if (it.img.style.transform !== it.transform) { it.transform = it.img.style.transform; it.canvas.style.transform = it.transform; }
}

function lancer(it) {
  if (actifs.size >= MAX) { enAttente.push(it); return; }
  const r = it.media.getBoundingClientRect();
  if (r.width < 80 || r.height < 60) { terminer(it); return; }
  it.k = matchMedia('(max-width: 760px)').matches ? .6 : .7;
  it.w = Math.max(1, Math.round(r.width * it.k)); it.h = Math.max(1, Math.round(r.height * it.k));
  it.pl = placement(it.img, r.width, r.height);
  const canvas = document.createElement('canvas');
  canvas.className = 'developpement';
  canvas.width = it.w; canvas.height = it.h;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-audit-ignorer', '');
  const c = contexte(canvas, it.img);
  if (!c) { terminer(it); return; }
  Object.assign(it, c, { canvas, transform: '' });
  actifs.add(it);
  dessiner(it, 0);
  it.img.insertAdjacentElement('afterend', canvas);
  let images = 0, t0 = 0;
  const pas = (now) => {
    if (!t0) t0 = now;
    /* La photo ne redevient visible sous le canvas qu'une fois le papier affiché : aucun éclair. */
    if (++images === 2) { it.media.classList.remove('a-developper'); it.avant && it.avant(); }
    const t = Math.min(1, (now - t0) / it.duree);
    dessiner(it, t);
    if (t >= 1 || document.hidden) terminer(it); else it.raf = requestAnimationFrame(pas);
  };
  it.raf = requestAnimationFrame(pas);
}

/* Prépare une photo : elle reste cachée (le papier du cadre se voit) jusqu'à son développement. */
async function preparer(media) {
  const img = media && media.querySelector('img');
  if (!img || media.classList.contains('developpee') || media.dataset.developpe) return null;
  if (!webgl()) return null;
  media.dataset.developpe = '1';
  media.classList.add('a-developper');
  try { if (!img.complete || !img.naturalWidth) await img.decode(); } catch {}
  if (!img.naturalWidth) { media.classList.remove('a-developper'); return null; }
  return { media, img, duree: 1600 };
}

function jouer(it, { duree, avant } = {}) {
  if (!it) return Promise.resolve();
  if (it.promesse) return it.promesse;
  if (duree) it.duree = duree;
  it.avant = avant;
  it.promesse = new Promise((r) => { it.fin = r; });
  lancer(it);
  return it.promesse;
}

/** État final : toutes les photos visibles, plus aucun canvas. */
export function toutDevelopper() {
  enAttente.splice(0).forEach(terminer);
  [...actifs].forEach(terminer);
  document.querySelectorAll('.media.a-developper').forEach((m) => { m.classList.remove('a-developper'); m.classList.add('developpee'); });
  document.querySelectorAll('canvas.developpement').forEach((c) => c.remove());
}

/** Développe tout de suite une photo (ouverture). Sans WebGL : la photo se découvre de bas en haut. */
export async function developper(media, { duree = 1600, avant } = {}) {
  const it = await preparer(media);
  if (!it) {
    avant && avant();
    if (media && media.animate && !media.classList.contains('developpee')) {
      media.classList.add('developpee');
      await media.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: duree * .7, easing: 'cubic-bezier(.65,0,.35,1)' }).finished.catch(() => {});
    }
    return;
  }
  return jouer(it, { duree, avant });
}

/** Toutes les autres photos : cachées un peu avant d'entrer à l'écran, développées quand elles y sont. */
export function armerDeveloppements(selecteur, { exclure } = {}) {
  const medias = [...document.querySelectorAll(selecteur)].filter((m) => !(exclure && m.matches(exclure)));
  if (!medias.length || !('IntersectionObserver' in window) || !webgl()) return;
  const prets = new Map();
  const jouerIo = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    jouerIo.unobserve(e.target);
    const p = prets.get(e.target);
    if (p) p.then((it) => it && jouer(it));
  }), { threshold: .2 });
  const armerIo = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    armerIo.unobserve(e.target);
    prets.set(e.target, preparer(e.target));
    jouerIo.observe(e.target);
  }), { rootMargin: '0px 0px 30% 0px' });
  medias.forEach((m) => armerIo.observe(m));
}

/** Bulles de fermentation et vapeur sur une photo (canvas 2D, densité 1). */
export function bullesEtVapeur(cadre, { souris = false } = {}) {
  if (!cadre) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'bulles';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-audit-ignorer', '');
  cadre.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, visible = false, raf = 0, dernier = 0;
  const pointeur = { x: -1e4, y: -1e4 };
  const bulles = [], vapeurs = [];
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 128;
  const sc = sprite.getContext('2d');
  const g = sc.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.5, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  sc.fillStyle = g; sc.fillRect(0, 0, 128, 128);
  const nouvelle = (b, depart) => {
    b.x = Math.random() * w; b.y = depart ? Math.random() * h : h + Math.random() * 40;
    b.r = .8 + Math.random() * 2.6; b.v = 14 + Math.random() * 34 + b.r * 6; b.o = Math.random() * 6.28; b.a = .25 + Math.random() * .45;
    return b;
  };
  const nouvelleVapeur = (s, depart) => {
    s.x = w * (.15 + Math.random() * .7); s.y = depart ? h * (.2 + Math.random() * .7) : h * (.75 + Math.random() * .25);
    s.r = Math.max(w, h) * (.18 + Math.random() * .22); s.v = 6 + Math.random() * 10; s.vie = 0; s.duree = 7 + Math.random() * 6;
    return s;
  };
  const ECHELLE = .5;
  const taille = () => {
    const r = cadre.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    canvas.width = Math.max(1, Math.round(w * ECHELLE)); canvas.height = Math.max(1, Math.round(h * ECHELLE));
    ctx.setTransform(ECHELLE, 0, 0, ECHELLE, 0, 0);
    bulles.length = 0; vapeurs.length = 0;
    const n = Math.round(Math.min(40, (w * h) / 10000));
    for (let i = 0; i < n; i++) bulles.push(nouvelle({}, true));
    for (let i = 0; i < 4; i++) vapeurs.push(nouvelleVapeur({}, true));
  };
  const dessiner = (now) => {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min(.05, (now - (dernier || now)) / 1000); dernier = now;
    ctx.clearRect(0, 0, w, h);
    for (const s of vapeurs) {
      s.vie += dt; s.y -= s.v * dt; s.x += Math.sin((s.vie + s.r) * .4) * 4 * dt;
      const a = Math.sin(Math.min(1, s.vie / s.duree) * Math.PI) * .32;
      if (s.vie >= s.duree) nouvelleVapeur(s, false);
      ctx.globalAlpha = a; ctx.drawImage(sprite, s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
    }
    ctx.globalAlpha = 1;
    for (const b of bulles) {
      b.o += dt * 2.2; b.y -= b.v * dt; b.x += Math.sin(b.o) * 8 * dt;
      const dx = b.x - pointeur.x, dy = b.y - pointeur.y, d2 = dx * dx + dy * dy;
      if (d2 < 7000) { const f = (1 - d2 / 7000) * 90 * dt; const d = Math.sqrt(d2) || 1; b.x += (dx / d) * f; b.y += (dy / d) * f; }
      if (b.y < -10 || b.x < -10 || b.x > w + 10) nouvelle(b, false);
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283);
      ctx.strokeStyle = `rgba(255,250,240,${b.a})`; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${b.a * .35})`; ctx.fill();
    }
    raf = requestAnimationFrame(dessiner);
  };
  const lancer = () => { if (!raf && visible) { dernier = 0; raf = requestAnimationFrame(dessiner); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; lancer(); }).observe(cadre);
  new ResizeObserver(() => taille()).observe(cadre);
  document.addEventListener('visibilitychange', lancer);
  if (souris) {
    cadre.addEventListener('pointermove', (e) => { const r = cadre.getBoundingClientRect(); pointeur.x = e.clientX - r.left; pointeur.y = e.clientY - r.top; });
    cadre.addEventListener('pointerleave', () => { pointeur.x = pointeur.y = -1e4; });
  }
  taille();
  requestAnimationFrame(() => canvas.classList.add('visible'));
}

/** Tube de niveau : se remplit selon la lecture ; une graduation par section numérotée. */
export function jauge() {
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (sections.length < 3) return;
  const el = document.createElement('div');
  el.className = 'jauge';
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('data-audit-ignorer', '');
  el.innerHTML = '<span class="jauge-tube"><span class="jauge-liquide"><span class="jauge-mousse"></span></span></span><span class="jauge-graduations"></span>';
  document.body.appendChild(el);
  const grad = el.querySelector('.jauge-graduations'), liquide = el.querySelector('.jauge-liquide');
  let reperes = [], raf = 0, H = 1, courantAvant = -2;
  const mesurer = () => {
    H = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    courantAvant = -2;
    grad.innerHTML = '';
    reperes = sections.map((s) => {
      const y = Math.min(1, Math.max(0, (s.getBoundingClientRect().top + scrollY - innerHeight * .3) / Math.max(1, H)));
      const g = document.createElement('i'); g.style.top = `${(1 - y) * 100}%`; grad.appendChild(g);
      return { y, g };
    });
    maj();
  };
  const maj = () => {
    raf = 0;
    const p = Math.min(1, Math.max(0, scrollY / H));
    liquide.style.transform = `translateY(${((1 - p) * 100).toFixed(2)}%)`;
    let courant = -1;
    reperes.forEach((r, i) => { if (p >= r.y - .002) courant = i; });
    if (courant !== courantAvant) { courantAvant = courant; reperes.forEach((r, i) => r.g.classList.toggle('atteint', i <= courant)); }
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(maj); }, { passive: true });
  new ResizeObserver(() => mesurer()).observe(document.body);
  mesurer();
}
