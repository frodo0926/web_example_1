import { useEffect, useRef } from "react";
import PageHero from "@/components/PageHero";
import FaqAccordion from "@/components/FaqAccordion";
import { Reveal, SectionHead, SplitHeading, Marquee } from "@/components/ui";
import { gsap, initReveals, ScrollTrigger } from "@/lib/anim";
import { FAQS, IMG } from "@/data/content";
import type { Route } from "@/lib/router";

const TOPICS = Array.from(new Set(FAQS.map((f) => f.topic)));

export default function Faq({ onNavigate }: { onNavigate: (r: Route) => void }) {
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
        index="01 — FAQ"
        label="Preguntas frecuentes"
        title="Todo lo que conviene saber antes de encargar"
        lead="Ocho respuestas directas sobre fabricación, plazos, garantías y forma de trabajar. Actualizamos esta página cada trimestre."
        image={IMG.bandsaw}
        meta={[`${FAQS.length} respuestas`, "Actualizado Q1 2026"]}
      />

      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell grid grid-cols-12 gap-y-14 gap-x-8 py-20 md:py-28">
          <div className="col-span-12 lg:col-span-4">
            <SectionHead index="02" label="Temas" className="mb-10" />
            <SplitHeading className="h-lg">Índice</SplitHeading>
            <ul className="mt-10 space-y-3">
              {TOPICS.map((t, i) => (
                <li key={t} data-reveal="" data-delay={i * 0.04}>
                  <span className="flex items-baseline gap-4 border-b border-ink/12 pb-3">
                    <span className="mono text-[0.6rem] text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.95rem] text-ink/70">{t}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Reveal className="mt-12 bg-ink p-7 text-white">
              <p className="label mb-3 text-ember">¿No encuentras la respuesta?</p>
              <p className="text-[0.9rem] leading-relaxed text-white/60">
                Escríbenos y te contesta alguien del taller, no un formulario automático.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("contacto")}
                data-cursor="button"
                className="btn btn-fill mt-6"
              >
                <span>Hablar con el estudio</span>
              </button>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <SectionHead index="03" label="Respuestas" className="mb-8" />
            <FaqAccordion dark={false} />
          </div>
        </div>
      </section>

      <Marquee
        items={["Carpintería a medida", "Cocinas", "Remodelaciones", "Sofás", "Interiorismo", "Contract"]}
        variant="display"
        duration={36}
        className="border-y border-ink/12 bg-paper-2 py-7 text-ink/80"
      />
    </div>
  );
}
