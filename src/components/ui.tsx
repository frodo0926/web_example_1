import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, splitWords, EXPO, ScrollTrigger } from "@/lib/anim";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* SplitHeading — título dividido en palabras con máscara             */
/* ------------------------------------------------------------------ */
export function SplitHeading({
  children,
  className,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.07,
}: {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const words = splitWords(el);
    const tween = gsap.fromTo(
      words,
      { yPercent: 118, rotate: 2 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.25,
        delay,
        stagger,
        ease: EXPO,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [children, delay, stagger]);

  return (
    <Tag
      ref={ref as never}
      className={cn("h-display", className)}
      style={{ willChange: "transform" }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal — fade + translate on scroll                                */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "article" | "p" | "span" | "header" | "footer";
}) {
  return (
    <Tag
      data-reveal=""
      data-delay={delay}
      data-y={y}
      className={className}
      style={{ opacity: 0 }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* SmartImage — blur-up + srcset responsivo + lazy                    */
/* ------------------------------------------------------------------ */
function buildSrcSet(src: string) {
  if (!src.includes("images.pexels.com")) return undefined;
  const base = src.split("?")[0];
  return [480, 800, 1200, 1600, 2200]
    .map((w) => `${base}?auto=compress&cs=tinysrgb&w=${w} ${w}w`)
    .join(", ");
}

export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  parallax = false,
  priority = false,
  ratio,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallax?: boolean;
  priority?: boolean;
  ratio?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      img.dataset.loaded = "true";
      return;
    }
    const onLoad = () => (img.dataset.loaded = "true");
    img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, [src]);

  return (
    <div
      className={cn("media", parallax && "media--parallax", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <img
        ref={ref}
        src={src}
        srcSet={buildSrcSet(src)}
        sizes="(max-width: 767px) 100vw, (max-width: 1199px) 60vw, 50vw"
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        // @ts-expect-error fetchpriority es válido en HTML
        fetchpriority={priority ? "high" : undefined}
        decoding="async"
        data-parallax={parallax ? "8" : undefined}
        className={imgClassName}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Counter — contador animado al entrar en viewport                   */
/* ------------------------------------------------------------------ */
export function Counter({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
  duration = 2.1,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const format = (n: number) =>
      n.toLocaleString("es-ES", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    el.textContent = `${prefix}${format(0)}${suffix}`;

    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${format(value)}${suffix}`;
      return;
    }

    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => {
        el.textContent = `${prefix}${format(obj.v)}${suffix}`;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, decimals, suffix, prefix, duration]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      0
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee — cinta infinita                                            */
/* ------------------------------------------------------------------ */
export function Marquee({
  items,
  className,
  duration = 34,
  variant = "mono",
  pauseOnHover = false,
}: {
  items: string[];
  className?: string;
  duration?: number;
  variant?: "mono" | "display";
  pauseOnHover?: boolean;
}) {
  const row = (key: string) => (
    <div className="marquee__track" key={key} aria-hidden={key !== "a"}>
      {items.map((it, i) => (
        <span key={`${it}-${i}`} className="flex items-center whitespace-nowrap">
          <span
            className={
              variant === "mono"
                ? "label px-6 opacity-70"
                : "h-display px-8 text-[clamp(1.6rem,3.6vw,3.4rem)]"
            }
          >
            {it}
          </span>
          <span
            className={cn(
              "h-[5px] w-[5px] rounded-full",
              variant === "display" ? "bg-ember" : "bg-current opacity-40",
            )}
          />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("overflow-hidden", pauseOnHover && "marquee-pause", className)}
      style={{ ["--dur" as string]: `${duration}s` }}
    >
      <div className="marquee anim-marquee">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHead — label mono + índice                                   */
/* ------------------------------------------------------------------ */
export function SectionHead({
  index,
  label,
  className,
  dark = false,
}: {
  index: string;
  label: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        dark ? "text-white/45" : "text-ink/45",
        className,
      )}
    >
      <span className="label">{label}</span>
      <span className="mono text-[0.65rem] opacity-60">{index}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pill — etiqueta                                                     */
/* ------------------------------------------------------------------ */
export function Pill({
  children,
  dark = false,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 label",
        dark ? "border-white/20 text-white/70" : "border-ink/15 text-ink/60",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { ScrollTrigger };
