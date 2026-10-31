/* Révélation à l'encre des photos d'ouverture : le papier se retire en taches d'encre bleu nuit.
   Un seul passage (environ 1,3 s), puis le canvas disparaît. Densité de pixels limitée (1,25 ordinateur, 1 téléphone),
   le shader ne calcule que le bruit du pixel. Sans WebGL : simple masque qui découvre la photo. */

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FRAG = `precision mediump float;
varying vec2 v; uniform float t; uniform vec2 r; uniform vec3 papier; uniform vec3 encre;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int k = 0; k < 4; k++) { s += a * n(p); p = p * 2.03 + 7.1; a *= .5; } return s; }
void main(){
  vec2 q = v * vec2(r.x / r.y, 1.) * 3.2;
  float d = fbm(q) * .62 + (1. - v.y) * .22 + v.x * .16;
  float bord = smoothstep(t - .07, t - .015, d) - smoothstep(t - .015, t + .01, d);
  float reste = smoothstep(t - .015, t + .01, d);
  vec3 c = mix(papier, encre, clamp(bord * 1.6, 0., 1.));
  gl_FragColor = vec4(c, max(reste, bord));
}`;

function hexEnVec(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

function sansWebgl(cadre, duree) {
  const media = cadre.querySelector('.media');
  cadre.classList.add('revelee');
  if (!media || !media.animate) return Promise.resolve();
  const a = media.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: duree, easing: 'cubic-bezier(.65,0,.35,1)' });
  return a.finished.catch(() => {});
}

/**
 * @param {HTMLElement} cadre élément [data-encre] qui contient la photo
 * @param {{ duree?: number, papier?: string, encre?: string }} o
 */
export function revelerEncre(cadre, { duree = 1300, papier = '#fbf8f2', encre = '#14213d' } = {}) {
  if (!cadre || cadre.classList.contains('revelee')) return Promise.resolve();
  const canvas = document.createElement('canvas');
  canvas.className = 'encre';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('data-audit-ignorer', '');
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: true });
  if (!gl) return sansWebgl(cadre, duree);
  const dpr = Math.min(window.devicePixelRatio || 1, matchMedia('(max-width: 760px)').matches ? 1 : 1.25);
  const w = Math.max(1, Math.round(cadre.clientWidth * dpr)), hgt = Math.max(1, Math.round(cadre.clientHeight * dpr));
  canvas.width = w; canvas.height = hgt;
  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return sansWebgl(cadre, duree);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uT = gl.getUniformLocation(prog, 't');
  gl.uniform2f(gl.getUniformLocation(prog, 'r'), w, hgt);
  gl.uniform3fv(gl.getUniformLocation(prog, 'papier'), hexEnVec(papier));
  gl.uniform3fv(gl.getUniformLocation(prog, 'encre'), hexEnVec(encre));
  gl.viewport(0, 0, w, hgt);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const dessiner = (t) => { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uT, t); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  /* Première image : papier plein ; la photo devient visible dessous dans la même image. */
  dessiner(-.2);
  cadre.appendChild(canvas);
  /* La photo ne passe visible que lorsque le papier du canvas est affiché (deux images plus tard) : aucun éclair. */
  let images = 0;
  return new Promise((fin) => {
    const t0 = performance.now();
    const pas = (now) => {
      if (++images === 2) cadre.classList.add('revelee');
      const p = Math.min(1, (now - t0) / duree);
      const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      dessiner(-.2 + e * 1.45);
      if (p < 1 && !document.hidden) requestAnimationFrame(pas);
      else { cadre.classList.add('revelee'); canvas.remove(); const ext = gl.getExtension('WEBGL_lose_context'); ext && ext.loseContext(); fin(); }
    };
    requestAnimationFrame(pas);
  });
}

/* État final : la photo visible, sans canvas. */
export function encreFinale() {
  document.querySelectorAll('[data-encre]').forEach((c) => {
    c.classList.add('revelee');
    c.querySelectorAll('canvas.encre').forEach((x) => x.remove());
  });
}
