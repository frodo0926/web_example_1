/**
 * materialForms.ts — geometría procedural de la escultura laminada del hero.
 *
 * Cada forma se construye con SLICES "láminas" (contornos cerrados) de
 * PER_SLICE puntos cada una, igual que una pieza de carpintería paramétrica
 * cortada en CNC. Las cuatro formas comparten exactamente la misma estructura,
 * así que el motor puede interpolar lámina a lámina y punto a punto (morph).
 *
 *   árbol   → láminas horizontales (anillos: raíces, corteza, ramas, copa)
 *   mesa    → láminas verticales onduladas + tapa de cristal
 *   sillón  → láminas verticales tipo capullo con el asiento excavado
 *   ambiente→ piso + panel de pared + sillón + mesa + lámpara (composición)
 *
 *   punto k  →  lámina = floor(k / PER_SLICE),  posición = k % PER_SLICE
 */

export type Pt3 = [number, number, number];

export const SLICES = 64;
export const PER_SLICE = 64;
export const POINT_COUNT = SLICES * PER_SLICE;

export type Form = {
  /** SLICES × PER_SLICE puntos, lámina a lámina. */
  pts: Pt3[];
  /** Id de grupo por lámina — los tirantes solo unen láminas del mismo grupo. */
  groups: number[];
};

const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Transform = { scale?: number; ox?: number; oy?: number; oz?: number };
const applyT = (pts: Pt3[], { scale = 1, ox = 0, oy = 0, oz = 0 }: Transform): Pt3[] =>
  pts.map(([x, y, z]) => [x * scale + ox, y * scale + oy, z * scale + oz]);

/* ------------------------------------------------------------------ */
/* Primitivas — todas devuelven exactamente PER_SLICE puntos           */
/* ------------------------------------------------------------------ */

/** Remuestrea un polígono cerrado a n puntos equiespaciados por longitud de arco. */
export function resampleClosed(poly: Pt3[], n = PER_SLICE): Pt3[] {
  const m = poly.length;
  const seg = new Array<number>(m);
  let total = 0;
  for (let i = 0; i < m; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % m];
    seg[i] = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    total += seg[i];
  }
  if (total < 1e-9) return Array.from({ length: n }, () => [...poly[0]] as Pt3);
  const out: Pt3[] = [];
  let si = 0;
  let acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total;
    while (si < m - 1 && acc + seg[si] < target) {
      acc += seg[si];
      si++;
    }
    const a = poly[si];
    const b = poly[(si + 1) % m];
    const f = seg[si] > 1e-9 ? (target - acc) / seg[si] : 0;
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]);
  }
  return out;
}

/** Anillo horizontal (plano XZ) a altura y, con radio dependiente del ángulo. */
export function ringXZ(y: number, radius: (theta: number) => number, cx = 0, cz = 0, phase = 0): Pt3[] {
  const out: Pt3[] = [];
  for (let k = 0; k < PER_SLICE; k++) {
    const th = (k / PER_SLICE) * TAU + phase;
    const r = radius(th);
    out.push([cx + Math.cos(th) * r, y, cz + Math.sin(th) * r]);
  }
  return out;
}

/** Contorno polar vertical (plano YZ) en x. θ=0 → frente (+z), π/2 → arriba (+y). */
export function polarYZ(x: number, radius: (theta: number) => number, cy = 0, cz = 0, recline = 0): Pt3[] {
  const out: Pt3[] = [];
  const cr = Math.cos(recline);
  const sr = Math.sin(recline);
  for (let k = 0; k < PER_SLICE; k++) {
    const th = (k / PER_SLICE) * TAU;
    const r = radius(th);
    const ly = r * Math.sin(th);
    const lz = r * Math.cos(th);
    out.push([x, cy + ly * cr - lz * sr, cz + ly * sr + lz * cr]);
  }
  return out;
}

