import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/anim";

/* ------------------------------------------------------------------ */
/* Secuencia de obra — antes/después sobre foto real:                 */
/* el espacio en obra gris se escanea, se acota con su malla y un     */
/* barrido tipo láser va revelando el proyecto hasta el render final. */
/* ------------------------------------------------------------------ */

const BEFORE_IMG =
  "https://images.pexels.com/photos/15798784/pexels-photo-15798784.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920";
const AFTER_IMG =
  "https://images.pexels.com/photos/36777502/pexels-photo-36777502.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920";

const PASSES = [
  { id: "01", label: "FASE ESCANEO", sub: "NUBE DE PUNTOS", estado: "SITIO EXISTENTE" },
  { id: "02", label: "FASE MALLA", sub: "WIREFRAME", estado: "LEVANTAMIENTO" },
  { id: "03", label: "FASE CLAY", sub: "OCLUSIÓN AMBIENTAL", estado: "PROYECTO SUPERPUESTO" },
  { id: "04", label: "FASE FINAL", sub: "RENDER FÍSICO", estado: "OBRA TERMINADA" },
];

const STAGE_NAMES = ["Escaneo", "Malla", "Clay / AO", "Render final"];

/** Cajas acotadas sobre la foto (coordenadas en % del lienzo). */
const BOXES = [
  { x: 0.185, y: 0.115, w: 0.315, h: 0.255, label: "ALTOS · h 860" },
  { x: 0.72, y: 0.1, w: 0.25, h: 0.3, label: "ESTANTERÍA" },
  { x: 0.185, y: 0.5, w: 0.315, h: 0.28, label: "BAJOS · h 900" },
  { x: 0.545, y: 0.54, w: 0.4, h: 0.33, label: "ISLA · CLAY/S AO" },
];

