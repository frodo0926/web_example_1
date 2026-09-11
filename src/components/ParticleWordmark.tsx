import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/anim";

/**
 * "IRAKA" en matriz de puntos con físicas elásticas (estilo unitedcarriers).
 * Al entrar al footer el cursor nativo se oculta y lo reemplaza un disco de
 * sierra giratorio; los puntos dispersados se tiñen de aserrín (#c28542).
 */
/* ================================================================== */
/*  ⚙️ AJUSTES DE LA SIERRA — toca aquí para calibrar el efecto        */
/*  Documentación completa en docs/PROMPT_MAESTRO.md (§ Ajustes).      */
/* ================================================================== */
const CFG = {
  DOT_MIN: 0.9, // tamaño base de cada micropunto (px)
  DOT_VAR: 0.8, // variación aleatoria de tamaño (px)
  GAP_DIV: 330, // densidad: divisor del ancho (mayor = puntos más separados)
  GAP_MIN: 3, // paso mínimo entre puntos (px)
  RADIUS: 92, // radio de corte del disco (px)
  PUSH: 3.4, // fuerza con la que el disco empuja los puntos
  SWIRL: 0.3, // remolino del corte (0 = solo radial, 1 = muy girado)
  SPRING: 0.014, // velocidad de regreso al sitio (MENOR = restauración más lenta)
  SPRING_VAR: 0.012, // variación por punto → regresan desincronizados, orgánico
  DAMP: 0.89, // fricción (mayor = flotan más tiempo antes de asentarse)
  TINT_AT: 46, // px de desplazamiento para el tinte aserrín completo
  DUST_MAX: 160, // motas de aserrín simultáneas
  DUST_CHANCE: 0.5, // probabilidad de soltar viruta al cortar fuerte
  SAW_SPEED: 0.38, // segundos por vuelta del disco (menor = gira más rápido)
  SAW_LERP: 0.35, // suavizado de seguimiento (1 = pegado al cursor)
};

const WOOD = [194, 133, 66];
const BASE = [250, 250, 250];
const R2 = CFG.RADIUS * CFG.RADIUS;

type P = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  k: number; // resorte propio del punto
};

