// Micro-interactions globales : progression de lecture, curseur, boutons magnétiques, inclinaison 3D.
// Le curseur, l'aimantation et l'inclinaison ne s'activent qu'avec une souris
// (pointeur fin) et sans préférence « mouvement réduit ».

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------------------------------------------------------------- Progression */
function initProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-current';
  bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);
  let queued = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', String(max > 0 ? Math.min(window.scrollY / max, 1) : 0));
    queued = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

/* ---------------------------------------------------------------- Curseur */
function initCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor is-out';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor-ring"><span class="cursor-label"></span></span><span class="cursor-dot"></span>';
  document.body.append(cursor);
  document.documentElement.classList.add('has-cursor');

  const ring = cursor.querySelector<HTMLElement>('.cursor-ring')!;
  const dot = cursor.querySelector<HTMLElement>('.cursor-dot')!;
  const label = cursor.querySelector<HTMLElement>('.cursor-label')!;
  const target = { x: -100, y: -100 };
  const ringPos = { x: -100, y: -100 };

  const place = (el: HTMLElement, x: number, y: number) => {
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      place(dot, target.x, target.y);
      cursor.classList.remove('is-out');
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => cursor.classList.add('is-out'));
  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

  // États selon l'élément survolé
  document.addEventListener('pointerover', (e) => {
    const el = e.target as HTMLElement;
    const labelled = el.closest<HTMLElement>('[data-cursor]');
    const field = el.closest('input, textarea, select');
    const interactive = el.closest('a, button, label, [role="button"]');
    cursor.classList.toggle('is-text', Boolean(field));
    cursor.classList.toggle('is-label', Boolean(labelled));
    cursor.classList.toggle('is-hover', Boolean(interactive) && !labelled);
    label.textContent = labelled?.dataset.cursor ?? '';
  });

  const tick = () => {
    ringPos.x = lerp(ringPos.x, target.x, 0.2);
    ringPos.y = lerp(ringPos.y, target.y, 0.2);
    place(ring, ringPos.x, ringPos.y);
    requestAnimationFrame(tick);
  };
  tick();
}

/* ---------------------------------------------------------------- Aimantation */
function initMagnetic() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.35;
    const inner = el.querySelector<HTMLElement>('.btn-label, .arrow');
    let raf = 0;
    const set = (x: number, y: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
        if (inner) inner.style.transform = `translate3d(${x * strength * 0.5}px, ${y * strength * 0.5}px, 0)`;
      });
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      set(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform 0.6s var(--ease-expo)';
      if (inner) inner.style.transition = 'transform 0.6s var(--ease-expo)';
      set(0, 0);
      window.setTimeout(() => {
        el.style.transition = '';
        if (inner) inner.style.transition = '';
      }, 600);
    });
  });
}

/* ---------------------------------------------------------------- Inclinaison 3D */
function initTilt() {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const max = Number(card.dataset.tilt) || 6;
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty('--rx', `${(-py * max).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(px * max).toFixed(2)}deg`);
        card.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`);
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

initProgress();
if (finePointer.matches && !reducedMotion.matches) {
  initCursor();
  initMagnetic();
  initTilt();
}
