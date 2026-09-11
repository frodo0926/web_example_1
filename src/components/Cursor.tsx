import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/anim";

/** Cursor personalizado: punto + anillo con blend difference. Solo puntero fino. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    gsap.set(ring, { width: 38, height: 38, border: "1px solid rgba(255,255,255,0.6)" });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.16, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.16, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "[data-cursor], a, button",
      ) as HTMLElement | null;
      if (!target) {
        gsap.to(ring, {
          width: 38,
          height: 38,
          backgroundColor: "rgba(255,255,255,0)",
          borderColor: "rgba(255,255,255,0.6)",
          duration: 0.35,
        });
        return;
      }
      const kind = target.dataset.cursor;
      const big = kind === "button" || target.tagName === "BUTTON";
      gsap.to(ring, {
        width: big ? 78 : 62,
        height: big ? 78 : 62,
        backgroundColor: "rgba(255,255,255,0.14)",
        borderColor: "rgba(255,255,255,0.15)",
        duration: 0.4,
        ease: "expo.out",
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot hidden h-[6px] w-[6px] bg-white md:block"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring hidden rounded-full md:block"
        aria-hidden="true"
      />
    </>
  );
}