/** Banda (cinta con grosor) en el plano YZ siguiendo una línea central [y,z](s). */
export function bandYZ(
  x: number,
  center: (s: number) => [number, number],
  thickness: number,
  samples = 26,
): Pt3[] {
  const c: [number, number][] = [];
  for (let i = 0; i < samples; i++) c.push(center(i / (samples - 1)));
  const left: Pt3[] = [];
  const right: Pt3[] = [];
  const h = thickness / 2;
  for (let i = 0; i < samples; i++) {
    const p = c[i];
    const q = c[Math.min(samples - 1, i + 1)];
    const o = c[Math.max(0, i - 1)];
    let ty = q[0] - o[0];
    let tz = q[1] - o[1];
    const L = Math.hypot(ty, tz) || 1;
    ty /= L;
    tz /= L;
    const ny = -tz;
    const nz = ty;
    left.push([x, p[0] + ny * h, p[1] + nz * h]);
    right.push([x, p[0] - ny * h, p[1] - nz * h]);
  }
  return resampleClosed([...left, ...right.reverse()]);
}

/** Rectángulo redondeado en el plano del suelo (XZ) a altura y. */
export function roundedRectXZ(y: number, hw: number, hd: number, corner: number, cx = 0, cz = 0): Pt3[] {
  const c = Math.min(corner, hw, hd);
  const corners: [number, number, number][] = [
    [hw - c, hd - c, 0],
    [-hw + c, hd - c, Math.PI / 2],
    [-hw + c, -hd + c, Math.PI],
    [hw - c, -hd + c, Math.PI * 1.5],
  ];
  const poly: Pt3[] = [];
  for (const [ox, oz, a0] of corners) {
    for (let i = 0; i <= 6; i++) {
      const a = a0 + (i / 6) * (Math.PI / 2);
      poly.push([cx + ox + Math.cos(a) * c, y, cz + oz + Math.sin(a) * c]);
    }
  }
  return resampleClosed(poly);
}

/** Listón vertical (rectángulo en el plano XY) a profundidad z. */
export function slatXY(z: number, cx: number, y0: number, y1: number, hw: number): Pt3[] {
  const poly: Pt3[] = [
    [cx - hw, y0, z],
    [cx + hw, y0, z],
    [cx + hw, y1 - hw, z],
    [cx, y1, z],
    [cx - hw, y1 - hw, z],
  ];
  return resampleClosed(poly);
}

