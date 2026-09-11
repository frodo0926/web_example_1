import { useEffect, useRef, useState } from "react";
import { NAV, ARTICLES } from "@/data/content";
import { ROUTE_META, type Route } from "@/lib/router";
import { gsap, lockScroll } from "@/lib/anim";
import { cn } from "@/utils/cn";
import { SmartImage } from "@/components/ui";

export default function Nav({
  route,
  onNavigate,
  ready,
}: {
  route: Route;
  onNavigate: (r: Route, param?: string) => void;
  ready: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const lastY = useRef(0);
  const barRef = useRef<HTMLDivElement>(null);

  /* entrada */
  useEffect(() => {
    if (!ready || !barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { yPercent: -130 },
      { yPercent: 0, duration: 1.1, ease: "expo.out", delay: 0.15 },
    );
  }, [ready]);

  /* scroll: ocultar al bajar, tema según sección */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 140 && y > lastY.current);
        lastY.current = y;

        const sentinels = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
        let current: "dark" | "light" = "dark";
        sentinels.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 90) current = el.dataset.navTheme === "light" ? "light" : "dark";
        });
        setTheme(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [route]);

  /* drawer / menú móvil: bloquear scroll */
  useEffect(() => {
    lockScroll(drawer || menu);
    return () => lockScroll(false);
  }, [drawer, menu]);

  useEffect(() => {
    setDrawer(false);
    setMenu(false);
  }, [route]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawer(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (r: Route) => {
    setMenu(false);
    setDrawer(false);
    onNavigate(r);
  };

  const light = theme === "light" && !drawer && !menu;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:text-white"
      >
        Saltar al contenido
      </a>

      <div
        ref={barRef}
        className={cn(
          "fixed inset-x-0 top-0 z-[120] transition-[transform,background-color,border-color] duration-700",
          hidden && !drawer && !menu ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "border-b transition-colors duration-500",
            scrolled
              ? light
                ? "border-ink/10 bg-paper/80 backdrop-blur-xl"
                : "border-white/10 bg-ink/70 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Principal"
            className="shell flex h-[76px] items-center justify-between gap-6"
          >
            {/* Logo */}
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                go("home");
              }}
              className="group flex items-center gap-3"
              data-cursor="link"
            >
              <span
                className={cn(
                  "relative flex h-[26px] w-[26px] items-center justify-center rounded-full border transition-colors duration-500",
                  light ? "border-ink/30" : "border-white/30",
                )}
              >
                <span className="dot scale-[0.55] group-hover:scale-100 transition-transform duration-500" />
              </span>
              <span
                className={cn(
                  "h-display text-[1.05rem] leading-none tracking-[-0.02em] transition-colors duration-500",
                  light ? "text-ink" : "text-white",
                )}
              >
                Resplandecer
              </span>
            </a>

            {/* Links desktop */}
            <ul
              className="hidden items-center gap-1 lg:flex"
              style={{ opacity: ready ? 1 : 0, transition: "opacity .8s" }}
            >
              {NAV.map((item) => {
                const active = route === item.route;
                const isInsights = item.route === "insights";
                return (
                  <li key={item.href} className="flex items-center">
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item.route);
                      }}
                      data-cursor="link"
                      className={cn(
                        "relative rounded-full px-4 py-2 text-[0.82rem] tracking-tight transition-colors duration-400",
                        light ? "text-ink/70 hover:text-ink" : "text-white/70 hover:text-white",
                        active && (light ? "text-ink" : "text-white"),
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-ember transition-transform duration-500",
                          active && "scale-x-100",
                        )}
                      />
                    </a>
                    {isInsights && (
                      <button
                        type="button"
                        aria-label="Abrir categorías de Insights"
                        aria-expanded={drawer}
                        aria-controls="insights-drawer"
                        onClick={() => setDrawer((d) => !d)}
                        data-cursor="link"
                        className={cn(
                          "-ml-3 flex h-7 w-7 items-center justify-center rounded-full border text-[9px] transition-all duration-500",
                          drawer
                            ? "rotate-180 border-ember text-ember"
                            : light
                              ? "border-ink/15 text-ink/60 hover:border-ink/40"
                              : "border-white/15 text-white/60 hover:border-white/40",
                        )}
                      >
                        ▾
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <a
                href="#/contacto/trabajo"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("contacto", "trabajo");
                }}
                data-cursor="button"
                className={cn(
                  "btn hidden sm:inline-flex",
                  light ? "btn-light" : "btn-ghost",
                )}
              >
                <span>Trabaja con nosotros</span>
              </a>

              <button
                type="button"
                aria-label={menu ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menu}
                onClick={() => setMenu((m) => !m)}
                data-cursor="button"
                className={cn(
                  "flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border transition-colors duration-500 lg:hidden",
                  light ? "border-ink/20" : "border-white/20",
                )}
              >
                <span
                  className={cn(
                    "block h-px w-4 transition-all duration-400",
                    light ? "bg-ink" : "bg-white",
                    menu && "translate-y-[3px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "block h-px w-4 transition-all duration-400",
                    light ? "bg-ink" : "bg-white",
                    menu && "-translate-y-[3px] -rotate-45",
                  )}
                />
              </button>
            </div>
          </nav>
        </div>

        {/* Drawer Insights */}
        <div
          id="insights-drawer"
          className={cn(
            "hidden overflow-hidden border-b bg-ink text-white transition-[max-height,opacity] duration-700 lg:block",
            drawer ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="shell grid grid-cols-12 gap-10 py-10">
            <div className="col-span-3">
              <p className="label mb-4 text-ember">Categorías</p>
              <ul className="space-y-2">
                {["Todos", "Materiales", "Proceso", "Interiorismo", "Tapicería", "Contract", "Taller"].map(
                  (c, i) => (
                    <li key={c}>
                      <a
                        href="#/insights"
                        onClick={(e) => {
                          e.preventDefault();
                          go("insights");
                        }}
                        className="group flex items-baseline gap-3 text-[0.95rem] text-white/60 transition-colors hover:text-white"
                        data-cursor="link"
                      >
                        <span className="mono text-[0.6rem] opacity-40">
                          {String(i).padStart(2, "0")}
                        </span>
                        {c}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="col-span-9">
              <p className="label mb-4 text-white/40">Últimos artículos</p>
              <div className="grid grid-cols-3 gap-5">
                {ARTICLES.slice(0, 3).map((a) => (
                  <a
                    key={a.slug}
                    href="#/insights"
                    onClick={(e) => {
                      e.preventDefault();
                      go("insights");
                    }}
                    className="group block"
                    data-cursor="link"
                  >
                    <SmartImage
                      src={a.image}
                      alt={a.title}
                      ratio="16/10"
                      className="mb-3 rounded-sm"
                    />
                    <p className="mono mb-1 text-[0.6rem] text-ember">
                      {a.category} — {a.date}
                    </p>
                    <p className="text-sm leading-snug text-white/80 group-hover:text-white">
                      {a.title}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={cn(
          "fixed inset-0 z-[115] bg-ink text-white transition-[clip-path] duration-800 lg:hidden",
          menu ? "pointer-events-auto" : "pointer-events-none",
        )}
        style={{
          clipPath: menu ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
          transition: "clip-path .9s cubic-bezier(.16,1,.3,1)",
        }}
        aria-hidden={!menu}
      >
        <div className="flex h-full flex-col justify-between pt-[100px] pb-10 shell">
          <ul className="space-y-1">
            {NAV.map((item, i) => (
              <li key={item.href} className="overflow-hidden border-b border-white/10">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.route);
                  }}
                  className="flex items-baseline justify-between py-4"
                  style={{
                    transform: menu ? "translateY(0)" : "translateY(40px)",
                    opacity: menu ? 1 : 0,
                    transition: `all .8s cubic-bezier(.16,1,.3,1) ${0.08 + i * 0.06}s`,
                  }}
                >
                  <span className="h-display text-[clamp(2rem,9vw,3.4rem)]">
                    {ROUTE_META[item.route].label}
                  </span>
                  <span className="mono text-[0.6rem] text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="space-y-4">
            <a
              href="#/contacto/trabajo"
              onClick={(e) => {
                e.preventDefault();
                setMenu(false);
                onNavigate("contacto", "trabajo");
              }}
              className="btn btn-fill w-full justify-center"
            >
              <span>Trabaja con nosotros</span>
            </a>
            <p className="mono text-[0.6rem] text-white/40">
              Sogamoso · Bogotá · Medellín · Miami
            </p>
          </div>
        </div>
      </div>

    </>
  );
}
