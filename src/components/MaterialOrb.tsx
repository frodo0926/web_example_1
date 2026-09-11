import { useEffect, useRef } from "react";
import {
  anchorIndex,
  chairForm,
  PER_SLICE,
  POINT_COUNT,
  roomForm,
  SLICES,
  tableForm,
  treeForm,
  type Form,
} from "@/lib/materialForms";
import { OFFICES } from "@/data/content";
import { prefersReducedMotion } from "@/lib/anim";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* Contenido de cada etapa del relato — edítalo aquí libremente        */
/* ------------------------------------------------------------------ */
export const ORB_STAGES = [
  {
    num: "01",
    label: "El origen",
    title: "Aquí nace todo",
    desc: "Roble de los bosques altoandinos de Boyacá, seleccionado en pie antes del primer corte.",
    dimH: "H 18,0 m",
    dimW: "Ø 9,0 m",
  },
  {
    num: "02",
    label: "La primera pieza",
    title: "Del tronco a la lámina",
    desc: "El tronco se corta en láminas de grosor exacto que, apiladas y giradas, forman la primera mesa.",
    dimH: "H 0,45 m",
    dimW: "L 1,40 m",
  },
  {
    num: "03",
    label: "La forma madura",
    title: "Nace la silla",
    desc: "Sesenta y cuatro láminas talladas en CNC forman una silla escultórica de una sola cinta: el respaldo fluye al asiento y cae en un rizo hasta el piso. Sin patas ni tornillos.",
    dimH: "H 0,92 m",
    dimW: "A 0,88 m",
  },
  {
    num: "04",
    label: "El resultado",
    title: "Habita el espacio",
    desc: "La pieza entra a formar parte de un ambiente completo, pensado y fabricado como conjunto.",
    dimH: "H 2,70 m",
    dimW: "24 m²",
  },
];

const STAGE_COUNT = ORB_STAGES.length;
const HOLD = 0.64; // fracción del segmento en la que la forma permanece estable
const SEGMENT_SECONDS = 7; // duración de cada etapa (estable + transformación)
const PAUSE_AFTER_CLICK_MS = 9000; // al elegir una etapa, se queda en ella este tiempo
const TILT_MIN = -1.1;
const TILT_MAX = 1.05;
const TAU = Math.PI * 2;
const CONNECTOR_IDX = [0, 16, 32, 48]; // tirantes entre láminas contiguas
const HQ_CITY = OFFICES.find((o) => o.highlight)?.city ?? OFFICES[0].city;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let cache: { forms: Form[]; anchors: number[] } | null = null;
function buildForms() {
  if (cache) return cache;
  const forms = [treeForm(), tableForm(), chairForm(), roomForm()];
  cache = { forms, anchors: forms.map(anchorIndex) };
  return cache;
}

/**
 * Escultura laminada interactiva dibujada 100% con puntos y líneas: un árbol
 * se transforma en una mesa, luego en un sillón de autor y finalmente en un
 * ambiente completo. Arrastrable con mouse/touch; las etapas se pueden elegir
 * con las píldoras inferiores.
 */
