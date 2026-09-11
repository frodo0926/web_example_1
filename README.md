# Resplandecer

> Carpintería paramétrica, muebles de autor, cocinas y remodelaciones integrales —
> presentadas como una experiencia digital de nivel agencia.

Sitio corporativo de **Resplandecer**, un grupo de carpintería de alta calidad con sede en
**Sogamoso, Boyacá (Colombia)**, cobertura en todo el país y talleres en 9 países.
El proyecto toma como referencia el estándar visual de los sitios premiados en Awwwards:
minimalismo editorial, tipografía protagonista, animaciones premium y dos piezas
interactivas construidas a medida.

![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square)
![GSAP](https://img.shields.io/badge/GSAP-3-88ce02?style=flat-square)
![Lenis](https://img.shields.io/badge/Lenis-smooth%20scroll-ff5500?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square)

---

## ✨ Lo destacado

- **Escultura interactiva en el hero** — un árbol se transforma, lámina a lámina, en una
  mesa, luego en una silla escultórica de cinta continua y finalmente en un ambiente
  completo. Arrastrable con el mouse/touch, con selector de etapas, cotas técnicas y
  marcador de pieza. Dibujada 100 % con puntos y líneas en canvas (4.096 puntos,
  64 láminas).
- **Secuencia de obra antes/después** — al hacer scroll, el espacio en obra gris se
  escanea (nube de puntos), se acota con su malla y un barrido láser revela el proyecto
  hasta el render final, con HUD de visualización (fases, muestras, tiempo, estado).
- **Preloader con mapa de puntos del mundo** que se dibuja progresivamente, contador
  0→100 y la sede resaltada en rojo con ficha legible.
- **Transiciones de página tipo cortina** (doble panel) sin flash blanco, hash routing
  con sub-rutas (`#/contacto/trabajo`).
- **Smooth scroll (Lenis) sincronizado con GSAP ScrollTrigger**, split-text en titulares,
  reveals on-scroll, marquees infinitos y contadores animados.
- **Tema dual claro/oscuro** con tokens centralizados y presets listos (moda pastel,
  tech, modelaje, real estate, corporativo).
- **Contacto funcional** con formulario por modo (proyecto / colaboración) y enlaces de
  **WhatsApp** (`wa.me`) con icono oficial.
- **SEO y accesibilidad**: JSON-LD (Organization + FAQPage), Open Graph, sitemap,
  `prefers-reduced-motion`, ARIA en acordeones y menús, navegación por teclado.

## 🧰 Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 + Vite 7 (build single-file) |
| Estilos | Tailwind CSS v4 (`@theme` con tokens de marca) |
| Animación | GSAP 3 + ScrollTrigger, Lenis |
| Lenguaje | TypeScript 5 |
| Gráficos | Canvas 2D a medida (globo de puntos, escultura laminada, secuencia de obra) |
| Tipografías | Archivo (display variable), Inter (cuerpo), IBM Plex Mono (labels) |
| Imágenes | Pexels (stock) con blur-up y `srcset` |

## 🚀 Inicio rápido

```bash
# 1. Clona e instala
git clone <tu-repo> resplandecer
cd resplandecer
npm install

# 2. Desarrollo
npm run dev          # http://localhost:5173

# 3. Producción
npm run build        # genera dist/ (HTML single-file)
npm run preview      # sirve el build localmente
```

## 📁 Estructura

```
src/
├── components/
│   ├── MaterialOrb.tsx     # Escultura interactiva del hero (4 etapas, arrastre, HUD)
│   ├── FrameSequence.tsx   # Secuencia de obra antes → después (scroll-scrub)
│   ├── Preloader.tsx       # Mapa de puntos + contador 0→100
│   ├── Nav.tsx             # Nav fija, drawer de Insights, menú móvil
│   ├── Footer.tsx          # Oficinas, links, WhatsApp
│   ├── FaqAccordion.tsx    # Acordeón numerado accesible
│   ├── InsightsGrid.tsx    # Blog con filtros por categoría
│   ├── ServiceList.tsx     # Lista de servicios con imagen flotante
│   ├── PageHero.tsx        # Hero editorial reutilizable
│   ├── Cursor.tsx          # Cursor personalizado blend-difference
│   └── ui.tsx              # SplitHeading, Reveal, Counter, Marquee, SmartImage…
├── lib/
│   ├── materialForms.ts    # Geometría procedural (árbol, mesa, silla, ambiente)
│   ├── world.ts            # Continentes → dot-map del preloader
│   ├── anim.ts             # Lenis + GSAP, reveals, utilidades de movimiento
│   └── router.ts           # Hash router con sub-rutas
├── data/
│   └── content.ts          # TODO el contenido tipo CMS (servicios, FAQs, oficinas…)
├── pages/                  # Home, Servicios, Nosotros, Insights, Contacto, FAQ
└── index.css               # 🎨 Tokens de marca + presets de paleta
docs/
└── PROMPT_MAESTRO.md       # Guía para reutilizar el sistema en otra industria
```

## 🎨 Personalización rápida

**Marca / colores** — todo el color vive en `src/index.css` (`@theme`). Comenta el preset
activo y descomenta otro (moda pastel, tech, modelaje, real estate, corporativo) o escribe
el tuyo:

```css
--color-ink:      /* fondo oscuro */
--color-paper:    /* fondo claro */
--color-electric: /* acento frío / técnico */
--color-ember:    /* acento cálido / CTA */
```

**Contenido** — `src/data/content.ts`: servicios, artículos, FAQs, oficinas (la primera con
`highlight: true` es la sede que brilla en rojo), datos de contacto y ciudades del marquee.

**Escultura del hero** — `ORB_STAGES` en `MaterialOrb.tsx` (textos y cotas por etapa) y
`materialForms.ts` (geometría: primitivas `ringXZ`, `bandYZ`, `roundedRectXZ`, `slatXY`).

**Secuencia de obra** — `FrameSequence.tsx`: cambia `BEFORE_IMG` / `AFTER_IMG`, reposiciona
las cajas acotadas en `BOXES` y ajusta las curvas `ramp()` de cada fase.

**Réplica en otra industria** — [`docs/PROMPT_MAESTRO.md`](docs/PROMPT_MAESTRO.md) contiene
el prompt reutilizable y las guías paso a paso.

## 🗺 Páginas

| Ruta | Contenido |
|---|---|
| `#/` | Hero interactivo, manifiesto, secuencia de obra, servicios, proceso, FAQ e Insights |
| `#/servicios` | Índice, showroom interactivo, detalle de 6 servicios, capacidades |
| `#/nosotros` | Historia 2018→2026, valores, proceso, presencia en 9 países |
| `#/insights` | Artículo destacado, archivo filtrable, newsletter |
| `#/contacto` | Formulario de proyecto + WhatsApp |
| `#/contacto/trabajo` | Formulario de colaboraciones y alianzas |
| `#/faq` | 8 respuestas con índice por tema |

## ♿ Accesibilidad y rendimiento

- `prefers-reduced-motion` desactiva Lenis, el morph y el preloader animado.
- Canvas con `IntersectionObserver`: solo se dibuja en pantalla.
- Contraste AA, `focus-visible`, `aria-expanded`/`aria-pressed`, skip-link.
- Imágenes lazy con blur-up; fuentes con `font-display: swap`.

## 📞 Contacto

- 🌐 Sede: Carrera 11 № 14-25, Sogamoso, Boyacá — Colombia
- 💬 WhatsApp: +57 322 252 3331
- ✉️ hola@resplandecer.studio

---

Hecho con oficio en Sogamoso. 🪵
