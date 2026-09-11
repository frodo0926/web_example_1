import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isDesktopViewport = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 992px)").matches;

export const EXPO = "expo.out" as const;

let lenis: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) return null;
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
    wheelMultiplier: 0.95,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function destroySmoothScroll() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function lockScroll(lock: boolean) {
  if (!lenis) {
    document.body.style.overflow = lock ? "hidden" : "";
    return;
  }
  if (lock) lenis.stop();
  else lenis.start();
}

export function scrollTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function killTriggersByScope(scope: HTMLElement | null) {
  if (!scope) return;
  ScrollTrigger.getAll().forEach((t) => {
    const el = t.trigger as HTMLElement | undefined;
    if (el && scope.contains(el)) t.kill();
  });
}

/** Fade + translate-up on scroll for every [data-reveal] inside the scope. */
export function initReveals(scope: HTMLElement) {
  if (prefersReducedMotion()) {
    gsap.set(scope.querySelectorAll("[data-reveal]"), { opacity: 1, y: 0, clearProps: "all" });
    return;
  }
  const items = scope.querySelectorAll<HTMLElement>("[data-reveal]");
  items.forEach((el) => {
    const delay = Number(el.dataset.delay ?? 0);
    gsap.fromTo(
      el,
      { y: Number(el.dataset.y ?? 42), autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.1,
        delay,
        ease: EXPO,
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    );
  });

  // Parallax sutil en imágenes marcadas
  scope.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax || 10);
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  });
}

/** Split por palabras con máscara — devuelve los spans para animar. */
export function splitWords(el: HTMLElement) {
  const text = el.textContent ?? "";
  el.textContent = "";
  const words: HTMLElement[] = [];
  text.split(/\s+/).forEach((w, i, arr) => {
    const line = document.createElement("span");
    line.className = "split-line";
    const word = document.createElement("span");
    word.className = "split-word";
    word.textContent = w;
    line.appendChild(word);
    el.appendChild(line);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
    words.push(word);
  });
  return words;
}