export default function MaterialOrb({
  className,
  initialStage = 0,
}: {
  className?: string;
  initialStage?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const controlsRef = useRef<{ goTo: (i: number) => void } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const { forms, anchors } = buildForms();
    const reduced = prefersReducedMotion();

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let lastTime = performance.now();

    // Orientación (arrastre) — independiente del avance de etapa
    let rotation = -0.6;
    let tilt = -0.24;
    let isDragging = false;
    let hasDragged = false;
    let lastX = 0;
    let lastY = 0;
    let velRot = 0;
    let velTilt = 0;

    // Progreso del relato (0..STAGE_COUNT, cíclico)
    let stageProgress = reduced ? 2.1 : clamp(initialStage, 0, STAGE_COUNT - 1) + 0.02;
    let pausedUntil = 0;
    let activeIndex = -1;
    let disposed = false;
    let revealed = false;

    const sx = new Float32Array(POINT_COUNT);
    const sy = new Float32Array(POINT_COUNT);
    const sz = new Float32Array(POINT_COUNT);
    const sliceZ = new Float32Array(SLICES);
    const sliceCx = new Float32Array(SLICES);
    const sliceCy = new Float32Array(SLICES);
    const order = Array.from({ length: SLICES }, (_, i) => i);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "120px" },
    );
    io.observe(wrap);

    const applyStageText = (i: number) => {
      if (activeIndex === i) return;
      activeIndex = i;
      const meta = ORB_STAGES[i];
      if (kickerRef.current) kickerRef.current.textContent = `${meta.num} — ${meta.label}`;
      if (titleRef.current) titleRef.current.textContent = meta.title;
      if (descRef.current) descRef.current.textContent = meta.desc;
      pillRefs.current.forEach((b, bi) => {
        if (!b) return;
        b.dataset.active = String(bi === i);
        b.setAttribute("aria-pressed", String(bi === i));
      });
    };

    controlsRef.current = {
      goTo: (i: number) => {
        stageProgress = clamp(i, 0, STAGE_COUNT - 1) + 0.03;
        pausedUntil = performance.now() + PAUSE_AFTER_CLICK_MS;
        velRot = 0;
        velTilt = 0;
      },
    };

    const project = (x: number, y: number, z: number): [number, number, number] => {
      const ca = Math.cos(rotation);
      const sa = Math.sin(rotation);
      const x1 = x * ca + z * sa;
      const z1 = -x * sa + z * ca;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      return [x1, y * ct - z1 * st, y * st + z1 * ct];
    };

    const draw = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      /* ---------- inercia / rotación ambiental ---------- */
      if (!isDragging) {
        if (Math.abs(velRot) > 0.00006 || Math.abs(velTilt) > 0.00006) {
          rotation += velRot;
          tilt = clamp(tilt + velTilt, TILT_MIN, TILT_MAX);
          velRot *= 0.94;
          velTilt *= 0.94;
        } else if (!reduced) {
          rotation += 0.085 * dt;
        }
      }

      /* ---------- avance del relato (pausa al arrastrar o tras un clic) ---------- */
      if (!isDragging && !reduced && now > pausedUntil) {
        stageProgress += dt / SEGMENT_SECONDS;
        if (stageProgress >= STAGE_COUNT) stageProgress -= STAGE_COUNT;
      }

      const i = Math.floor(stageProgress) % STAGE_COUNT;
      const j = (i + 1) % STAGE_COUNT;
      const local = stageProgress - Math.floor(stageProgress);
      const t = local > HOLD ? easeInOutCubic((local - HOLD) / (1 - HOLD)) : 0;
      const labelAlpha =
        local < 0.06 ? local / 0.06 : local <= HOLD ? 1 : Math.max(0, 1 - ((local - HOLD) / (1 - HOLD)) / 0.4);

      applyStageText(i);

      /* ---------- morph + proyección ---------- */
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h * 0.52;
      const R = Math.min(w, h) * 0.43;
      const A = forms[i].pts;
      const B = forms[j].pts;
      const bulge = 1 + 0.1 * Math.sin(Math.PI * t); // las láminas "respiran" al recomponerse

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (let k = 0; k < POINT_COUNT; k++) {
        const a = A[k];
        const b = B[k];
        const [px, py, pz] = project(
          (a[0] + (b[0] - a[0]) * t) * bulge,
          (a[1] + (b[1] - a[1]) * t) * bulge,
          (a[2] + (b[2] - a[2]) * t) * bulge,
        );
        const X = cx + px * R;
        const Y = cy - py * R;
        sx[k] = X;
        sy[k] = Y;
        sz[k] = pz;
        if (X < minX) minX = X;
        if (X > maxX) maxX = X;
        if (Y < minY) minY = Y;
        if (Y > maxY) maxY = Y;
      }

      let zMin = Infinity;
      let zMax = -Infinity;
      for (let l = 0; l < SLICES; l++) {
        const base = l * PER_SLICE;
        let az = 0;
        let ax = 0;
        let ay = 0;
        for (let k = 0; k < PER_SLICE; k++) {
          az += sz[base + k];
          ax += sx[base + k];
          ay += sy[base + k];
        }
        sliceZ[l] = az / PER_SLICE;
        sliceCx[l] = ax / PER_SLICE;
        sliceCy[l] = ay / PER_SLICE;
        if (sliceZ[l] < zMin) zMin = sliceZ[l];
        if (sliceZ[l] > zMax) zMax = sliceZ[l];
      }
      const zRange = zMax - zMin || 1;
      order.sort((p, q) => sliceZ[p] - sliceZ[q]);

      /* ---------- sombra de contacto + línea de suelo ---------- */
      const shX = (minX + maxX) / 2;
      const shY = maxY + 4;
      const shRx = Math.max(24, (maxX - minX) * 0.46);
      const shRy = Math.max(6, shRx * 0.13);
      ctx.save();
      ctx.translate(shX, shY);
      ctx.scale(1, shRy / shRx);
      const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, shRx);
      shadow.addColorStop(0, "rgba(0,0,0,0.6)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shadow;
      ctx.fillRect(-shRx, -shRx, shRx * 2, shRx * 2);
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(shX, shY + 2, shRx * 1.25, shRy * 1.25, 0, 0, TAU);
      ctx.stroke();

      /* ---------- tirantes estructurales entre láminas contiguas ---------- */
      const groups = t < 0.5 ? forms[i].groups : forms[j].groups;
      const connAlpha = t < 0.5 ? 1 - 2 * t : 2 * t - 1;
      if (connAlpha > 0.02) {
        ctx.lineWidth = 0.7;
        for (let l = 0; l < SLICES - 1; l++) {
          if (groups[l] !== groups[l + 1]) continue;
          const zt = ((sliceZ[l] + sliceZ[l + 1]) / 2 - zMin) / zRange;
          ctx.strokeStyle = `rgba(255,205,160,${(0.05 + 0.09 * zt) * connAlpha})`;
          const b0 = l * PER_SLICE;
          const b1 = (l + 1) * PER_SLICE;
          for (const k of CONNECTOR_IDX) {
            ctx.beginPath();
            ctx.moveTo(sx[b0 + k], sy[b0 + k]);
            ctx.lineTo(sx[b1 + k], sy[b1 + k]);
            ctx.stroke();
          }
        }
      }

      /* ---------- láminas, de atrás hacia delante ---------- */
      for (let oi = 0; oi < SLICES; oi++) {
        const l = order[oi];
        const zt = (sliceZ[l] - zMin) / zRange;
        const base = l * PER_SLICE;
        // luz direccional (arriba-izquierda) + profundidad
        const lx = (sliceCx[l] - cx) / R;
        const ly = (cy - sliceCy[l]) / R;
        const light = clamp(0.5 - lx * 0.35 + ly * 0.3, 0.15, 1);
        const shade = (0.35 + 0.65 * zt) * (0.7 + 0.3 * light);
        const warm = l % 2 === 0; // tono alterno, como chapa contrachapada

        const trace = (dx = 0, dy = 0, scale = 1) => {
          ctx.beginPath();
          for (let k = 0; k < PER_SLICE; k++) {
            let px = sx[base + k];
            let py = sy[base + k];
            if (scale !== 1) {
              px = sliceCx[l] + (px - sliceCx[l]) * scale;
              py = sliceCy[l] + (py - sliceCy[l]) * scale;
            }
            if (k === 0) ctx.moveTo(px + dx, py + dy);
            else ctx.lineTo(px + dx, py + dy);
          }
          ctx.closePath();
        };

        // 1) canto de la lámina (grosor)
        trace(0.9, 1.8);
        ctx.strokeStyle = `rgba(52,30,14,${0.35 * shade})`;
        ctx.lineWidth = 1.2 + zt;
        ctx.stroke();

        // 2) cara de la lámina
        trace();
        ctx.fillStyle = warm
          ? `rgba(226,178,124,${0.03 + 0.05 * zt})`
          : `rgba(186,132,84,${0.035 + 0.05 * zt})`;
        ctx.fill();
        ctx.strokeStyle = warm
          ? `rgba(242,204,158,${0.16 + 0.7 * shade})`
          : `rgba(214,160,108,${0.14 + 0.66 * shade})`;
        ctx.lineWidth = 0.7 + 1.1 * zt;
        ctx.stroke();

        // 3) anillo interior de veta en las láminas frontales
        if (zt > 0.55) {
          trace(0, 0, 0.9);
          ctx.strokeStyle = `rgba(255,220,180,${0.12 * shade})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        // 4) puntos en los vértices
        const step = zt > 0.5 ? 2 : 4;
        const dotR = 0.6 + 1.5 * zt;
        ctx.fillStyle = `rgba(255,230,192,${0.15 + 0.7 * shade})`;
        for (let k = 0; k < PER_SLICE; k += step) {
          ctx.beginPath();
          ctx.arc(sx[base + k], sy[base + k], dotR, 0, TAU);
          ctx.fill();
        }

        // 5) brillos cálidos en las láminas más cercanas
        if (zt > 0.8) {
          ctx.fillStyle = `rgba(255,150,80,${0.5 * shade})`;
          for (let k = 4; k < PER_SLICE; k += 16) {
            ctx.beginPath();
            ctx.arc(sx[base + k], sy[base + k], dotR + 0.6, 0, TAU);
            ctx.fill();
          }
        }
      }

      /* ---------- cotas técnicas + marcador ---------- */
      if (labelAlpha > 0.02) {
        const st = ORB_STAGES[i];
        ctx.save();
        ctx.globalAlpha = labelAlpha;
        ctx.font = "500 10px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(70,120,255,0.6)";
        ctx.fillStyle = "rgba(120,160,255,0.95)";

        // altura (izquierda)
        const xL = minX - 30;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(xL, minY);
        ctx.lineTo(xL, maxY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(xL - 5, minY);
        ctx.lineTo(xL + 5, minY);
        ctx.moveTo(xL - 5, maxY);
        ctx.lineTo(xL + 5, maxY);
        ctx.stroke();
        ctx.save();
        ctx.translate(xL - 12, (minY + maxY) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(st.dimH, 0, 0);
        ctx.restore();

        // ancho (abajo)
        const yB = maxY + 30;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(minX, yB);
        ctx.lineTo(maxX, yB);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(minX, yB - 5);
        ctx.lineTo(minX, yB + 5);
        ctx.moveTo(maxX, yB - 5);
        ctx.lineTo(maxX, yB + 5);
        ctx.stroke();
        ctx.fillText(st.dimW, (minX + maxX) / 2, yB + 12);

        // marcador en el punto más alto de la forma activa
        const ai = anchors[i];
        const mx = sx[ai];
        const my = sy[ai];
        const tx = mx + R * 0.18;
        const ty = my - R * 0.12;
        const pulse = 0.5 + 0.5 * Math.sin(now / 320);
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = "rgba(70,120,255,0.6)";
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,85,0,0.95)";
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = `rgba(255,85,0,${0.2 + 0.3 * pulse})`;
        ctx.beginPath();
        ctx.arc(mx, my, 6 + pulse * 4, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,120,60,0.95)";
        ctx.textAlign = "left";
        ctx.fillText(st.num, tx + 6, ty);
        ctx.fillStyle = "rgba(120,160,255,0.95)";
        ctx.beginPath();
        ctx.arc(tx, ty, 1.6, 0, TAU);
        ctx.fill();
        ctx.restore();
      }

      // Primer frame completo listo → revelado único, sin parpadeo
      if (!revealed) {
        revealed = true;
        canvas.style.opacity = "1";
      }
    };

    raf = requestAnimationFrame(draw);

    /* -------------------- Interacción de arrastre -------------------- */
    canvas.style.touchAction = "none";
    canvas.style.cursor = "grab";

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      hasDragged = false;
      lastX = e.clientX;
      lastY = e.clientY;
      velRot = 0;
      velTilt = 0;
      canvas.style.cursor = "grabbing";
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) hasDragged = true;
      lastX = e.clientX;
      lastY = e.clientY;
      const sens = 0.0055;
      rotation += dx * sens;
      tilt = clamp(tilt - dy * sens, TILT_MIN, TILT_MAX);
      velRot = dx * sens;
      velTilt = -dy * sens;
    };
    const endDrag = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      canvas.style.cursor = "grab";
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (isDragging) endDrag(e);
    };
    const onClickCapture = (e: MouseEvent) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("click", onClickCapture, true);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      controlsRef.current = null;
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {/* Halo cálido de taller + aro técnico */}
      <div
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,120,30,0.13)_0%,rgba(255,90,20,0.05)_55%,transparent_72%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[3%] rounded-full border border-electric/20"
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Escultura laminada interactiva que transforma un árbol en una mesa, una silla de autor y un ambiente completo. Arrástrala para girarla."
        className="relative z-10 block h-full w-full"
        style={{ opacity: 0, transition: "opacity 0.9s ease 0.05s" }}
      />

      {/* HUD narrativo — evoluciona con cada etapa */}
      <div className="pointer-events-none absolute right-0 top-[4%] z-20 max-w-[16rem] text-right">
        <span ref={kickerRef} className="label mb-2 block text-ember">
          {ORB_STAGES[0].num} — {ORB_STAGES[0].label}
        </span>
        <span className="h-display block text-[clamp(1.3rem,2.4vw,2rem)] leading-[0.95] text-white">
          <span ref={titleRef}>{ORB_STAGES[0].title}</span>
        </span>
        <p ref={descRef} className="mt-3 text-[0.82rem] leading-relaxed text-white/55">
          {ORB_STAGES[0].desc}
        </p>
      </div>

      {/* Selector de etapas (píldoras) + línea de ayuda */}
      <div className="absolute inset-x-0 bottom-[3%] z-20 flex flex-col gap-4">
        <div
          className="pointer-events-auto flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Elegir etapa de la pieza"
        >
          {ORB_STAGES.map((s, i) => (
            <button
              key={s.num}
              type="button"
              ref={(el) => {
                pillRefs.current[i] = el;
              }}
              data-active={i === 0}
              aria-pressed={i === 0}
              onClick={() => controlsRef.current?.goTo(i)}
              data-cursor="button"
              className={cn(
                "group rounded-full border border-white/15 bg-ink/45 px-4 py-2 backdrop-blur-sm transition-all duration-500",
                "hover:border-white/40",
                "data-[active=true]:border-ember data-[active=true]:bg-ember/15 data-[active=true]:shadow-[0_0_28px_-6px_#ff5500cc]",
              )}
            >
              <span className="mono text-[0.62rem] tracking-[0.16em] text-white/60 transition-colors group-hover:text-white group-data-[active=true]:text-white">
                <span className="mr-2 opacity-45 group-data-[active=true]:text-ember group-data-[active=true]:opacity-100">
                  {s.num}
                </span>
                {s.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        <div className="pointer-events-none flex flex-wrap items-center gap-3">
          <span className="h-px w-8 bg-white/30" />
          <span className="mono text-[0.58rem] tracking-[0.18em] text-white/55">
            Arrastra la pieza para girarla · Taller
          </span>
          <span className="mono flex items-center gap-1.5 rounded-full border border-[#ff2d2d]/50 bg-ink/75 px-2.5 py-1 text-[0.58rem] tracking-[0.18em] text-[#ff6b5e] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d2d] shadow-[0_0_8px_2px_#ff2d2d66]" />
            {HQ_CITY.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
