import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/anim";
import { landGrid } from "@/lib/world";
import { COLOMBIA_CITIES, OFFICES, TICKER_SERVICES } from "@/data/content";
import { Marquee } from "@/components/ui";
import { Logo } from "@/components/Logo";

const HIGHLIGHT = OFFICES.find((o) => o.highlight) ?? null;

let grid: { lat: number; lon: number; order: number }[] | null = null;

function buildGrid() {
  if (grid) return grid;
  const pts = landGrid(2.4);
  grid = pts.map((p) => ({
    ...p,
    order: (p.lon + 180) / 360 + Math.random() * 0.42,
  }));
  grid.sort((a, b) => a.order - b.order);
  return grid;
}

export default function Preloader({
  onReveal,
  onDone,
}: {
  onReveal: () => void;
  onDone: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = buildGrid();
    let dpr = 1;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(root);

    let painted = -1;
    const paint = (p: number) => {
      ctx.clearRect(0, 0, w, h);
      const mapW = Math.min(w * 0.86, 1080);
      const mapH = mapW * 0.42;
      const ox = (w - mapW) / 2;
      const oy = h * 0.34 - mapH / 2;
      const total = dots.length;
      const count = Math.floor(total * p);
      const r = Math.max(1.1, mapW / 460);

      if (count !== painted) {
        painted = count;
      }

      // retícula base tenue
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      const cols = 44;
      const rows = 20;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          ctx.fillRect(ox + (i / cols) * mapW, oy + (j / rows) * mapH, 1, 1);
        }
      }

      for (let i = 0; i < count; i++) {
        const d = dots[i];
        const x = ox + ((d.lon + 180) / 360) * mapW;
        const y = oy + ((80 - d.lat) / 142) * mapH;
        const fade = Math.min(1, (count - i) / 26);
        ctx.fillStyle = `rgba(250,250,250,${0.28 + fade * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Punto rojo destacado — ubicación de Colombia
      if (HIGHLIGHT) {
        const hx = ox + ((HIGHLIGHT.lon + 180) / 360) * mapW;
        const hy = oy + ((80 - HIGHLIGHT.lat) / 142) * mapH;
        const alpha = Math.min(1, p * 1.5);
        const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 480);

        ctx.strokeStyle = `rgba(255,45,45,${0.45 * alpha * (0.4 + pulse * 0.6)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(hx, hy, r * 2 + 3 + pulse * 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,45,45,${0.95 * alpha})`;
        ctx.beginPath();
        ctx.arc(hx, hy, r * 1.9, 0, Math.PI * 2);
        ctx.fill();

        // Etiqueta de la sede sobre una ficha oscura con línea guía,
        // para que se lea bien incluso encima de los puntos del mapa.
        const cityTxt = HIGHLIGHT.city.toUpperCase();
        const regionTxt = HIGHLIGHT.country.toUpperCase();
        ctx.font = "600 11px 'IBM Plex Mono', ui-monospace, monospace";
        const wCity = ctx.measureText(cityTxt).width;
        ctx.font = "500 9.5px 'IBM Plex Mono', ui-monospace, monospace";
        const wRegion = ctx.measureText(regionTxt).width;
        const chipW = Math.max(wCity, wRegion) + 24;
        const chipH = 36;

        // Posición preferida: abajo-derecha; si no cabe, se repliega al otro lado.
        let lx = hx + 16;
        let ly = hy + 16;
        if (lx + chipW > w - 10) lx = hx - chipW - 16;
        if (ly + chipH > h * 0.72) ly = hy - chipH - 16;

        // Línea guía desde el punto hasta la esquina de la ficha
        ctx.strokeStyle = `rgba(255,45,45,${0.65 * alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(lx < hx ? lx + chipW : lx, ly < hy ? ly + chipH : ly);
        ctx.stroke();

        // Ficha
        const rr = (x: number, y: number, rw: number, rh: number, rad: number) => {
          ctx.beginPath();
          ctx.moveTo(x + rad, y);
          ctx.arcTo(x + rw, y, x + rw, y + rh, rad);
          ctx.arcTo(x + rw, y + rh, x, y + rh, rad);
          ctx.arcTo(x, y + rh, x, y, rad);
          ctx.arcTo(x, y, x + rw, y, rad);
          ctx.closePath();
        };
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(8,8,8,0.85)";
        rr(lx, ly, chipW, chipH, 6);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,45,45,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.font = "600 11px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.fillText(cityTxt, lx + 12, ly + 15);
        ctx.fillStyle = "rgba(255,120,60,0.9)";
        ctx.font = "500 9.5px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.fillText(regionTxt, lx + 12, ly + 27.5);
        ctx.restore();
      }
    };

    paint(0);

    const state = { v: 0 };
    const handleDone = async () => {
      setLeaving(true);
      // Esperamos a que las tipografías del sitio estén listas (con tope de
      // seguridad) para que la página no "refresque" ni reflowee al revelarse.
      try {
        await Promise.race([
          Promise.all([
            document.fonts.load('700 1em "Archivo"'),
            document.fonts.load('600 1em "Archivo"'),
            document.fonts.load('400 1em "Inter"'),
            document.fonts.load('500 1em "IBM Plex Mono"'),
          ]),
          new Promise((r) => setTimeout(r, 1400)),
        ]);
      } catch {
        /* si la API de fuentes falla, seguimos igualmente */
      }
      // montamos la página debajo de la cortina antes de levantarla
      onReveal();
      gsap
        .timeline({
          delay: 0.06,
          onComplete: () => {
            ro.disconnect();
            onDone();
          },
        })
        .to(root, {
          yPercent: -100,
          duration: reduced ? 0.01 : 1.2,
          ease: "expo.inOut",
        });
    };

    const tween = gsap.to(state, {
      v: 100,
      duration: reduced ? 0.4 : 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = state.v;
        setPct(Math.round(v));
        paint(v / 100);
      },
      onComplete: handleDone,
    });

    // Safety: si el usuario interactúa, aceleramos
    const skip = () => tween.progress(0.99, true);
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      window.removeEventListener("pointerdown", skip);
      tween.kill();
      ro.disconnect();
    };
  }, [onReveal, onDone]);

  return (
    <div
      ref={rootRef}
      className="grain fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden bg-ink text-white"
      aria-hidden="true"
      style={{ willChange: "transform" }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[12%] top-[18%] h-[46vw] w-[46vw] rounded-full bg-electric/25 blur-[120px]" />
        <div className="absolute -right-[10%] bottom-[8%] h-[32vw] w-[32vw] rounded-full bg-ember/15 blur-[130px]" />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <header className="shell relative z-10 flex items-center justify-between pt-8">
        <div className="flex items-center gap-3">
          <Logo className="text-white" />
          <span className="label opacity-40">Taller de autor</span>
        </div>
        <span className="label opacity-40">MMXXVI</span>
      </header>

      <div className="shell relative z-10 flex items-end justify-between gap-8 pb-6">
        <div className="max-w-[38ch]">
          <p className="label mb-3 text-ember">Cargando taller</p>
          <p className="text-sm leading-relaxed text-white/55">
            Sogamoso, Boyacá · 9 países · 120 artesanos · 2.500 piezas al mes
          </p>
        </div>
        <div className="flex items-end gap-3 tabular-nums">
          <span className="mono text-[clamp(3rem,13vw,9rem)] leading-[0.8] tracking-[-0.04em]">
            {String(pct).padStart(3, "0")}
          </span>
          <span className="label pb-4 opacity-50">/100</span>
        </div>
      </div>

      <div
        className="relative z-10 border-t border-white/10 transition-opacity duration-500"
        style={{ opacity: leaving ? 0 : 1 }}
      >
        <Marquee
          items={COLOMBIA_CITIES}
          className="border-b border-white/10 py-3 text-white/60"
          duration={170}
        />
        <Marquee
          items={TICKER_SERVICES}
          className="py-3 text-ember/70"
          duration={28}
        />
      </div>
    </div>
  );
}
