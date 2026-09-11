import { useEffect, useRef } from "react";
import PageHero from "@/components/PageHero";
import {
  Counter,
  Marquee,
  Reveal,
  SectionHead,
  SmartImage,
  SplitHeading,
  Pill,
} from "@/components/ui";
import { gsap, initReveals, ScrollTrigger } from "@/lib/anim";
import { IMG, OFFICES, PROCESS, STATS, VALUES } from "@/data/content";

const TIMELINE = [
  {
    year: "2018",
    title: "200 m² y una sierra",
    text: "Abrimos el primer taller en Sogamoso, Boyacá, con cuatro ebanistas y una sola máquina CNC. Los primeros clientes fueron vecinos del valle de Iraka.",
  },
  {
    year: "2020",
    title: "Primeras cocinas",
    text: "Sumamos piedra natural y montaje propio. La cocina pasa a ser nuestro producto más demandado y creamos el equipo de instalaciones.",
  },
  {
    year: "2022",
    title: "Estudio de interiorismo",
    text: "Nace el estudio en Milán. Anteproyecto, materialidad y dirección de arte dejan de subcontratarse.",
  },
  {
    year: "2024",
    title: "Contract & América",
    text: "Fábrica en São Paulo y hub en Miami. Primer contrato hotelero de 420 habitaciones entregado en 90 días.",
  },
  {
    year: "2026",
    title: "120 artesanos",
    text: "Nueve países, tres fábricas y 2.500 piezas al mes. Segimos midiendo cada junta a mano antes de que salga del taller.",
  },
];