export default function ParticleWordmark() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sawRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const saw = sawRef.current;
    if (!stage || !canvas || !saw) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = prefersReducedMotion();

    let W = 0;
    let H = 0;
    let particles: P[] = [];
    type Dust = { x: number; y: number; vx: number; vy: number; life: number; max: number; s: number };
    let dust: Dust[] = [];
    // x/y = coords locales al canvas (físicas) · vx/vy = coords de viewport (sierra fixed)
    const mouse = { x: -9999, y: -9999, vx: -9999, vy: -9999, in: false };
    let visible = true;
    let raf = 0;
    let staticDrawn = false;

    /* disco de sierra SVG */
    const teeth = 18;
    const R1 = 47;
    const Rv = 37;
    const C = 50;
    const pts: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const a0 = (i / teeth) * Math.PI * 2;
      const am = ((i + 0.5) / teeth) * Math.PI * 2;
      const a1 = ((i + 1) / teeth) * Math.PI * 2;
      pts.push(`${C + Math.cos(a0) * Rv},${C + Math.sin(a0) * Rv}`);
      pts.push(`${C + Math.cos((a0 + am) / 2) * R1},${C + Math.sin((a0 + am) / 2) * R1}`);
      pts.push(`${C + Math.cos(am) * Rv},${C + Math.sin(am) * Rv}`);
      pts.push(`${C + Math.cos(a1) * Rv},${C + Math.sin(a1) * Rv}`);
    }
    saw.innerHTML = `<svg viewBox="0 0 100 100" style="animation:${
      reduced ? "none" : `sawspin ${CFG.SAW_SPEED}s linear infinite`
    }"><polygon points="${pts.join(" ")}" fill="#d8d8d8"/><circle cx="50" cy="50" r="34" fill="#c4c4c4"/><circle cx="50" cy="50" r="30" fill="none" stroke="#9a9a9a" stroke-width="1.4" stroke-dasharray="3 7"/><circle cx="50" cy="50" r="7" fill="#0c0c0c"/><circle cx="50" cy="50" r="7" fill="none" stroke="#8a8a8a" stroke-width="2"/></svg>`;

    const build = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = Math.floor(W);
      off.height = Math.floor(H);
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;

      const word = "IRAKA";
      let size = H * 0.78;
      o.font = `800 ${size}px Archivo, "Arial Black", sans-serif`;
      const measured = o.measureText(word).width;
      size = Math.min(size, (size * (W * 0.92)) / (measured || 1));
      o.font = `800 ${size}px Archivo, "Arial Black", sans-serif`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      try {
        (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * 0.04}px`;
      } catch {
        /* opcional */
      }
      o.fillText(word, W / 2, H / 2 + size * 0.02);

      const gap = Math.max(CFG.GAP_MIN, Math.round(W / CFG.GAP_DIV));
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const next: P[] = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (data[(y * off.width + x) * 4 + 3] > 128) {
            next.push({
              hx: x,
              hy: y,
              x,
              y,
              vx: 0,
              vy: 0,
              s: CFG.DOT_MIN + Math.random() * CFG.DOT_VAR,
              k: CFG.SPRING + Math.random() * CFG.SPRING_VAR,
            });
          }
        }
      }
      particles = next.map((p, i) => {
        const old = particles[i];
        if (old) {
          p.x = old.x;
          p.y = old.y;
          p.vx = old.vx;
          p.vy = old.vy;
        }
        return p;
      });
      staticDrawn = false;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(250,250,250,0.55)";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.hx, p.hy, p.s, 0, 6.2832);
        ctx.fill();
      }
    };

    const tick = (now = 0) => {
      raf = requestAnimationFrame(tick);
      if (reduced) {
        if (!staticDrawn) {
          drawStatic();
          staticDrawn = true;
        }
        return;
      }
      if (!visible) return;
      staticDrawn = false;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (mouse.in) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = ((CFG.RADIUS - d) / CFG.RADIUS) * CFG.PUSH;
            p.vx += (dx / d) * f + (-dy / d) * f * CFG.SWIRL;
            p.vy += (dy / d) * f + (dx / d) * f * CFG.SWIRL;
          }
        }
        p.vx += (p.hx - p.x) * p.k; // resorte propio → regreso desincronizado
        p.vy += (p.hy - p.y) * p.k;
        p.vx *= CFG.DAMP;
        p.vy *= CFG.DAMP;
        p.x += p.vx;
        p.y += p.vy;

        const disp = Math.hypot(p.x - p.hx, p.y - p.hy);
        const m = Math.min(1, disp / CFG.TINT_AT);
        const r = (BASE[0] + (WOOD[0] - BASE[0]) * m) | 0;
        const g = (BASE[1] + (WOOD[1] - BASE[1]) * m) | 0;
        const b = (BASE[2] + (WOOD[2] - BASE[2]) * m) | 0;
        // leve respiración en reposo para que la pieza se sienta viva
        const jx = p.x + Math.sin(now * 0.0012 + i * 1.7) * 0.4;
        const jy = p.y + Math.cos(now * 0.001 + i * 2.3) * 0.4;
        ctx.fillStyle = `rgba(${r},${g},${b},${0.38 + 0.5 * (1 - m * 0.35)})`;
        ctx.beginPath();
        ctx.arc(jx, jy, p.s + m * 0.6, 0, 6.2832);
        ctx.fill();

        // al cortar con fuerza, suelta motas de aserrín
        if (m > 0.55 && dust.length < CFG.DUST_MAX && Math.random() < CFG.DUST_CHANCE) {
          const a = Math.random() * Math.PI * 2;
          const v = 0.6 + Math.random() * 2.2;
          dust.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v - 0.6,
            life: 0,
            max: 40 + Math.random() * 50,
            s: 0.6 + Math.random() * 1.4,
          });
        }
      }

      // aserrín flotante
      for (let d = dust.length - 1; d >= 0; d--) {
        const q = dust[d];
        q.life++;
        q.x += q.vx;
        q.y += q.vy;
        q.vx *= 0.97;
        q.vy = q.vy * 0.97 + 0.035; // cae suavemente como viruta
        if (q.life >= q.max) {
          dust.splice(d, 1);
          continue;
        }
        const a = 1 - q.life / q.max;
        ctx.fillStyle = `rgba(${WOOD[0]},${WOOD[1]},${WOOD[2]},${0.75 * a})`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.s * a + 0.3, 0, 6.2832);
        ctx.fill();
      }
    };

    /* puntero — locales para el corte, de viewport para la sierra */
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      mouse.in =
        e.clientY > r.top - 6 && e.clientY < r.bottom + 6 && e.clientX > r.left && e.clientX < r.right;
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.vx = e.clientX;
      mouse.vy = e.clientY;
    };
    const onEnter = () => {
      saw.classList.add("saw-on");
      document.body.classList.add("saw-active");
    };
    const onLeave = () => {
      saw.classList.remove("saw-on");
      document.body.classList.remove("saw-active");
      mouse.in = false;
      mouse.x = mouse.y = mouse.vx = mouse.vy = -9999;
    };

    /* seguimiento del disco */
    let sx = 0;
    let sy = 0;
    let sawRaf = 0;
    const follow = () => {
      sawRaf = requestAnimationFrame(follow);
      sx += (mouse.vx - sx) * CFG.SAW_LERP;
      sy += (mouse.vy - sy) * CFG.SAW_LERP;
      saw.style.left = `${sx}px`;
      saw.style.top = `${sy}px`;
    };

    const io = new IntersectionObserver(
      (e) => {
        visible = e[0]?.isIntersecting ?? true;
      },
      { rootMargin: "80px" },
    );
    io.observe(stage);

    let rt: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(build, 160);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    const start = () => {
      build();
      if (reduced) drawStatic();
    };
    if (document.fonts?.ready) document.fonts.ready.then(start).catch(start);
    else start();
    raf = requestAnimationFrame(tick);
    sawRaf = requestAnimationFrame(follow);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sawRaf);
      clearTimeout(rt);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.body.classList.remove("saw-active");
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative h-[clamp(220px,34vh,380px)] w-full"
      style={{ cursor: "none" }}
      aria-label="IRAKA en matriz de puntos interactiva"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        ref={sawRef}
        className="saw-cursor pointer-events-none fixed left-0 top-0 z-[60] h-[46px] w-[46px]"
        style={{ margin: "-23px 0 0 -23px" }}
        aria-hidden="true"
      />
    </div>
  );
}