/* ------------------------------------------------------------------ */
/* 01 — El origen: árbol (raíces, tronco con corteza, ramas, copa)     */
/* ------------------------------------------------------------------ */
export function treeSlices(n = SLICES): Pt3[][] {
  const out: Pt3[][] = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const y = -0.5 + 1.06 * u;
    let cx = 0;
    let cz = 0;
    let radius: (th: number) => number;

    if (u < 0.1) {
      // raíces: cinco contrafuertes que se funden en el tronco
      const t = u / 0.1;
      const base = lerp(0.3, 0.1, easeOutCubic(t));
      radius = (th) =>
        base *
        (1 +
          0.34 * (1 - t) * Math.pow(Math.max(0, Math.cos(5 * th + 0.4)), 1.6) +
          0.07 * (1 - t) * Math.cos(9 * th + 1));
    } else if (u < 0.5) {
      // tronco: ligera inclinación y textura de corteza
      const t = (u - 0.1) / 0.4;
      const base = lerp(0.1, 0.068, t);
      cx = 0.045 * Math.sin(u * 2.6);
      cz = 0.02 * Math.cos(u * 3.1);
      radius = (th) =>
        base *
        (1 + 0.07 * Math.sin(7 * th + u * 9) + 0.05 * Math.sin(13 * th - u * 17) + 0.03 * Math.sin(3 * th + u * 5));
    } else if (u < 0.63) {
      // horqueta: tres ramas principales se abren en hélice
      const t = (u - 0.5) / 0.13;
      const base = lerp(0.068, 0.055, t);
      const arm = 0.3 * easeOutCubic(t);
      cx = 0.045 * Math.sin(u * 2.6);
      cz = 0.02 * Math.cos(u * 3.1);
      radius = (th) =>
        base +
        arm * Math.pow(Math.max(0, Math.cos(3 * th + 0.6 + u * 4)), 3) * (1 + 0.1 * Math.sin(th * 2 + u * 30)) +
        0.012 * Math.sin(11 * th);
    } else {
      // copa: envolvente redondeada con lóbulos de follaje que giran con la altura
      const t = (u - 0.63) / 0.37;
      const env = 0.12 + 0.56 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.75)), 0.7);
      const armFade = Math.max(0, 1 - t * 2.5);
      cx = 0.06 * Math.sin(t * Math.PI * 1.4) + 0.02;
      cz = 0.05 * Math.cos(t * 2.3);
      radius = (th) =>
        env *
          (1 + 0.15 * Math.sin(5 * th + t * 6) + 0.09 * Math.sin(9 * th - t * 8 + 1) + 0.05 * Math.sin(16 * th + t * 12)) +
        armFade * 0.24 * Math.pow(Math.max(0, Math.cos(3 * th + 0.6 + u * 4)), 3);
    }
    out.push(ringXZ(y, radius, cx, cz));
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 02 — La primera pieza: mesa de láminas onduladas + tapa de cristal  */
/* ------------------------------------------------------------------ */
export function tableSlices(nBody = SLICES - 4, nTop = 4, tr: Transform = {}): Pt3[][] {
  const out: Pt3[][] = [];
  for (let i = 0; i < nBody; i++) {
    const x = -0.62 + (1.24 * i) / (nBody - 1);
    const phi = x * 1.6; // la onda se desfasa a lo largo → la base se retuerce
    const center = (s: number): [number, number] => [
      -0.5 + 0.6 * s,
      0.24 * Math.sin(1.5 * Math.PI * s + phi) * (0.45 + 0.55 * Math.pow(1 - s, 1.2)) + 0.02,
    ];
    out.push(bandYZ(x, center, 0.052));
  }
  const tops: [number, number][] = [
    [0.12, 0],
    [0.14, 0],
    [0.14, 0.07],
    [0.14, 0.17],
  ];
  for (let j = 0; j < nTop; j++) {
    const [y, inset] = tops[j % tops.length];
    out.push(roundedRectXZ(y, 0.68 - inset, 0.36 - inset, 0.06));
  }
  return out.map((s) => applyT(s, tr));
}