export default function Nosotros() {
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
        index="01 — Nosotros"
        label="El grupo"
        title="Un taller que creció sin perder las manos"
        lead="Somos carpinteros, ebanistas, tapiceros y diseñadores trabajando en el mismo edificio. Esa cercanía es nuestro método de control de calidad."
        image={IMG.workshopChisel}
        meta={["Desde 2018", "120 artesanos", "9 países"]}
      />

      {/* Manifiesto */}
      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell py-20 md:py-32">
          <SectionHead index="02" label="Manifiesto" className="mb-12" />
          <div className="grid grid-cols-12 gap-y-12 gap-x-8">
            <div className="col-span-12 lg:col-span-8">
              <SplitHeading className="h-xl max-w-[22ch]">
                Creemos en la madera, no en el atajo
              </SplitHeading>
            </div>
            <div className="col-span-12 lg:col-span-3 lg:col-start-10">
              <Reveal>
                <p className="text-[0.95rem] leading-relaxed text-ink/60">
                  Cada pieza que entrega Iraka pasa por cuatro manos como mínimo: la
                  que la corta, la que la ensambla, la que la lija y la que la revisa antes
                  de salir por la puerta del taller.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="border-t border-ink/12 pt-6">
                  <span className="mono text-[0.6rem] text-ember">0{i + 1}</span>
                  <h3 className="mt-3 font-heading text-[1.2rem] font-semibold uppercase tracking-[-0.01em]">
                    {v.title}
                  </h3>
                  <p className="mt-3 max-w-[38ch] text-[0.9rem] leading-relaxed text-ink/55">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen + cifras */}
      <section className="relative bg-paper-2 text-ink" data-nav-theme="light">
        <div className="relative h-[46vh] w-full md:h-[70vh]">
          <SmartImage
            src={IMG.stair}
            alt="Escalera de carpintería a medida fabricada por Iraka"
            className="h-full w-full"
            parallax
          />
          <div className="shell pointer-events-none absolute inset-x-0 bottom-6">
            <Pill dark>Escalera continua — nogal americano</Pill>
          </div>
        </div>

        <div className="shell py-16 md:py-24">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`border-ink/12 py-8 ${i % 2 === 1 ? "border-l pl-6" : ""} ${
                  i > 1 ? "max-md:border-t md:border-l md:pl-6" : ""
                }`}
              >
                <Reveal delay={i * 0.05}>
                  <p className="h-display text-[clamp(2rem,5vw,4.2rem)] leading-[0.85]">
                    <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </p>
                  <p className="mono mt-3 text-[0.6rem] text-ink/50">{s.label}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="grain relative overflow-hidden bg-ink text-white" data-nav-theme="dark">
        <div className="pointer-events-none absolute -left-40 top-1/3 h-[36vw] w-[36vw] rounded-full bg-electric/20 blur-[150px]" />
        <div className="shell relative z-10 py-20 md:py-32">
          <SectionHead index="04" label="Historia" dark className="mb-14" />
          <SplitHeading className="h-xl mb-16 max-w-[18ch] text-white">
            Ocho años de viruta
          </SplitHeading>

          <ol className="border-t border-white/12">
            {TIMELINE.map((t, i) => (
              <li
                key={t.year}
                data-reveal=""
                data-delay={i * 0.04}
                className="group grid grid-cols-12 items-start gap-x-6 gap-y-3 border-b border-white/12 py-8"
              >
                <span className="mono col-span-3 text-[0.72rem] text-ember lg:col-span-1">
                  {t.year}
                </span>
                <h3 className="col-span-9 font-heading text-[clamp(1.1rem,2.6vw,2rem)] font-semibold uppercase leading-tight tracking-[-0.02em] transition-transform duration-700 lg:col-span-3 lg:group-hover:translate-x-2">
                  {t.title}
                </h3>
                <p className="col-span-12 max-w-[60ch] text-[0.92rem] leading-relaxed text-white/55 lg:col-span-7 lg:col-start-5">
                  {t.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Proceso */}
      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell py-20 md:py-32">
          <SectionHead index="05" label="Proceso" className="mb-12" />
          <div className="grid grid-cols-12 gap-y-14 gap-x-8">
            <div className="col-span-12 lg:col-span-4">
              <SplitHeading className="h-lg">Cómo trabajamos</SplitHeading>
              <Reveal>
                <p className="mt-6 max-w-[34ch] text-[0.95rem] leading-relaxed text-ink/55">
                  El mismo esquema para una mesita o para un hotel entero. Solo cambia la
                  escala del equipo.
                </p>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {PROCESS.map((p, i) => (
                  <Reveal key={p.n} delay={i * 0.05}>
                    <div className="h-full border-t border-ink/12 pt-5">
                      <span className="mono text-[0.65rem] text-ember">{p.n}</span>
                      <h3 className="mt-2 font-heading text-[1.05rem] font-semibold uppercase tracking-[-0.01em]">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[0.88rem] leading-relaxed text-ink/55">
                        {p.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presencia */}
      <section className="bg-paper-2 text-ink" data-nav-theme="light">
        <div className="shell py-20 md:py-28">
          <SectionHead index="06" label="Presencia" className="mb-12" />
          <div className="grid grid-cols-12 gap-y-12 gap-x-8">
            <div className="col-span-12 lg:col-span-4">
              <SplitHeading className="h-lg">Nueve países, un estándar</SplitHeading>
              <Reveal>
                <p className="mt-6 max-w-[34ch] text-[0.95rem] leading-relaxed text-ink/55">
                  Fabricamos cerca del proyecto para reducir transporte y tiempos. El
                  estándar de calidad, en cambio, es idéntico en todas las fábricas.
                </p>
              </Reveal>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
                {OFFICES.map((o) => (
                  <div key={o.city} data-reveal="" className="border-t border-ink/12 pt-4">
                    <p className="flex items-center gap-2 font-heading text-[1rem] font-semibold uppercase leading-tight tracking-[-0.01em]">
                      {o.city}
                      {o.highlight && (
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff2d2d] shadow-[0_0_10px_2px_#ff2d2d66]"
                          aria-label="Ubicación destacada"
                          title="Ubicación destacada"
                        />
                      )}
                    </p>
                    <p className="mono mt-1 text-[0.58rem] text-ink/40">{o.country}</p>
                    <p className="mt-2 text-[0.75rem] leading-snug text-ink/55">{o.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Marquee
          items={OFFICES.map((o) => `${o.city} — ${o.country}`)}
          className="border-t border-ink/12 py-4 text-ink/45"
          duration={46}
        />
      </section>
    </div>
  );
}
