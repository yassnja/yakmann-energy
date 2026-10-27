// Animations pilotées par le défilement (GSAP + ScrollTrigger).
// Tout est déclaré dans gsap.matchMedia : rien ne s'exécute si l'utilisateur
// préfère un mouvement réduit, et les effets lourds sont réservés aux grands écrans.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
  {
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 62.001rem)',
  },
  (context) => {
    const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
    if (!motion) return;

    /* ------------------------------------------------ Compteurs */
    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el, i) => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? '';
      // La valeur réelle reste affichée tant que le compteur n'a pas démarré
      const state = { v: 0 };
      gsap.to(state, {
        v: end,
        duration: end > 100 ? 2.2 : 1.6,
        // Au chargement, attendre la fin de l'entrée du hero ; au défilement, démarrer aussitôt
        delay: (el.getBoundingClientRect().top < window.innerHeight ? 0.9 : 0) + i * 0.12,
        ease: 'expo.out',
        onUpdate: () => (el.textContent = `${Math.round(state.v)}${suffix}`),
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      });
    });

    /* ------------------------------------------------ Hero : profondeur au défilement */
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
      });
      tl.to('[data-hero-img]', { yPercent: 8, ease: 'none' }, 0)
        .to('.hero-copy', { y: desktop ? -70 : -24, ease: 'none' }, 0)
        .to('.hero-visual .waves', { xPercent: -12, ease: 'none' }, 0)
        .to('[data-circuit]', { yPercent: 18, ease: 'none' }, 0);

      // La vague monte et « recouvre » le hero en entrant dans la section suivante
      gsap.fromTo(
        '[data-divider]',
        { scaleY: 0.35 },
        {
          scaleY: 1.35,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'center top', end: 'bottom top', scrub: true },
        },
      );
    }

    /* ------------------------------------------------ Parallaxe légère des images masquées */
    if (desktop) {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    }
  },
);

// Les images chargées en différé changent la hauteur de page : on recalcule une fois tout chargé.
window.addEventListener('load', () => ScrollTrigger.refresh());

export { gsap, ScrollTrigger, mm };
