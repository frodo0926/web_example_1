import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/data/content";
import { gsap, prefersReducedMotion, isDesktopViewport } from "@/lib/anim";
import { SmartImage } from "@/components/ui";
import type { Route } from "@/lib/router";
import { cn } from "@/utils/cn";

/** Lista de servicios con imagen flotante que sigue al cursor. */
export default function ServiceList({
  onNavigate,
  dark = true,
}: {
  onNavigate: (r: Route) => void;
  dark?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = floatRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    if (prefersReducedMotion() || !isDesktopViewport()) {
      gsap.set(el, { autoAlpha: 0 });
      return;
    }
    gsap.set(el, { autoAlpha: 0, xPercent: -50, yPercent: -50, scale: 0.9 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };

    wrap.addEventListener("pointermove", onMove);
    return () => wrap.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const el = floatRef.current;
    if (!el || prefersReducedMotion() || !isDesktopViewport()) return;
    gsap.to(el, {
      autoAlpha: active === null ? 0 : 1,
      scale: active === null ? 0.88 : 1,
      duration: 0.55,
      ease: "expo.out",
    });
  }, [active]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Imagen flotante */}
      <div
        ref={floatRef}
        className="pointer-events-none absolute left-0 top-0 z-20 hidden w-[330px] lg:block"
        aria-hidden="true"
      >
        <div className="relative overflow-hidden rounded-sm">
          {SERVICES.map((s, i) => (
            <div
              key={s.slug}
              className={cn(
                "transition-opacity duration-500",
                i === 0 ? "" : "absolute inset-0",
                active === i ? "opacity-100" : "opacity-0",
              )}
            >
              <SmartImage src={s.image} alt={s.title} ratio="4/3" priority={false} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="mono text-[0.6rem] text-white/60">
            {active !== null ? SERVICES[active].short : ""}
          </span>
          <span className="mono text-[0.6rem] text-ember">
            {active !== null ? SERVICES[active].index : ""}
          </span>
        </div>
      </div>

      <ul className={cn("border-t", dark ? "border-white/12" : "border-ink/12")}>
        {SERVICES.map((s, i) => (
          <li
            key={s.slug}
            data-reveal=""
            data-delay={i * 0.05}
            className={cn(
              "group relative border-b transition-colors duration-500",
              dark ? "border-white/12" : "border-ink/12",
            )}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <a
              href="#/servicios"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("servicios");
              }}
              data-cursor="link"
              className="flex items-center gap-4 py-6 md:gap-10 md:py-9"
            >
              <span
                className={cn(
                  "mono w-8 shrink-0 text-[0.68rem] transition-colors duration-500",
                  dark ? "text-white/40" : "text-ink/40",
                  "group-hover:text-ember",
                )}
              >
                {s.index}
              </span>

              <div className="flex-1">
                <h3
                  className={cn(
                    "h-display text-[clamp(1.5rem,4.4vw,3.6rem)] leading-[0.95] transition-transform duration-700",
                    dark
                      ? "text-white group-hover:text-white"
                      : "text-ink group-hover:text-ink",
                    "md:group-hover:translate-x-3",
                  )}
                >
                  {s.title}
                </h3>
                <p
                  className={cn(
                    "mt-2 max-w-[52ch] text-[0.85rem] leading-relaxed transition-colors duration-500 lg:hidden",
                    dark ? "text-white/50" : "text-ink/55",
                  )}
                >
                  {s.description}
                </p>
                <p
                  className={cn(
                    "mt-2 hidden max-w-[52ch] text-[0.85rem] leading-relaxed transition-all duration-700 lg:block",
                    dark ? "text-white/45" : "text-ink/50",
                    active === i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
                  )}
                >
                  {s.short} — {s.bullets[0]}
                </p>
              </div>

              {/* imagen inline en móvil */}
              <div className="w-[34%] shrink-0 lg:hidden">
                <SmartImage src={s.image} alt={s.title} ratio="4/3" className="rounded-sm" />
              </div>

              <span
                className={cn(
                  "hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs transition-all duration-500 lg:flex",
                  dark
                    ? "border-white/20 text-white/70 group-hover:border-ember group-hover:bg-ember group-hover:text-white"
                    : "border-ink/20 text-ink/70 group-hover:border-ember group-hover:bg-ember group-hover:text-white",
                )}
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
