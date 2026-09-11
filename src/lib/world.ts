/**
 * world.ts — geometría terrestre aproximada en polígonos lat/lon.
 * Se usa para el dot-map del preloader y para el globo de puntos del hero.
 * Precisión deliberadamente baja (estética), no cartográfica.
 */

type Poly = [number, number][]; // [lon, lat]

const LAND: Poly[] = [
  // Norteamérica
  [
    [-168, 65], [-160, 70], [-140, 70], [-125, 70], [-110, 68], [-95, 70], [-80, 73], [-70, 70],
    [-60, 60], [-55, 50], [-65, 45], [-70, 42], [-75, 35], [-81, 25], [-84, 30], [-90, 29],
    [-97, 26], [-105, 20], [-96, 16], [-92, 15], [-85, 11], [-78, 8], [-83, 15], [-95, 17],
    [-105, 23], [-115, 30], [-124, 35], [-124, 48], [-135, 58], [-150, 60], [-165, 63],
  ],
  // Groenlandia
  [
    [-45, 60], [-40, 64], [-32, 68], [-25, 70], [-20, 74], [-25, 78], [-35, 80], [-50, 80],
    [-58, 76], [-60, 72], [-55, 68], [-50, 63],
  ],
  // Sudamérica
  [
    [-78, 8], [-72, 11], [-62, 10], [-52, 5], [-44, -2], [-35, -6], [-38, -13], [-40, -20],
    [-48, -25], [-53, -34], [-58, -38], [-62, -40], [-65, -45], [-68, -52], [-72, -54],
    [-74, -50], [-73, -44], [-71, -35], [-70, -25], [-70, -18], [-75, -14], [-79, -6],
    [-80, 0],
  ],
  // Europa
  [
    [-9, 43], [-9, 37], [3, 39], [10, 44], [15, 40], [18, 40], [23, 36], [27, 40], [30, 45],
    [40, 45], [45, 42], [48, 45], [50, 52], [40, 60], [30, 60], [28, 70], [20, 70], [12, 65],
    [5, 60], [8, 55], [4, 52], [0, 50], [-5, 48], [-2, 44],
  ],
  // África
  [
    [-17, 15], [-16, 20], [-10, 26], [0, 30], [10, 32], [20, 32], [32, 31], [35, 28], [43, 12],
    [51, 12], [48, 5], [40, -2], [40, -12], [35, -20], [32, -26], [26, -34], [19, -35],
    [14, -23], [12, -16], [9, -1], [9, 4], [3, 6], [-5, 5], [-8, 4], [-13, 8],
  ],
  // Asia
  [
    [45, 42], [50, 45], [57, 45], [62, 44], [67, 41], [70, 40], [68, 35], [72, 32], [75, 28],
    [80, 26], [85, 22], [88, 22], [92, 21], [94, 17], [97, 13], [99, 8], [101, 4], [104, 1],
    [106, 8], [108, 12], [109, 16], [107, 20], [110, 21], [115, 23], [120, 26], [122, 31],
    [120, 35], [122, 37], [126, 40], [129, 42], [131, 45], [135, 48], [141, 52], [150, 59],
    [160, 61], [170, 65], [179, 67], [179, 71], [165, 72], [150, 72], [135, 73], [120, 74],
    [105, 76], [90, 75], [75, 73], [65, 71], [58, 69], [50, 67], [48, 60], [45, 52], [44, 45],
  ],
  // Península arábiga
  [
    [35, 32], [48, 30], [56, 26], [59, 22], [55, 17], [48, 14], [43, 13], [39, 17], [35, 28],
  ],
  // India
  [
    [68, 24], [72, 20], [73, 16], [76, 10], [78, 8], [80, 13], [82, 17], [86, 21], [88, 22],
    [85, 25], [80, 28], [72, 26],
  ],
  // Japón
  [[130, 32], [135, 34], [140, 36], [141, 41], [145, 44], [142, 45], [138, 37], [133, 34], [130, 31]],
  // Sumatra
  [[95, 5], [100, 0], [104, -3], [106, -6], [102, -5], [97, 2]],
  // Java
  [[105, -6], [112, -7], [115, -8], [110, -8], [105, -7]],
  // Borneo
  [[109, 2], [114, 4], [118, 5], [117, 0], [114, -3], [110, -3]],
  // Nueva Guinea
  [[131, -1], [138, -2], [145, -5], [150, -9], [145, -8], [138, -7], [132, -4]],
  // Filipinas
  [[120, 18], [122, 16], [124, 12], [126, 8], [125, 7], [122, 10], [120, 14]],
  // Reino Unido
  [[-5, 50], [1, 51], [0, 53], [-2, 56], [-4, 58], [-6, 55], [-5, 52]],
  // Madagascar
  [[43, -12], [50, -15], [48, -25], [45, -25], [43, -18]],
  // Australia
  [
    [114, -22], [113, -26], [115, -33], [118, -35], [124, -33], [129, -32], [132, -32], [135, -35],
    [138, -35], [141, -38], [146, -39], [150, -37], [153, -32], [153, -27], [151, -24], [146, -19],
    [142, -11], [137, -12], [135, -15], [130, -12], [125, -14], [122, -17], [117, -20],
  ],
  // Nueva Zelanda
  [[173, -35], [178, -38], [177, -40], [174, -41], [171, -43], [167, -46], [170, -44], [172, -40]],
];

function pointInPoly(lon: number, lat: number, poly: Poly): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function isLand(lon: number, lat: number): boolean {
  for (const poly of LAND) if (pointInPoly(lon, lat, poly)) return true;
  return false;
}

/** Puntos lat/lon de una retícula equirectangular filtrados por tierra. */
export function landGrid(step = 2.6): { lat: number; lon: number }[] {
  const pts: { lat: number; lon: number }[] = [];
  for (let lat = -60; lat <= 78; lat += step) {
    for (let lon = -180; lon <= 180; lon += step) {
      if (isLand(lon, lat)) pts.push({ lat, lon });
    }
  }
  return pts;
}

/** Esfera de Fibonacci: distribución uniforme de puntos sobre el globo. */
export function fibonacciSphere(n: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return pts;
}

export function latLonToVec(lat: number, lon: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ];
}
