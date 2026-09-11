import { useEffect, useRef } from "react";
import MaterialOrb from "@/components/MaterialOrb";
import FrameSequence from "@/components/FrameSequence";
import ServiceList from "@/components/ServiceList";
import FaqAccordion from "@/components/FaqAccordion";
import InsightsGrid from "@/components/InsightsGrid";
import {
  Counter,
  Marquee,
  Pill,
  Reveal,
  SectionHead,
  SmartImage,
  SplitHeading,
} from "@/components/ui";
import { gsap, initReveals, prefersReducedMotion, ScrollTrigger } from "@/lib/anim";
import { COLOMBIA_CITIES, HQ, IMG, PROCESS, STATS, TICKER_SERVICES, VALUES } from "@/data/content";
import type { Route } from "@/lib/router";

/* ---------------------------------------------------------------- */
/* Contador sincronizado con el scroll                               */
/* ---------------------------------------------------------------- */
function ScrollCounter() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const num = numRef.current;
    if (!wrap || !num) return;

    const state = { v: 0 };
    const format = (n: number) =>
      n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    if (prefersReducedMotion()) {
      num.textContent = format(2500);
      return;
    }

    const tween = gsap.to(state, {
      v: 2500,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top 85%",
        end: "bottom 60%",
        scrub: 0.5,
      },
      onUpdate: () => (num.textContent = format(state.v)),
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={wrapRef} className="shell bg-paper py-20 md:py-28" data-nav-theme="light">
      <SectionHead index="04 / 08" label="Ritmo de taller" className="mb-10" />
      <div className="grid grid-cols-12 items-end gap-y-12 gap-x-8">
        <div className="col-span-12 lg:col-span-7">
          <p className="h-display text-[clamp(4rem,16vw,13rem)] leading-[0.82] tracking-[-0.04em]">
            <span ref={numRef} className="tnum">
              0
            </span>
            <span className="text-ember">+</span>
          </p>
          <p className="mono mt-4 text-[0.7rem] text-ink/50">
            piezas fabricadas al mes — talleres de {HQ.city}, Medellín y São Paulo
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="grid grid-cols-2 gap-8">
            {[
              { v: 48000, s: " m²", l: "Espacio transformado en 2025" },
              { v: 120, s: "", l: "Artesanos en plantilla" },
              { v: 9, s: "", l: "Países con equipo propio" },
              { v: 2, s: " sem", l: "Margen medio de respuesta" },
            ].map((m) => (
              <div key={m.l} className="border-t border-ink/12 pt-4">
                <p className="h-display text-[clamp(1.5rem,3vw,2.4rem)] leading-none">
                  <Counter value={m.v} suffix={m.s} />
                </p>
                <p className="mt-2 text-[0.75rem] leading-snug text-ink/50">{m.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* HOME                                                              */
/* ---------------------------------------------------------------- */
export default function Home({
  onNavigate,
}: {
  onNavigate: (r: Route, param?: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      initReveals(root);

      if (!prefersReducedMotion() && heroRef.current) {
        gsap.fromTo(
          "[data-hero-fade]",
          { y: 46, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.3, stagger: 0.11, ease: "expo.out", delay: 0.1 },
        );
      }
      // El orbe se revela por sí mismo (fundido propio del canvas) una vez que su
      // primer frame está dibujado: una sola aparición, sin doble carga.
    }, root);

    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      ctx.revert();
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={rootRef}>
      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="grain relative flex min-h-screen flex-col justify-end overflow-hidden bg-ink text-white"
        data-nav-theme="dark"
      >
        <div className="pointer-events-none absolute -left-[18%] top-[6%] h-[52vw] w-[52vw] rounded-full bg-electric/25 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-[-14%] right-[-8%] h-[40vw] w-[40vw] rounded-full bg-ember/12 blur-[150px]" />

        {/* Escultura laminada — árbol → mesa → mueble → ambiente. Solo desktop, arrastrable */}
        <div
          data-hero-globe
          className="pointer-events-auto absolute right-[2%] top-[45%] hidden h-[66vh] w-[66vh] -translate-y-1/2 lg:block xl:h-[76vh] xl:w-[76vh]"
        >
          <MaterialOrb className="h-full w-full" />
        </div>

        {/* Móvil: imagen estática con blur */}
        <div className="absolute inset-0 lg:hidden">
          <SmartImage
            src={IMG.livingLight}
            alt="Salón con mobiliario de madera diseñado por Resplandecer"
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-ink via-ink/80 to-transparent lg:block" />

        <div className="shell pointer-events-none relative z-10 flex flex-1 flex-col justify-center pb-16 pt-[calc(var(--nav-h)+5vh)]">
          <div data-hero-fade className="mb-8 flex items-center gap-3">
            <span className="dot" />
            <span className="label text-white/60">Un solo taller responsable</span>
          </div>

          <h1 className="h-display h-mega max-w-[16ch]">
            <span className="block overflow-hidden">
              <span className="split-word block" data-hero-fade>
                Del bosque
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="split-word block" data-hero-fade>
                al salón<span className="text-ember">.</span>
              </span>
            </span>
          </h1>

          <p
            data-hero-fade
            className="mt-8 max-w-[44ch] text-[0.98rem] leading-relaxed text-white/60 md:text-[1.1rem]"
          >
            Carpintería a medida, cocinas de autor, sofás y remodelaciones integrales. Un
            solo grupo que diseña, fabrica e instala desde Sogamoso, Boyacá — con cobertura
            en toda Colombia y talleres en 9 países.
          </p>

          <div data-hero-fade className="pointer-events-auto mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#/servicios"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("servicios");
              }}
              data-cursor="button"
              className="btn btn-fill"
            >
              <span>Ver servicios</span>
            </a>
            <a
              href="#/contacto/trabajo"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("contacto", "trabajo");
              }}
              data-cursor="button"
              className="btn btn-ghost"
            >
              <span>Trabaja con nosotros</span>
            </a>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 bg-ink/40 backdrop-blur-sm">
          <div className="shell grid grid-cols-2 items-center gap-6 py-5 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-baseline gap-3">
                <p className="h-display text-[clamp(1.1rem,2vw,1.7rem)] leading-none">
                  <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </p>
                <p className="mono text-[0.58rem] leading-tight text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center border-t border-white/10 bg-ink">
          <span className="label hidden shrink-0 items-center gap-2 border-r border-white/10 py-3 pl-[var(--pad)] pr-5 text-white/50 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d2d] shadow-[0_0_8px_2px_#ff2d2d66]" />
            Cobertura Colombia
          </span>
          <Marquee
            items={COLOMBIA_CITIES}
            className="min-w-0 flex-1 py-3 text-white/45"
            duration={170}
          />
        </div>
      </section>

      {/* ============ INTRO EDITORIAL ============ */}
      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell py-20 md:py-32">
          <SectionHead index="02 / 08" label="Quiénes somos" className="mb-12" />
          <div className="grid grid-cols-12 gap-y-12 gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <SplitHeading className="h-xl max-w-[18ch]">
                Hacemos el mueble. Cuidamos el resultado.
              </SplitHeading>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:pt-6">
              <Reveal>
                <p className="body-lg text-ink/70">
                  Resplandecer nació en 2018 en un taller de 200 m² en Sogamoso, Boyacá. Hoy somos 120
                  artesanos, tres fábricas y un estudio de interiorismo que trabaja como un
                  único equipo.
                </p>
                <p className="mt-5 text-[0.95rem] leading-relaxed text-ink/55">
                  No vendemos catálogo: fabricamos piezas para un espacio concreto. Cada
                  proyecto empieza con el levantamiento láser del lugar y termina con el
                  pulido de la última esquina.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="relative h-[52vh] w-full md:h-[78vh]">
          <SmartImage
            src={IMG.openPlan}
            alt="Salón-comedor de proyecto integral de Resplandecer con carpintería a medida"
            className="h-full w-full"
            parallax
            priority
          />
          <div className="shell pointer-events-none absolute inset-x-0 bottom-6 flex justify-between">
            <Pill dark>Proyecto Valle de Iraka — Sogamoso</Pill>
            <span className="mono hidden text-[0.6rem] text-white/70 md:block">
              Roble termotratado / piedra Calacatta
            </span>
          </div>
        </div>

        <div className="shell">
          <div className="grid grid-cols-2 border-t border-ink/12 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`border-ink/12 py-10 md:py-14 ${
                  i % 2 === 1 ? "border-l pl-6" : ""
                } ${i > 1 ? "max-md:border-t md:border-l md:pl-6" : ""}`}
              >
                <Reveal delay={i * 0.06}>
                  <p className="h-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.85]">
                    <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </p>
                  <p className="mono mt-4 text-[0.62rem] text-ink/50">{s.label}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECUENCIA DE FOTOGRAMAS ============ */}
      <section className="relative bg-ink" data-nav-theme="dark">
        <div className="shell flex flex-col justify-center py-20 md:py-28">
          <SectionHead index="03 / 08" label="Fabricación" dark className="mb-12" />
          <div className="grid grid-cols-12 gap-y-8 gap-x-8">
            <div className="col-span-12 lg:col-span-7">
              <SplitHeading className="h-xl text-white">
                Del escaneo al render final
              </SplitHeading>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <Reveal>
                <p className="text-[0.95rem] leading-relaxed text-white/55">
                  Desplázate para ver el antes y el después: el espacio en obra gris se
                  escanea, se acota con su malla y un barrido láser va revelando el proyecto
                  hasta el render final terminado.
                </p>
                <p className="mono mt-6 flex items-center gap-3 text-[0.6rem] text-ember">
                  <span className="h-px w-10 bg-ember" /> Scroll para cambiar de fase
                </p>
              </Reveal>
            </div>
          </div>
        </div>
        <FrameSequence />
      </section>

      {/* ============ RITMO DE TALLER ============ */}
      <ScrollCounter />

      {/* ============ SERVICIOS ============ */}
      <section className="grain relative overflow-hidden bg-ink text-white" data-nav-theme="dark">
        <div className="pointer-events-none absolute -right-40 top-1/4 h-[36vw] w-[36vw] rounded-full bg-electric/20 blur-[150px]" />
        <div className="shell relative z-10 py-20 md:py-32">
          <SectionHead index="05 / 08" label="Servicios" dark className="mb-12" />
          <div className="mb-16 grid grid-cols-12 gap-y-10 gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <SplitHeading className="h-xl max-w-[20ch] text-white">
                Todo lo que tu espacio necesita. Bajo un solo grupo.
              </SplitHeading>
            </div>
            <div className="col-span-12 flex items-end lg:col-span-3 lg:col-start-10">
              <Reveal>
                <p className="text-[0.95rem] leading-relaxed text-white/55">
                  Seis disciplinas, un contrato, un responsable. Pasa el cursor para ver el
                  taller en acción.
                </p>
                <a
                  href="#/servicios"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("servicios");
                  }}
                  data-cursor="button"
                  className="btn btn-ghost mt-7"
                >
                  <span>Todos los servicios</span>
                </a>
              </Reveal>
            </div>
          </div>

          <ServiceList onNavigate={onNavigate} />
        </div>

        <Marquee
          items={TICKER_SERVICES}
          className="border-y border-white/10 bg-ink py-6 text-white/70"
          variant="display"
          duration={40}
        />
      </section>

      {/* ============ PROCESO / OFICIO ============ */}
      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell py-20 md:py-32">
          <SectionHead index="06 / 08" label="Cómo trabajamos" className="mb-12" />
          <div className="grid grid-cols-12 gap-y-14 gap-x-8">
            <div className="col-span-12 lg:col-span-5">
              <SplitHeading className="h-lg">Cuatro fases, cero sorpresas</SplitHeading>
              <div className="mt-10 space-y-8">
                {PROCESS.map((p, i) => (
                  <Reveal key={p.n} delay={i * 0.05}>
                    <div className="flex gap-6 border-t border-ink/12 pt-6">
                      <span className="mono text-[0.65rem] text-ember">{p.n}</span>
                      <div>
                        <h3 className="font-heading text-[1.05rem] font-semibold uppercase tracking-[-0.01em]">
                          {p.title}
                        </h3>
                        <p className="mt-2 max-w-[44ch] text-[0.9rem] leading-relaxed text-ink/55">
                          {p.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <div className="grid grid-cols-2 gap-5">
                <Reveal className="col-span-1">
                  <SmartImage
                    src={IMG.workshopPolish}
                    alt="Artesano lijando una pieza de madera en el taller"
                    ratio="3/4"
                    parallax
                  />
                  <p className="mono mt-3 text-[0.6rem] text-ink/45">Taller Sogamoso — acabado</p>
                </Reveal>
                <Reveal delay={0.1} className="col-span-1 pt-10">
                  <SmartImage
                    src={IMG.workshopHand}
                    alt="Cepillo de mano trabajando la madera"
                    ratio="3/4"
                    parallax
                  />
                  <p className="mono mt-3 text-[0.6rem] text-ink/45">Oficio manual</p>
                </Reveal>
                <Reveal delay={0.05} className="col-span-2">
                  <SmartImage
                    src={IMG.kitchenDining}
                    alt="Cocina de autor instalada con carpintería a medida"
                    ratio="16/10"
                    parallax
                  />
                  <p className="mono mt-3 text-[0.6rem] text-ink/45">
                    Entrega en obra — cocina 8 semanas
                  </p>
                </Reveal>
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 border-t border-ink/12 pt-12 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <h3 className="font-heading text-[1.15rem] font-semibold uppercase tracking-[-0.01em]">
                  {v.title}
                </h3>
                <p className="mt-3 max-w-[38ch] text-[0.9rem] leading-relaxed text-ink/55">
                  {v.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-paper-2 text-ink" data-nav-theme="light">
        <div className="shell py-20 md:py-32">
          <SectionHead index="07 / 08" label="Preguntas frecuentes" className="mb-12" />
          <div className="grid grid-cols-12 gap-y-10 gap-x-8">
            <div className="col-span-12 lg:col-span-4">
              <SplitHeading className="h-lg">Lo que nos preguntan</SplitHeading>
              <Reveal>
                <p className="mt-6 max-w-[36ch] text-[0.95rem] leading-relaxed text-ink/55">
                  Y si no está aquí, escríbenos: contestamos en menos de 24 horas hábiles.
                </p>
                <a
                  href="#/faq"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("faq");
                  }}
                  data-cursor="button"
                  className="btn btn-light mt-7"
                >
                  <span>Ver FAQ completo</span>
                </a>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <FaqAccordion dark={false} limit={5} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ INSIGHTS ============ */}
      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell py-20 md:py-32">
          <SectionHead index="08 / 08" label="Insights" className="mb-12" />
          <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
            <SplitHeading className="h-lg max-w-[20ch]">
              Notas desde el taller
            </SplitHeading>
            <a
              href="#/insights"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("insights");
              }}
              data-cursor="button"
              className="btn btn-light"
            >
              <span>Todas las notas</span>
            </a>
          </div>
          <InsightsGrid dark={false} limit={6} />
        </div>
      </section>
    </div>
  );
}
