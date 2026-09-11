import { useEffect, useRef } from "react";
import PageHero from "@/components/PageHero";
import InsightsGrid from "@/components/InsightsGrid";
import { Reveal, SectionHead, SmartImage, SplitHeading, Pill } from "@/components/ui";
import { gsap, initReveals, ScrollTrigger } from "@/lib/anim";
import { ARTICLES, IMG } from "@/data/content";
import type { Route } from "@/lib/router";

export default function Insights({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];

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
        index="01 — Insights"
        label="Notas desde el taller"
        title="Lo que aprendemos trabajando la madera"
        lead="Publicamos material técnico, decisiones de proyecto y errores caros que preferimos que no se repitan. Sin notas de prensa."
        image={IMG.workshopHand}
        meta={[`${ARTICLES.length} artículos`, "Actualización mensual", "Sin humo"]}
      />

      {/* Destacado */}
      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell py-16 md:py-24">
          <SectionHead index="02" label="Artículo destacado" className="mb-10" />
          <a href="#/insights" data-cursor="link" className="group grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-7">
              <SmartImage
                src={featured.image}
                alt={featured.title}
                ratio="16/10"
                className="media--zoom rounded-sm"
              />
            </div>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-4">
              <div className="flex items-center gap-3">
                <Pill>{featured.category}</Pill>
                <span className="mono text-[0.6rem] text-ink/45">{featured.read}</span>
              </div>
              <h2 className="h-display mt-6 text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.02]">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink/60">
                {featured.excerpt}
              </p>
              <div className="mt-7 flex items-center gap-4">
                <span className="label text-ink/70 transition-colors group-hover:text-ember">
                  Leer artículo
                </span>
                <span className="h-px w-10 origin-left scale-x-100 bg-ink/30 transition-all duration-500 group-hover:scale-x-[2] group-hover:bg-ember" />
              </div>
              <p className="mono mt-8 text-[0.6rem] text-ink/40">{featured.date}</p>
            </div>
          </a>
        </div>
      </section>

      {/* Grid con filtros */}
      <section className="bg-paper-2 text-ink" data-nav-theme="light">
        <div className="shell py-16 md:py-24">
          <SectionHead index="03" label="Archivo" className="mb-10" />
          <SplitHeading className="h-lg mb-12 max-w-[20ch]">Archivo completo</SplitHeading>
          <InsightsGrid dark={false} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="grain relative overflow-hidden bg-ink text-white" data-nav-theme="dark">
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[30vw] w-[30vw] rounded-full bg-ember/12 blur-[140px]" />
        <div className="shell relative z-10 grid grid-cols-12 gap-y-10 gap-x-8 py-20 md:py-28">
          <div className="col-span-12 lg:col-span-6">
            <SplitHeading className="h-lg text-white">Una nota al mes. Nada más.</SplitHeading>
            <Reveal>
              <p className="mt-6 max-w-[44ch] text-[0.95rem] leading-relaxed text-white/55">
                Materiales, procesos y fotos reales de taller. Sin ofertas, sin spam y sin
                reenviar contenido de otros.
              </p>
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-4">
            <Reveal>
              <form
                className="flex flex-col gap-4 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.querySelector("input");
                  if (input) input.value = "";
                  form.dataset.state = "done";
                  const note = form.querySelector("[data-note]");
                  if (note) note.textContent = "Gracias. Te apuntamos a la próxima entrega.";
                }}
              >
                <label className="sr-only" htmlFor="nl-email">
                  Correo electrónico
                </label>
                <input
                  id="nl-email"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  className="mono w-full rounded-full border border-white/20 bg-transparent px-5 py-4 text-[0.72rem] text-white placeholder:text-white/35 focus:border-ember focus:outline-none"
                />
                <button type="submit" data-cursor="button" className="btn btn-fill shrink-0">
                  <span>Suscribirme</span>
                </button>
              </form>
              <p data-note className="mono mt-4 text-[0.6rem] text-ember">
                Un correo al mes. Bajas en un clic.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("contacto")}
                data-cursor="button"
                className="btn btn-ghost mt-8"
              >
                <span>Hablar con el estudio</span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
