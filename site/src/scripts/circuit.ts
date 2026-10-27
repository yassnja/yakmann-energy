// « Circuit vivant » du hero : un réseau de tracés orthogonaux, façon schéma unifilaire,
// parcouru par des impulsions de courant. Le pointeur alimente les tracés qu'il approche.
// Canvas 2D, mis en pause hors écran ; image fixe si « mouvement réduit ».

interface Trace {
  pts: { x: number; y: number }[];
  cum: number[];
  length: number;
  energy: number;
}
interface Pulse {
  trace: Trace;
  d: number;
  speed: number;
}

const CELL = 36;
const TRAIL = 70;


export function initCircuit(canvas: HTMLCanvasElement, opts: { reduced: boolean; interactive: boolean }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  // Share the CSS brand palette so canvas effects follow the current identity.
  const palette = getComputedStyle(canvas);
  const color = (name: string) => palette.getPropertyValue(name).trim().split(/\s+/).join(', ');
  const INK = color('--ink-rgb');
  const ACCENT = color('--accent-rgb');
  const base = document.createElement('canvas');
  const bctx = base.getContext('2d')!;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let traces: Trace[] = [];
  let pulses: Pulse[] = [];
  let running = false;
  let visible = true;
  let last = 0;
  let spawnClock = 0;
  const pointer = { x: -999, y: -999, lastSpawn: 0 };

  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const randInt = (a: number, b: number) => Math.floor(rand(a, b + 1));

  function buildTrace(): Trace | null {
    const cols = Math.floor(w / CELL);
    const rows = Math.floor(h / CELL);
    if (cols < 4 || rows < 4) return null;
    let x = randInt(0, cols) * CELL;
    let y = randInt(0, rows) * CELL;
    const pts = [{ x, y }];
    let horizontal = Math.random() > 0.5;
    const segments = randInt(2, 5);
    for (let s = 0; s < segments; s++) {
      const len = randInt(2, 7) * CELL * (Math.random() > 0.5 ? 1 : -1);
      if (horizontal) x = Math.max(0, Math.min(cols * CELL, x + len));
      else y = Math.max(0, Math.min(rows * CELL, y + len));
      const prev = pts[pts.length - 1];
      if (prev.x !== x || prev.y !== y) pts.push({ x, y });
      horizontal = !horizontal;
    }
    if (pts.length < 2) return null;
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    return { pts, cum, length: cum[cum.length - 1], energy: 0 };
  }

  function pointAt(t: Trace, d: number) {
    const dd = Math.max(0, Math.min(t.length, d));
    let i = 1;
    while (i < t.cum.length - 1 && t.cum[i] < dd) i++;
    const a = t.pts[i - 1];
    const b = t.pts[i];
    const seg = t.cum[i] - t.cum[i - 1] || 1;
    const k = (dd - t.cum[i - 1]) / seg;
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, i };
  }

  function tracePath(c: CanvasRenderingContext2D, t: Trace) {
    c.beginPath();
    c.moveTo(t.pts[0].x, t.pts[0].y);
    for (let i = 1; i < t.pts.length; i++) c.lineTo(t.pts[i].x, t.pts[i].y);
  }

  function drawBase() {
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.clearRect(0, 0, w, h);
    bctx.lineWidth = 1;
    // Plus discret sous le texte (à gauche), plus présent côté visuel
    const fade = bctx.createLinearGradient(0, 0, w, 0);
    fade.addColorStop(0, `rgba(${INK}, 0.045)`);
    fade.addColorStop(0.5, `rgba(${INK}, 0.06)`);
    fade.addColorStop(1, `rgba(${INK}, 0.1)`);
    bctx.strokeStyle = fade;
    for (const t of traces) {
      tracePath(bctx, t);
      bctx.stroke();
    }
    for (const t of traces) {
      const s = t.pts[0];
      const e = t.pts[t.pts.length - 1];
      bctx.fillStyle = `rgba(${INK}, 0.22)`;
      bctx.fillRect(s.x - 2, s.y - 2, 4, 4);
      bctx.strokeStyle = `rgba(${INK}, 0.28)`;
      bctx.beginPath();
      bctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
      bctx.stroke();
    }
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = Math.round(r.width);
    h = Math.round(r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const c of [canvas, base]) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    const count = Math.round((w * h) / (CELL * CELL * 14));
    traces = [];
    for (let i = 0; i < count; i++) {
      const t = buildTrace();
      if (t) traces.push(t);
    }
    pulses = [];
    drawBase();
    render();
  }

  function spawn(t?: Trace) {
    const trace = t ?? traces[randInt(0, traces.length - 1)];
    if (!trace || pulses.length > 28) return;
    pulses.push({ trace, d: 0, speed: rand(140, 260) });
  }

  function render() {
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    ctx!.drawImage(base, 0, 0);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Tracés alimentés par le pointeur
    for (const t of traces) {
      if (t.energy < 0.02) continue;
      ctx!.strokeStyle = `rgba(${ACCENT}, ${0.5 * t.energy})`;
      ctx!.lineWidth = 1.25;
      tracePath(ctx!, t);
      ctx!.stroke();
    }

    // Impulsions : traîne en dégradé + tête lumineuse
    ctx!.lineCap = 'round';
    for (const p of pulses) {
      const head = pointAt(p.trace, p.d);
      const tail = pointAt(p.trace, p.d - TRAIL);
      const grad = ctx!.createLinearGradient(tail.x, tail.y, head.x, head.y);
      grad.addColorStop(0, `rgba(${ACCENT}, 0)`);
      grad.addColorStop(1, `rgba(${ACCENT}, 0.9)`);
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(tail.x, tail.y);
      for (let i = tail.i; i < head.i; i++) ctx!.lineTo(p.trace.pts[i].x, p.trace.pts[i].y);
      ctx!.lineTo(head.x, head.y);
      ctx!.stroke();
      ctx!.fillStyle = `rgba(${ACCENT}, 1)`;
      ctx!.beginPath();
      ctx!.arc(head.x, head.y, 2.2, 0, Math.PI * 2);
      ctx!.fill();
    }
  }

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    spawnClock += dt;
    if (spawnClock > 0.45) {
      spawnClock = 0;
      spawn();
    }
    for (const p of pulses) p.d += p.speed * dt;
    pulses = pulses.filter((p) => p.d - TRAIL < p.trace.length);
    for (const t of traces) t.energy *= 0.94;
    render();
    requestAnimationFrame(frame);
  }

  function start() {
    if (running || opts.reduced || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  const stop = () => (running = false);

  // Le pointeur « alimente » les tracés proches
  if (opts.interactive && !opts.reduced) {
    const host = canvas.parentElement!;
    host.addEventListener(
      'pointermove',
      (e) => {
        const r = canvas.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
        const now = performance.now();
        for (const t of traces) {
          for (const p of t.pts) {
            if (Math.abs(p.x - pointer.x) < 70 && Math.abs(p.y - pointer.y) < 70) {
              t.energy = 1;
              if (now - pointer.lastSpawn > 140) {
                pointer.lastSpawn = now;
                spawn(t);
              }
              break;
            }
          }
        }
      },
      { passive: true },
    );
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  let resizeTimer = 0;
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    // Ignore les variations de hauteur dues aux barres mobiles
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 200);
  });

  resize();
  if (opts.reduced) {
    // Image fixe : quelques tracés allumés, sans animation
    traces.slice(0, 6).forEach((t) => (t.energy = 0.8));
    render();
  } else {
    for (let i = 0; i < 4; i++) spawn();
    start();
  }
}