/** Catmull-Rom: suaviza una polilínea 2D [y, z]. */
function catmullRom(pts: [number, number][], seg = 10): [number, number][] {
  const out: [number, number][] = [];
  const P = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    for (let j = 0; j < seg; j++) {
      const t = j / seg;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 *
          (2 * p1[0] +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 *
          (2 * p1[1] +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Convierte una polilínea en una función centro(s) equiespaciada por arco. */
function polylineCenter(pts: [number, number][]): (s: number) => [number, number] {
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = cum[cum.length - 1] || 1;
  return (s: number) => {
    const target = Math.max(0, Math.min(1, s)) * total;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < target) i++;
    const a = pts[i - 1];
    const b = pts[i];
    const f = cum[i] - cum[i - 1] > 1e-9 ? (target - cum[i - 1]) / (cum[i] - cum[i - 1]) : 0;
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  };
}

/* ------------------------------------------------------------------ */
/* 03 — La forma madura: silla escultórica de láminas (tipo ribbon).   */
/*      Respaldo alto y sinuoso que fluye al asiento y cae en un rizo  */
/*      frontal hasta el piso, como una cinta continua de madera.      */
/* ------------------------------------------------------------------ */
const CHAIR_PROFILE: [number, number][] = [
  [1.06, -0.3], // corona del respaldo, leve rizo al frente
  [1.0, -0.44],
  [0.74, -0.5], // respaldo alto
  [0.52, -0.42], // lumbar hacia adentro
  [0.42, -0.24], // unión con el asiento
  [0.37, 0.02], // centro del asiento (ligera caída)
  [0.4, 0.28], // frente del asiento
  [0.3, 0.46], // caída en cascada
  [0.04, 0.52], // frente del rizo
  [-0.24, 0.44],
  [-0.44, 0.16], // base del rizo sobre el piso
  [-0.46, -0.14], // patín que vuelve hacia atrás
  [-0.38, -0.32], // extremo que se levanta levemente
];
const CHAIR_CURVE = polylineCenter(catmullRom(CHAIR_PROFILE, 10));

export function chairSlices(n = SLICES, tr: Transform = {}): Pt3[][] {
  const out: Pt3[][] = [];
  const FLOOR = -0.48;
  for (let i = 0; i < n; i++) {
    const xi = n === 1 ? 0 : -1 + (2 * i) / (n - 1); // -1..1
    const x = xi * 0.5;
    const edge = xi * xi; // 0 centro, 1 bordes

    const center = (s: number): [number, number] => {
      const [y, z0] = CHAIR_CURVE(s);
      let z = z0;
      // En los bordes el respaldo envuelve el cuerpo
      const up = Math.max(0, Math.min(1, (y - 0.2) / 0.7));
      z *= 1 - 0.2 * edge * up;
      // El rizo inferior se estrecha un poco en los bordes
      const low = Math.max(0, Math.min(1, -y));
      z *= 1 - 0.1 * edge * low;
      return [y, z];
    };

    const slice = bandYZ(x, center, 0.048, 34).map(
      ([px, py, pz]): Pt3 => [px, py < FLOOR ? FLOOR : py, pz],
    );
    out.push(applyT(slice, tr));
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Fábricas públicas                                                   */
/* ------------------------------------------------------------------ */
function assemble(slices: Pt3[][], groups: number[]): Form {
  if (slices.length !== SLICES) throw new Error(`La forma necesita ${SLICES} láminas, tiene ${slices.length}`);
  const pts: Pt3[] = [];
  for (const s of slices) {
    if (s.length !== PER_SLICE) throw new Error(`Cada lámina necesita ${PER_SLICE} puntos, tiene ${s.length}`);
    for (const p of s) pts.push(p);
  }
  return { pts, groups };
}

export function treeForm(): Form {
  const slices = treeSlices(SLICES);
  return assemble(slices, slices.map(() => 0));
}

export function tableForm(): Form {
  const slices = tableSlices(SLICES - 4, 4);
  return assemble(slices, slices.map((_, i) => (i < SLICES - 4 ? 0 : 1)));
}

export function chairForm(): Form {
  const slices = chairSlices(SLICES);
  return assemble(slices, slices.map(() => 0));
}

/** 04 — El resultado: piso + panel de pared + sillón + mesa + lámpara (8+12+22+14+8 = 64). */
export function roomForm(): Form {
  const slices: Pt3[][] = [];
  const groups: number[] = [];

  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    slices.push(roundedRectXZ(-0.5, lerp(0.16, 0.92, t), lerp(0.1, 0.62, t), 0.1));
    groups.push(0);
  }
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const h = 0.7 + 0.22 * Math.sin(t * Math.PI * 1.6 + 0.3); // panel paramétrico
    slices.push(slatXY(-0.62, -0.8 + 1.6 * t, -0.5, -0.5 + h, 0.03));
    groups.push(1);
  }
  for (const s of chairSlices(22, { scale: 0.5, ox: -0.36, oy: -0.25, oz: 0.08 })) {
    slices.push(s);
    groups.push(2);
  }
  for (const s of tableSlices(12, 2, { scale: 0.48, ox: 0.36, oy: -0.26, oz: -0.02 })) {
    slices.push(s);
    groups.push(3);
  }
  const lampX = 0.74;
  const lampZ = -0.4;
  const lamp: [number, number][] = [
    [-0.5, 0.09],
    [-0.3, 0.012],
    [-0.05, 0.012],
    [0.2, 0.012],
    [0.32, 0.06],
    [0.42, 0.12],
    [0.5, 0.14],
    [0.53, 0.125],
  ];
  for (const [y, r] of lamp) {
    slices.push(ringXZ(y, () => r, lampX, lampZ));
    groups.push(4);
  }
  return assemble(slices, groups);
}

/** Índice del punto más alto — donde se ancla el marcador técnico. */
export function anchorIndex(form: Form): number {
  let best = 0;
  let bestY = -Infinity;
  for (let i = 0; i < form.pts.length; i++) {
    if (form.pts[i][1] > bestY) {
      bestY = form.pts[i][1];
      best = i;
    }
  }
  return best;
}
