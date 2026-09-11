import { useEffect, useRef } from "react";
import PageHero from "@/components/PageHero";
import MaterialOrb from "@/components/MaterialOrb";
import FaqAccordion from "@/components/FaqAccordion";
import {
  Counter,
  Marquee,
  Reveal,
  SectionHead,
  SmartImage,
  SplitHeading,
} from "@/components/ui";
import { getLenis, gsap, initReveals, ScrollTrigger } from "@/lib/anim";
import { IMG, SERVICES, TICKER_SERVICES } from "@/data/content";
import type { Route } from "@/lib/router";

const CAPACITIES = [
  { v: 2500, s: "+", l: "Piezas al mes" },
  { v: 3, s: "", l: "Fábricas propias" },
  { v: 400, s: "+", l: "Tejidos certificados" },
  { v: 10, s: " años", l: "Garantía estructural" },
];

export default function Servicios({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => initReveals(root), root);
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      ctx.revert();
      clearTimeout(t);
    };
  }, []);

  return (
    <div ref={rootRef}>
      <PageHero
        index="01 — Servicios"
        label="Capacidad real de taller"
        title="Seis disciplinas, un solo grupo"
        lead="Carpintería a medida, cocinas, remodelaciones integrales, tapicería, interiorismo y producción contract. Todo con equipos internos y precio cerrado."
        image={IMG.workshopSaw}
        meta={["Talleres propios", "Precio cerrado", "Garantía 10 años"]}
      />

      {/* Índice */}
      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell py-16 md:py-20">
          <SectionHead index="02" label="Índice de servicios" className="mb-10" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <a
                  href={`#svc-${s.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(`svc-${s.slug}`);
                    if (!el) return;
                    const lenis = getLenis();
                    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 });
                    else el.scrollIntoView({ behavior: "smooth" });
                  }}
                  data-cursor="link"
                  className="group block border-t border-ink/15 pt-4"
                >
                  <span className="mono text-[0.6rem] text-ember">{s.index}</span>
                  <p className="mt-2 font-heading text-[0.95rem] font-semibold uppercase leading-tight tracking-[-0.01em] group-hover:text-ember">
                    {s.title}
                  </p>
                  <p className="mt-1 text-[0.75rem] leading-snug text-ink/45">{s.short}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Showroom interactivo — la pieza del hero, explorada en contexto */}
      <section
        className="grain relative overflow-hidden border-y border-white/10 bg-ink-2 text-white"
        data-nav-theme="dark"
      >
        <div className="pointer-events-none absolute -left-36 top-1/3 h-[34vw] w-[34vw] rounded-full bg-electric/15 blur-[150px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[26vw] w-[26vw] rounded-full bg-ember/10 blur-[140px]" />

        <div className="shell relative z-10 grid grid-cols-12 items-center gap-y-12 gap-x-8 py-20 md:py-28">
          <div className="col-span-12 lg:col-span-5">
            <SectionHead index="S" label="Showroom interactivo" dark className="mb-10" />
            <SplitHeading className="h-lg max-w-[16ch] text-white">
              Gira la pieza. Recorre su vida.
            </SplitHeading>
            <Reveal>
              <p className="mt-6 max-w-[44ch] text-[0.95rem] leading-relaxed text-white/55">
                Antes de encargarla, mírala como la vemos en el taller: de frente, de perfil
                y en cada uno de sus cuatro estados. Arrástrala con el mouse o salta de
                etapa con las píldoras.
              </p>
              <ul className="mt-8 border-t border-white/12">
                {[
                  ["Arrastrar", "rota e inclina la escultura con inercia, como una maqueta real"],
                  ["Elegir etapa", "del roble en pie al ambiente terminado, con sus cotas reales"],
                  ["Comparar", "las láminas se recomponen solas entre un estado y el siguiente"],
                ].map(([t, d]) => (
                  <li key={t} className="flex items-start gap-4 border-b border-white/12 py-4">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                    <p className="text-[0.88rem] leading-relaxed text-white/60">
                      <span className="mono mr-2 text-[0.62rem] uppercase tracking-[0.14em] text-white/85">
                        {t}
                      </span>
                      {d}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mono mt-6 flex items-center gap-3 text-[0.6rem] text-ember">
                <span className="h-px w-10 bg-ember" />
                Fabricada a mano en el taller de Sogamoso
              </p>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal y={24}>
              <div className="relative mx-auto aspect-square w-full max-w-[min(88vw,620px)]">
                <MaterialOrb className="h-full w-full" initialStage={2} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Detalle de cada servicio */}
      {SERVICES.map((s, i) => (
        <section
          key={s.slug}
          id={`svc-${s.slug}`}
          className={
            i % 2 === 0
              ? "bg-paper text-ink md:py-28 py-20"
              : "bg-paper-2 text-ink md:py-28 py-20"
          }
          data-nav-theme="light"
        >
          <div className="shell grid grid-cols-12 items-start gap-y-10 gap-x-8">
            <div className="col-span-12 lg:col-span-5">
              <SmartImage
                src={s.image}
                alt={s.title}
                ratio="4/3"
                className="rounded-sm"
                parallax
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="mono text-[0.6rem] text-ink/45">{s.category}</span>
                <span className="mono text-[0.6rem] text-ember">{s.index} / 06</span>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <SplitHeading className="h-lg">{s.title}</SplitHeading>
              <Reveal>
                <p className="mt-6 max-w-[54ch] body-lg text-ink/70">{s.description}</p>
                <ul className="mt-8 border-t border-ink/12">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-4 border-b border-ink/12 py-4 text-[0.9rem] text-ink/65"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href="#/contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("contacto");
                  }}
                  data-cursor="button"
                  className="btn btn-light mt-8"
                >
                  <span>Pedir presupuesto</span>
                </a>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* Capacidades */}
      <section className="grain relative overflow-hidden bg-ink text-white" data-nav-theme="dark">
        <div className="pointer-events-none absolute -right-32 top-10 h-[34vw] w-[34vw] rounded-full bg-electric/20 blur-[140px]" />
        <div className="shell relative z-10 py-20 md:py-28">
          <SectionHead index="09" label="Capacidad" dark className="mb-14" />
          <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
            {CAPACITIES.map((c, i) => (
              <Reveal key={c.l} delay={i * 0.06}>
                <p className="h-display text-[clamp(2.2rem,5.4vw,4.6rem)] leading-[0.85]">
                  <Counter value={c.v} suffix={c.s} />
                </p>
                <p className="mono mt-4 text-[0.62rem] text-white/45">{c.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Marquee
          items={TICKER_SERVICES}
          variant="display"
          duration={38}
          className="border-y border-white/10 py-7 text-white/80"
        />
      </section>

      {/* FAQ de servicios */}
      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell py-20 md:py-28">
          <SectionHead index="10" label="Dudas de servicios" className="mb-12" />
          <div className="grid grid-cols-12 gap-y-10 gap-x-8">
            <div className="col-span-12 lg:col-span-4">
              <SplitHeading className="h-lg">Antes de firmar</SplitHeading>
              <Reveal>
                <p className="mt-6 max-w-[34ch] text-[0.95rem] leading-relaxed text-ink/55">
                  Publicamos el proceso completo para que puedas comparar con otros talleres
                  en igualdad de condiciones.
                </p>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <FaqAccordion dark={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
