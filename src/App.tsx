import { useCallback, useEffect, useRef, useState } from "react";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Home from "@/pages/Home";
import Servicios from "@/pages/Servicios";
import Nosotros from "@/pages/Nosotros";
import Insights from "@/pages/Insights";
import Contacto from "@/pages/Contacto";
import Faq from "@/pages/Faq";
import { parseHash, routeFromHash, type Route } from "@/lib/router";
import {
  gsap,
  initSmoothScroll,
  lockScroll,
  prefersReducedMotion,
  ScrollTrigger,
  scrollTop,
} from "@/lib/anim";
import { SplitHeading, Reveal, Marquee } from "@/components/ui";
import { IMG, TICKER_SERVICES } from "@/data/content";

const TITLES: Record<Route, string> = {
  home: "Resplandecer — Muebles de autor, cocinas y remodelaciones de alto nivel",
  servicios: "Servicios — Carpintería, cocinas y remodelaciones | Resplandecer",
  nosotros: "Nosotros — 120 artesanos, 9 países | Resplandecer",
  insights: "Insights — Notas desde el taller | Resplandecer",
  contacto: "Contacto — Inicia tu proyecto | Resplandecer",
  faq: "FAQ — Preguntas frecuentes | Resplandecer",
};

export default function App() {
  const [route, setRoute] = useState<Route>(() => routeFromHash());
  const [booting, setBooting] = useState(true);
  const [ready, setReady] = useState(false);
  const [param, setParam] = useState<string | undefined>(undefined);
  const overlayRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  /* ---------- smooth scroll + precarga de imágenes clave ---------- */
  useEffect(() => {
    // Evita que el navegador restaure el scroll del reload: la página
    // siempre se entrega desde arriba, sin salto que parezca un refresco.
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initSmoothScroll();
    [IMG.openPlan, IMG.livingLight, IMG.workshopSaw].forEach((src) => {
      const i = new Image();
      i.decoding = "async";
      i.src = src;
    });
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  /* ---------- progreso de lectura ---------- */
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [route]);

  /* ---------- hash routing (atrás/adelante) ---------- */
  useEffect(() => {
    const onHash = () => {
      const { route: next, param: nextParam } = parseHash();
      setParam(nextParam);
      setRoute((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* ---------- bloquear scroll durante el preloader ---------- */
  useEffect(() => {
    lockScroll(booting);
  }, [booting]);

  useEffect(() => {
    document.title = TITLES[route];
  }, [route]);

  /* ---------- navegación con cortina ---------- */
  const navigate = useCallback(
    (next: Route, nextParam?: string) => {
      if (busy.current) return;
      if (next === route && nextParam === param) {
        scrollTop(false);
        return;
      }

      const reduced = prefersReducedMotion();
      const targetHash =
        next === "home" ? "#/" : nextParam ? `#/${next}/${nextParam}` : `#/${next}`;

      const apply = () => {
        setParam(nextParam);
        setRoute(next);
        requestAnimationFrame(() => {
          scrollTop(true);
          ScrollTrigger.refresh();
        });
      };

      if (reduced) {
        window.location.hash = targetHash;
        apply();
        return;
      }

      busy.current = true;
      const overlay = overlayRef.current;
      if (overlay) overlay.style.pointerEvents = "auto";
      const cols = colsRef.current
        ? (Array.from(colsRef.current.children) as HTMLElement[])
        : [];

      gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
            if (overlay) overlay.style.pointerEvents = "none";
            gsap.set(cols, { yPercent: 100 });
            if (loaderRef.current) gsap.set(loaderRef.current, { autoAlpha: 0 });
          },
        })
        // 1) columnas escalonadas con filo luminoso cubren la pantalla
        .to(cols, { yPercent: 0, duration: 0.52, ease: "power4.inOut", stagger: 0.055 }, 0)
        // 2) cargador de marca mientras se intercambia la página
        .to(loaderRef.current, { autoAlpha: 1, duration: 0.22, ease: "power2.out" }, 0.62)
        .add(() => {
          window.location.hash = targetHash;
          apply();
        }, 0.68)
        .to(loaderRef.current, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, "+=0.48")
        // 3) las columnas continúan su camino y descubren la página nueva
        .to(cols, { yPercent: -100, duration: 0.58, ease: "expo.inOut", stagger: 0.055 }, 1.36);
    },
    [route, param],
  );

  const Page = () => {
    switch (route) {
      case "servicios":
        return <Servicios onNavigate={navigate} />;
      case "nosotros":
        return <Nosotros />;
      case "insights":
        return <Insights onNavigate={navigate} />;
      case "contacto":
        return <Contacto modo={param === "trabajo" ? "trabajo" : "proyecto"} />;
      case "faq":
        return <Faq onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <>
      <Cursor />

      {/* Barra de progreso de lectura */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[125] h-[2px] origin-left bg-ember"
        style={{ transform: "scaleX(0)" }}
      />

      {booting && (
        <Preloader
          onReveal={() => {
            window.scrollTo(0, 0);
            setReady(true);
            lockScroll(false);
            scrollTop(true);
          }}
          onDone={() => setBooting(false)}
        />
      )}

      <Nav route={route} onNavigate={navigate} ready={ready} />

      {ready && (
        <>
          <main id="main" key={route}>
            <Page />
            <CtaBand onNavigate={navigate} />
          </main>
          <Footer onNavigate={navigate} />
        </>
      )}

      {/* Cortina de transición entre páginas */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[150]"
        aria-hidden="true"
      >
        {/* Columnas escalonadas con filo luminoso (transición tipo blinds) */}
        <div ref={colsRef} className="absolute inset-0 flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative h-full flex-1 bg-ink will-change-transform"
              style={{
                transform: "translateY(100%)",
                borderRight: i < 5 ? "1px solid rgba(255,255,255,0.05)" : undefined,
              }}
            >
              <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-ember to-transparent" />
            </div>
          ))}
        </div>
        {/* Cargador de marca visible mientras la cortina cubre */}
        <div
          ref={loaderRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <span className="flex items-center gap-3">
            <span className="page-loader-dot dot" />
            <span className="h-display text-base tracking-[-0.02em] text-white">
              Resplandecer
            </span>
          </span>
          <span className="page-loader-bar relative block h-px w-32 overflow-hidden bg-white/15" />
          <span className="mono text-[0.55rem] tracking-[0.34em] text-white/50">
            CARGANDO
          </span>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Banda CTA compartida                                               */
/* ------------------------------------------------------------------ */
function CtaBand({ onNavigate }: { onNavigate: (r: Route) => void }) {
  return (
    <section
      className="grain relative overflow-hidden bg-ink text-white"
      data-nav-theme="dark"
    >
      <div className="pointer-events-none absolute -left-32 top-0 h-[34vw] w-[34vw] rounded-full bg-electric/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-24 bottom-[-20%] h-[28vw] w-[28vw] rounded-full bg-ember/12 blur-[150px]" />

      <div className="shell relative z-10 grid grid-cols-12 items-end gap-y-12 gap-x-8 py-20 md:py-28">
        <div className="col-span-12 lg:col-span-8">
          <SplitHeading className="h-xl max-w-[18ch] text-white">
            Empecemos por el espacio
          </SplitHeading>
          <Reveal className="mt-8">
            <p className="max-w-[48ch] text-[0.98rem] leading-relaxed text-white/55">
              Envíanos la planta, unas fotos o solo una idea. Te devolvemos una valoración
              honesta con rango de precio y plazo real.
            </p>
          </Reveal>
        </div>
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-3 lg:col-start-10 lg:items-end">
          <a
            href="#/contacto"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("contacto");
            }}
            data-cursor="button"
            className="btn btn-fill"
          >
            <span>Iniciar proyecto</span>
          </a>
          <a
            href="#/servicios"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("servicios");
            }}
            data-cursor="button"
            className="btn btn-ghost"
          >
            <span>Ver servicios</span>
          </a>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <Marquee
          items={TICKER_SERVICES}
          className="py-4 text-white/40"
          duration={44}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-[0.12]">
        <img
          src={IMG.livingDark}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
