import { HQ, OFFICES, SERVICES, TICKER_SERVICES } from "@/data/content";
import { WA_LINK, WhatsAppIcon } from "@/pages/Contacto";
import ParticleWordmark from "@/components/ParticleWordmark";
import { Marquee, Reveal } from "@/components/ui";
import type { Route } from "@/lib/router";

export default function Footer({ onNavigate }: { onNavigate: (r: Route) => void }) {
  const go = (r: Route) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(r);
  };

  return (
    <footer className="grain relative overflow-hidden bg-ink text-white" data-nav-theme="dark">
      <div className="pointer-events-none absolute -left-40 top-0 h-[38vw] w-[38vw] rounded-full bg-electric/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[26vw] w-[26vw] rounded-full bg-ember/10 blur-[140px]" />

      <Marquee
        items={TICKER_SERVICES}
        variant="display"
        duration={44}
        className="border-y border-white/10 py-8 text-white/85"
      />

      {/* IRAKA en matriz de puntos con cursor de sierra */}
      <div className="relative z-10">
        <ParticleWordmark />
      </div>

      <div className="shell relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-y-14 gap-x-8">
          <div className="col-span-12 lg:col-span-5">
            <Reveal>
              <h2 className="h-display h-lg max-w-[16ch]">
                Hagamos algo que dure décadas
              </h2>
              <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-white/50">
                Cuéntanos el espacio, el plazo y el presupuesto. Respondemos en menos de 24
                horas hábiles con una primera valoración honesta.
              </p>
              <a
                href="#/contacto"
                onClick={go("contacto")}
                data-cursor="button"
                className="btn btn-ghost mt-8"
              >
                <span>Iniciar proyecto</span>
              </a>
            </Reveal>
          </div>

          <div className="col-span-6 md:col-span-4 lg:col-span-3">
            <p className="label mb-5 text-white/35">Servicios</p>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <a
                    href="#/servicios"
                    onClick={go("servicios")}
                    data-cursor="link"
                    className="link-underline text-sm text-white/65 hover:text-white"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-4 lg:col-span-2">
            <p className="label mb-5 text-white/35">Grupo</p>
            <ul className="space-y-3">
              {[
                ["Nosotros", "nosotros"],
                ["Insights", "insights"],
                ["FAQ", "faq"],
                ["Contacto", "contacto"],
              ].map(([label, r]) => (
                <li key={r}>
                  <a
                    href={`#/${r}`}
                    onClick={go(r as Route)}
                    data-cursor="link"
                    className="link-underline text-sm text-white/65 hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://www.linkedin.com/company/iraka-taller"
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="link"
                  className="link-underline text-sm text-white/65 hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-4 lg:col-span-2">
            <p className="label mb-5 flex items-center gap-2 text-white/35">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d2d] shadow-[0_0_8px_2px_#ff2d2d66]" />
              Sede — {HQ.city}
            </p>
            <address className="not-italic text-sm leading-relaxed text-white/65">
              {HQ.street}
              <br />
              {HQ.city}, {HQ.region}
              <br />
              {HQ.country}
              <br />
              <a href={`mailto:${HQ.email}`} className="link-underline mt-3 inline-block text-white">
                {HQ.email}
              </a>
              <br />
              <a href={HQ.phoneHref} className="link-underline mt-1 inline-block">
                {HQ.phone}
              </a>
              <br />
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-2 text-[#25D366] transition-colors hover:text-[#1ebe5b]"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span className="link-underline">Escríbenos por WhatsApp</span>
              </a>
            </address>
          </div>
        </div>

        {/* Oficinas */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-3 lg:grid-cols-5">
          {OFFICES.map((o) => (
            <div key={o.city} className="group">
              <p className="flex items-center gap-2 font-heading text-[0.95rem] font-semibold uppercase tracking-[-0.01em] text-white">
                {o.city}
                {o.highlight && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff2d2d] shadow-[0_0_10px_2px_#ff2d2d66]"
                    aria-label="Ubicación destacada"
                    title="Ubicación destacada"
                  />
                )}
              </p>
              <p className="mono mt-1 text-[0.6rem] text-white/35">{o.country}</p>
              <p className="mt-2 text-[0.75rem] leading-snug text-white/45">{o.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="shell relative z-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 py-7 md:flex-row md:items-center">
        <p className="mono text-[0.6rem] text-white/35">
          © MMXXVI Iraka — Carpintería de autor · Valle de Iraka, Boyacá
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a href="#/faq" onClick={go("faq")} className="mono text-[0.6rem] text-white/35 hover:text-white">
            Privacidad
          </a>
          <a href="#/faq" onClick={go("faq")} className="mono text-[0.6rem] text-white/35 hover:text-white">
            Cookies
          </a>
          <a href="#/faq" onClick={go("faq")} className="mono text-[0.6rem] text-white/35 hover:text-white">
            Aviso legal
          </a>
          <span className="mono flex items-center gap-2 text-[0.6rem] text-white/35">
            <span className="dot" /> Taller abierto
          </span>
        </div>
      </div>
    </footer>
  );
}