/** Nube de puntos determinista (no parpadea entre frames). */
const DOTS: [number, number, number][] = Array.from({ length: 1100 }, (_, i) => {
  const a = Math.sin(i * 127.1) * 43758.5453;
  const b = Math.sin(i * 269.5 + 7.3) * 24634.6345;
  return [a - Math.floor(a), b - Math.floor(b), (Math.sin(i * 12.9898) + 1) / 2];
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** Interpola entre valores clave en pos (0..4). */
function ramp(pos: number, keys: [number, number][]) {
  if (pos <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [x0, y0] = keys[i];
    const [x1, y1] = keys[i + 1];
    if (pos <= x1) return lerp(y0, y1, (pos - x0) / (x1 - x0 || 1));
  }
  return keys[keys.length - 1][1];
}

const BLUE = "rgba(72,110,255,";
const EMBER = "rgba(255,95,20,";

export default function FrameSequence({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beforeRef = useRef<HTMLImageElement>(null);
  const afterRef = useRef<HTMLImageElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const passRef = useRef<HTMLSpanElement>(null);
  const passSubRef = useRef<HTMLSpanElement>(null);
  const aovRef = useRef<HTMLSpanElement>(null);
  const muestrasRef = useRef<HTMLSpanElement>(null);
  const tiempoRef = useRef<HTMLSpanElement>(null);
  const estadoRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const TOTAL_FRAMES = 60;

    const bracket = (x: number, y: number, bw: number, bh: number, len: number, alpha: number) => {
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = 1.4;
      const c: [number, number, number, number][] = [
        [x, y, 1, 1],
        [x + bw, y, -1, 1],
        [x, y + bh, 1, -1],
        [x + bw, y + bh, -1, -1],
      ];
      c.forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx + dx * len, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * len);
        ctx.stroke();
      });
    };

    const draw = (p: number) => {
      const pos = clamp01(p) * 4; // 0..4
      const frame = Math.round(clamp01(p) * TOTAL_FRAMES);

      /* ---------- capa ANTES: sitio en obra ---------- */
      const bGray = ramp(pos, [[0, 0.3], [2, 0.45]]);
      const bBright = ramp(pos, [[0, 0.6], [1.5, 0.8], [3, 0.7]]);
      if (beforeRef.current) {
        beforeRef.current.style.filter = `grayscale(${bGray.toFixed(3)}) brightness(${bBright.toFixed(3)}) contrast(1.12)`;
      }

      /* ---------- capa DESPUÉS: barrido de revelado + tratamiento ---------- */
      const wipe = ramp(pos, [[1.9, 0], [3.55, 1]]);
      if (revealRef.current) {
        revealRef.current.style.clipPath = `inset(0 ${((1 - wipe) * 100).toFixed(2)}% 0 0)`;
      }
      const aGray = ramp(pos, [[0, 1], [3.45, 1], [3.95, 0]]);
      const aBright = ramp(pos, [[0, 1.02], [4, 1.05]]);
      if (afterRef.current) {
        afterRef.current.style.filter = `grayscale(${aGray.toFixed(3)}) brightness(${aBright.toFixed(3)}) contrast(${ramp(pos, [[0, 0.95], [4, 1.08]]).toFixed(3)})`;
      }
      const tint = ramp(pos, [[0, 0.3], [3.4, 0.26], [3.9, 0]]);
      if (tintRef.current) tintRef.current.style.opacity = tint.toFixed(3);

      /* ---------- alphas del overlay ---------- */
      const gridA = ramp(pos, [[0, 0.5], [2.9, 0.42], [3.7, 0.05]]);
      const fanA = ramp(pos, [[0, 0.05], [1, 0.4], [2, 0.55], [2.9, 0.5], [3.7, 0.05]]);
      const boxA = ramp(pos, [[0, 0.1], [0.8, 0.7], [1.2, 0.95], [2.9, 1], [3.6, 0]]);
      const dimA = ramp(pos, [[0, 0.25], [1, 0.75], [2.9, 0.85], [3.6, 0]]);
      const dotsA = ramp(pos, [[0, 1], [0.9, 0.3], [1.4, 0]]);

      ctx.clearRect(0, 0, w, h);

      /* ---------- retícula base ---------- */
      if (gridA > 0.01) {
        ctx.strokeStyle = `${BLUE}${gridA})`;
        ctx.lineWidth = 1;
        const step = Math.max(46, w / 22);
        for (let x = (w % step) / 2; x <= w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = (h % step) / 2; y <= h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      /* ---------- abanico de perspectiva desde el punto de fuga ---------- */
      if (fanA > 0.01) {
        const vx = w * 0.52;
        const vy = h * 0.5;
        ctx.strokeStyle = `${BLUE}${fanA})`;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 16; i++) {
          const tx = lerp(-0.1, 1.1, i / 16) * w;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(tx, h * 1.02);
          ctx.stroke();
        }
        for (let i = 1; i <= 5; i++) {
          const ty = lerp(0.55, 1.05, i / 5) * h;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(-w * 0.05, ty);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(w * 1.05, ty);
          ctx.stroke();
        }
      }

      /* ---------- nube de puntos del escaneo ---------- */
      if (dotsA > 0.01) {
        for (let i = 0; i < DOTS.length; i++) {
          const [dx, dy, dz] = DOTS[i];
          const tw = 0.4 + 0.6 * Math.abs(Math.sin(i * 3.7 + pos * 4));
          ctx.fillStyle = `rgba(150,190,255,${dotsA * (0.15 + dz * 0.55) * tw})`;
          ctx.fillRect(dx * w, dy * h, 1.6, 1.6);
        }
        const sy = h * ((pos * 0.9) % 1);
        const sg = ctx.createLinearGradient(0, sy - 40, 0, sy + 40);
        sg.addColorStop(0, "rgba(120,170,255,0)");
        sg.addColorStop(0.5, `rgba(120,170,255,${0.14 * dotsA})`);
        sg.addColorStop(1, "rgba(120,170,255,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(0, sy - 40, w, 80);
      }

      /* ---------- cajas acotadas + rótulos ---------- */
      if (boxA > 0.01) {
        ctx.font = "500 11px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.shadowColor = "rgba(3,8,18,0.9)";
        ctx.shadowBlur = 4;
        BOXES.forEach((b) => {
          const x = b.x * w;
          const y = b.y * h;
          const bw = b.w * w;
          const bh = b.h * h;
          ctx.save();
          ctx.globalAlpha = boxA;
          ctx.setLineDash([5, 6]);
          ctx.strokeStyle = `${BLUE}0.75)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, bw, bh);
          ctx.setLineDash([]);
          ctx.restore();
          bracket(x, y, bw, bh, 12, boxA * 0.9);
          ctx.fillStyle = `${EMBER}${boxA})`;
          ctx.fillText(b.label, x + 2, y - 7);
        });
        ctx.fillStyle = `${EMBER}${boxA})`;
        ctx.fillText("COLUMNA · horno", w * 0.055, h * 0.075);
        ctx.strokeStyle = `${EMBER}${boxA * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w * 0.05, h * 0.082);
        ctx.lineTo(w * 0.05, h * 0.1);
        ctx.moveTo(w * 0.043, h * 0.09);
        ctx.lineTo(w * 0.057, h * 0.09);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      /* ---------- cotas generales ---------- */
      if (dimA > 0.01) {
        ctx.save();
        ctx.globalAlpha = dimA;
        ctx.strokeStyle = `${BLUE}0.8)`;
        ctx.fillStyle = `${BLUE}0.95)`;
        ctx.lineWidth = 1;
        ctx.font = "500 10px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.shadowColor = "rgba(3,8,18,0.9)";
        ctx.shadowBlur = 4;
        const lx = w * 0.05;
        ctx.beginPath();
        ctx.moveTo(lx, h * 0.09);
        ctx.lineTo(lx, h * 0.88);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lx - 5, h * 0.09);
        ctx.lineTo(lx + 5, h * 0.09);
        ctx.moveTo(lx - 5, h * 0.88);
        ctx.lineTo(lx + 5, h * 0.88);
        ctx.stroke();
        ctx.save();
        ctx.translate(lx - 9, h * 0.485);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText("H 2.546 mm", 0, 0);
        ctx.restore();
        const by = h * 0.935;
        ctx.beginPath();
        ctx.moveTo(w * 0.2, by);
        ctx.lineTo(w * 0.78, by);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.2, by - 5);
        ctx.lineTo(w * 0.2, by + 5);
        ctx.moveTo(w * 0.78, by - 5);
        ctx.lineTo(w * 0.78, by + 5);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillText("L 4.820 mm", w * 0.49, by + 14);
        ctx.restore();
      }

      /* ---------- borde láser del revelado antes/después ---------- */
      if (wipe > 0.015 && wipe < 0.985) {
        const ex = wipe * w;
        const glow = ctx.createLinearGradient(ex - 70, 0, ex + 70, 0);
        glow.addColorStop(0, "rgba(255,110,40,0)");
        glow.addColorStop(0.5, "rgba(255,110,40,0.16)");
        glow.addColorStop(1, "rgba(255,110,40,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(ex - 70, 0, 140, h);

        ctx.strokeStyle = "rgba(255,120,50,0.95)";
        ctx.lineWidth = 1.6;
        ctx.shadowColor = "rgba(255,120,50,0.9)";
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.moveTo(ex, 0);
        ctx.lineTo(ex, h);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = "rgba(255,160,90,0.8)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 8; i++) {
          const ty = (i / 8) * h;
          ctx.beginPath();
          ctx.moveTo(ex - 6, ty);
          ctx.lineTo(ex + 6, ty);
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(255,140,70,0.95)";
        ctx.font = "500 10px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.textAlign = "left";
        ctx.shadowColor = "rgba(3,8,18,0.9)";
        ctx.shadowBlur = 4;
        ctx.fillText(`REVELADO ${Math.round(wipe * 100)}%`, ex + 12, h * 0.16);
        ctx.shadowBlur = 0;
      }

      /* ---------- HUD ---------- */
      const pi = Math.min(3, Math.floor(pos));
      const pass = PASSES[pi];
      if (passRef.current) passRef.current.textContent = pass.label;
      if (passSubRef.current) passSubRef.current.textContent = pass.sub;
      if (aovRef.current) aovRef.current.textContent = pass.id;
      if (muestrasRef.current)
        muestrasRef.current.textContent = String(Math.round(ramp(pos, [[0, 32], [4, 512]])));
      if (tiempoRef.current)
        tiempoRef.current.textContent = `${ramp(pos, [[0, 0.12], [4, 2.6]]).toFixed(2)} S`;
      if (estadoRef.current) estadoRef.current.textContent = pass.estado;
      if (stageRef.current) stageRef.current.textContent = STAGE_NAMES[pi];
      if (frameRef.current) frameRef.current.textContent = String(frame).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${clamp01(p)})`;
    };

    draw(0);

    if (prefersReducedMotion()) {
      draw(1);
      return () => ro.disconnect();
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => draw(self.progress),
    });

    return () => {
      st.kill();
      ro.disconnect();
    };
  }, []);

  const imgClass = "absolute inset-0 h-full w-full object-cover";
  const imgPos = { objectPosition: "50% 58%" } as const;

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{ height: "340vh" }}
      aria-label="Secuencia de obra: del sitio existente al render final de la cocina"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink text-white">
        {/* ANTES — espacio en obra */}
        <img
          ref={beforeRef}
          src={BEFORE_IMG}
          alt="Espacio en obra antes de la remodelación"
          loading="lazy"
          decoding="async"
          className={imgClass}
          style={{ ...imgPos, filter: "grayscale(0.3) brightness(0.6) contrast(1.12)" }}
        />
        <span className="mono absolute left-6 top-[22%] z-10 rounded-full border border-white/25 bg-ink/60 px-3 py-1 text-[0.58rem] tracking-[0.2em] text-white/70 backdrop-blur-sm md:left-10">
          ANTES · OBRA GRIS
        </span>

        {/* DESPUÉS — proyecto revelado por el barrido */}
        <div
          ref={revealRef}
          className="absolute inset-0"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <img
            ref={afterRef}
            src={AFTER_IMG}
            alt="Render final de la cocina terminada"
            loading="lazy"
            decoding="async"
            className={imgClass}
            style={{ ...imgPos, filter: "grayscale(1) brightness(1.02) contrast(0.95)" }}
          />
          <div
            ref={tintRef}
            className="pointer-events-none absolute inset-0"
            style={{ background: "#3a5ea8", mixBlendMode: "color", opacity: 0.28 }}
            aria-hidden="true"
          />
          <span className="mono absolute right-6 top-[22%] rounded-full border border-ember/50 bg-ink/60 px-3 py-1 text-[0.58rem] tracking-[0.2em] text-ember backdrop-blur-sm md:right-10">
            DESPUÉS · RENDER FINAL
          </span>
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 42%, rgba(4,8,18,0.55) 100%)" }}
          aria-hidden="true"
        />

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Marco del visor */}
        <div className="pointer-events-none absolute inset-3 border border-white/15 md:inset-6" aria-hidden="true">
          {["-left-px -top-px border-l border-t", "-right-px -top-px border-r border-t", "-bottom-px -left-px border-b border-l", "-bottom-px -right-px border-b border-r"].map((c) => (
            <span key={c} className={`absolute h-6 w-6 border-white/60 md:h-8 md:w-8 ${c}`} />
          ))}
        </div>

        {/* HUD superior */}
        <div className="shell pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between pt-8 md:pt-10">
          <div className="max-w-[34ch]">
            <p className="label mb-2 text-ember">Secuencia de obra</p>
            <p className="text-sm leading-snug text-white/65">
              Del sitio en obra al render final: escaneo, malla, clay y revelado.
            </p>
          </div>
          <div className="text-right">
            <span
              ref={passRef}
              className="mono block text-[0.7rem] tracking-[0.2em] text-white"
              style={{ textShadow: "0 1px 10px rgba(3,8,18,0.9)" }}
            >
              FASE ESCANEO
            </span>
            <span
              ref={passSubRef}
              className="mono mt-1 block text-[0.6rem] tracking-[0.2em] text-[#bcd3ff]"
              style={{ textShadow: "0 1px 10px rgba(3,8,18,0.9)" }}
            >
              NUBE DE PUNTOS
            </span>
          </div>
        </div>

        {/* Lecturas técnicas */}
        <div
          className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 rounded-lg bg-ink/45 px-5 py-4 backdrop-blur-[2px] md:right-10 md:block"
          style={{ textShadow: "0 1px 10px rgba(3,8,18,0.95)" }}
        >
          <div className="grid grid-cols-4 gap-8 text-right">
            {(
              [
                ["AOV", aovRef, "01"],
                ["MUESTRAS", muestrasRef, "32"],
                ["TIEMPO", tiempoRef, "0.12 S"],
                ["ESTADO", estadoRef, "SITIO EXISTENTE"],
              ] as [string, React.RefObject<HTMLSpanElement | null>, string][]
            ).map(([label, ref, init]) => (
              <div key={label}>
                <span className="label block text-white/75">{label}</span>
                <span
                  ref={ref}
                  className="mono mt-2 block whitespace-nowrap text-[0.74rem] tracking-[0.12em] text-[#d9e6ff]"
                >
                  {init}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* HUD inferior */}
        <div className="shell pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between pb-8 md:pb-10">
          <div className="w-full max-w-md">
            <span className="label mb-3 block text-white/45">Progreso de obra</span>
            <span className="block h-px w-full bg-white/15">
              <span
                ref={barRef}
                className="block h-px w-full origin-left bg-ember"
                style={{ transform: "scaleX(0)" }}
              />
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="label opacity-45">Frame</span>
            <span ref={frameRef} className="mono text-[clamp(1.6rem,3.2vw,2.8rem)] leading-none">
              000
            </span>
            <span className="label opacity-45">/060</span>
          </div>
        </div>

        <span ref={stageRef} className="sr-only" />
      </div>
    </section>
  );
}
