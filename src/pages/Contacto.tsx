import { useEffect, useRef, useState } from "react";
import PageHero from "@/components/PageHero";
import { Reveal, SectionHead, SplitHeading, Pill } from "@/components/ui";
import { gsap, initReveals, ScrollTrigger } from "@/lib/anim";
import { HQ, IMG, OFFICES, SERVICES } from "@/data/content";

const BUDGETS = ["< 30 M COP", "30 – 100 M COP", "100 – 300 M COP", "> 300 M COP"];
const AREAS = ["Carpintería / producción", "Diseño / interiorismo", "Instalación / obra", "Administración / otro"];
const WORK_TYPES = ["Proyecto residencial", "Proyecto comercial", "Alianza / proveedor", "Prensa y medios"];

export const WA_LINK = `https://wa.me/573222523331?text=${encodeURIComponent(
  "Hola Iraka, quiero información sobre sus proyectos.",
)}`;

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function Contacto({ modo = "proyecto" }: { modo?: "proyecto" | "trabajo" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const isWork = modo === "trabajo";
  const typeOptions = isWork ? WORK_TYPES : SERVICES.map((s) => s.title);
  const [project, setProject] = useState<string>(typeOptions[0]);
  const [budget, setBudget] = useState<string>(BUDGETS[1]);

  useEffect(() => {
    setSent(false);
    setProject(typeOptions[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo]);

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
        index={isWork ? "01 — Trabaja con nosotros" : "01 — Contacto"}
        label={isWork ? "Colaboremos" : "Hablemos del espacio"}
        title={
          isWork
            ? "Hagamos algo juntos"
            : "Cuéntanos qué quieres habitar"
        }
        lead={
          isWork
            ? "Proveedores, aliados, prensa o talento: si tu trabajo tiene que ver con madera, piedra o buen diseño, queremos conocerte."
            : "Una llamada de 30 minutos basta para saber si somos el taller adecuado para tu proyecto. Si no lo somos, te diremos quién sí."
        }
        image={isWork ? IMG.workshopPolish : IMG.samplesWide}
        meta={
          isWork
            ? ["Respuesta < 48 h", "Compras locales", "Puertas abiertas"]
            : ["Respuesta < 24 h", "Anteproyecto en 15 días", "Sin costo inicial"]
        }
      />

      <section className="bg-paper text-ink" data-nav-theme="light">
        <div className="shell grid grid-cols-12 gap-y-16 gap-x-8 py-20 md:py-28">
          {/* Formulario */}
          <div className="col-span-12 lg:col-span-7">
            <SectionHead index="02" label={isWork ? "Propuesta" : "Formulario"} className="mb-10" />

            {sent ? (
              <div className="border-t border-ink/12 pt-12" role="status" aria-live="polite">
                <span className="dot mb-8 block" />
                <h2 className="h-display h-lg max-w-[18ch]">Recibido, gracias</h2>
                <p className="mt-6 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink/60">
                  {isWork
                    ? "Tu propuesta ya está en manos del equipo. Te responderemos en menos de 48 horas con los siguientes pasos o una cita en el taller."
                    : "Hemos registrado tu solicitud. Alguien del estudio te escribirá en menos de 24 horas hábiles con una primera valoración y, si encaja, con dos horarios para llamada."}
                </p>
                <p className="mono mt-8 text-[0.6rem] text-ink/45">
                  Referencia — RSP-{new Date().getFullYear()}-
                  {String(Math.floor(Math.random() * 900) + 100)}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    data-cursor="button"
                    className="btn btn-light"
                  >
                    <span>Enviar otra solicitud</span>
                  </button>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="button"
                    className="btn btn-dark"
                  >
                    <span className="flex items-center gap-2">
                      <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                      Continuar por WhatsApp
                    </span>
                  </a>
                </div>
              </div>
            ) : (
              <>
              <form
                className="border-t border-ink/12"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-x-8 gap-y-8 pt-10 sm:grid-cols-2">
                  <Field label="Nombre y apellidos" name="nombre" required />
                  <Field label="Correo electrónico" name="email" type="email" required />
                  <Field label={isWork ? "WhatsApp / teléfono" : "Teléfono"} name="telefono" type="tel" />
                  <Field label={isWork ? "Ciudad" : "Ciudad del proyecto"} name="ciudad" required />
                </div>

                <fieldset className="mt-10">
                  <legend className="label mb-4 text-ink/50">
                    {isWork ? "Tipo de colaboración" : "Tipo de proyecto"}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {typeOptions.map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={project === t}
                        onClick={() => setProject(t)}
                        data-cursor="button"
                        className={`rounded-full border px-4 py-2 label transition-all duration-500 ${
                          project === t
                            ? "border-ember bg-ember text-white"
                            : "border-ink/15 text-ink/55 hover:border-ink/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-10">
                  <legend className="label mb-4 text-ink/50">
                    {isWork ? "Área de interés" : "Presupuesto estimado"}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {(isWork ? AREAS : BUDGETS).map((b) => (
                      <button
                        key={b}
                        type="button"
                        aria-pressed={budget === b}
                        onClick={() => setBudget(b)}
                        data-cursor="button"
                        className={`rounded-full border px-4 py-2 label transition-all duration-500 ${
                          budget === b
                            ? "border-electric bg-electric text-white"
                            : "border-ink/15 text-ink/55 hover:border-ink/40"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-10">
                  <label htmlFor="mensaje" className="label mb-4 block text-ink/50">
                    {isWork ? "Cuéntanos sobre tu trabajo" : "Cuéntanos el proyecto"}
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={5}
                    required
                    placeholder={
                      isWork
                        ? "A qué te dedicas, enlaces a tu portafolio o catálogo, cómo te gustaría colaborar…"
                        : "Superficie, plazos, estado del espacio, referencias…"
                    }
                    className="w-full resize-none border-b border-ink/20 bg-transparent pb-4 text-[0.95rem] leading-relaxed text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
                  />
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <button type="submit" data-cursor="button" className="btn btn-dark">
                    <span>{isWork ? "Enviar propuesta" : "Enviar solicitud"}</span>
                  </button>
                  <p className="mono max-w-[30ch] text-[0.58rem] leading-relaxed text-ink/40">
                    Al enviar aceptas nuestra política de privacidad. Nunca compartimos tus
                    datos con terceros.
                  </p>
                </div>
              </form>

              {/* Fuera del formulario: mismo patrón de enlace que el footer */}
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener"
                data-cursor="button"
                className="btn btn-light mt-6"
              >
                  <span className="flex items-center gap-2">
                    <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                    o escríbenos por WhatsApp
                  </span>
                </a>
              </>
            )}
          </div>

          {/* Datos de contacto */}
          <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
            <SectionHead index="03" label="Estudio" className="mb-10" />

            <Reveal className="border-t border-ink/12 pt-6">
              <p className="label flex items-center gap-2 text-ink/45">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d2d] shadow-[0_0_8px_2px_#ff2d2d66]" />
                Sede central — {HQ.city}, {HQ.region}
              </p>
              <address className="mt-3 not-italic text-[0.95rem] leading-relaxed text-ink/70">
                {HQ.street}
                <br />
                {HQ.city} {HQ.postal}, {HQ.region}
                <br />
                {HQ.country}
              </address>
            </Reveal>

            <Reveal delay={0.05} className="mt-8 border-t border-ink/12 pt-6">
              <p className="label text-ink/45">Contacto directo</p>
              <div className="mt-3 space-y-2">
                <a
                  href={`mailto:${HQ.email}`}
                  data-cursor="link"
                  className="link-underline block text-[0.95rem] text-ink/70"
                >
                  {HQ.email}
                </a>
                <a
                  href={HQ.phoneHref}
                  data-cursor="link"
                  className="link-underline block text-[0.95rem] text-ink/70"
                >
                  {HQ.phone}
                </a>
              </div>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="button"
                className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-5 py-3 text-[0.78rem] font-medium text-white transition-all duration-500 hover:bg-[#1ebe5b] hover:shadow-[0_8px_24px_-8px_#25d366aa]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chatear por WhatsApp
              </a>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 border-t border-ink/12 pt-6">
              <p className="label text-ink/45">Horario de taller</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
                {HQ.hours}
                <br />
                Showroom con cita previa
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="dot" />
                <span className="mono text-[0.6rem] text-ink/50">Taller abierto ahora</span>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-8 border-t border-ink/12 pt-6">
              <p className="label text-ink/45">Dónde trabajamos</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {OFFICES.map((o) => (
                  <Pill key={o.city}>{o.city}</Pill>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 bg-ink p-7 text-white">
              <SplitHeading className="text-[clamp(1.4rem,2.6vw,2rem)]" as="h3">
                {isWork ? "¿Prefieres una visita?" : "¿Prefieres ver el taller?"}
              </SplitHeading>
              <p className="mt-4 text-[0.88rem] leading-relaxed text-white/55">
                {isWork
                  ? "Recibimos proveedores y aliados en el taller de Sogamoso con previa cita. Trae tus muestras: la mejor conversación pasa con la madera en la mesa."
                  : "Organizamos visitas guiadas de 45 minutos en el taller de Sogamoso y en el showroom de Bogotá. Ver cómo se fabrica una pieza explica mejor que cualquier catálogo."}
              </p>
              <a href={WA_LINK} target="_blank" rel="noreferrer noopener" data-cursor="button" className="btn btn-fill mt-6">
                <span>Agendar por WhatsApp</span>
              </a>
            </Reveal>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="label mb-3 block text-ink/50">
        {label}
        {required && <span className="text-ember"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-ink/20 bg-transparent pb-3 text-[0.95rem] text-ink placeholder:text-ink/30 focus:border-ember focus:outline-none"
        placeholder={type === "email" ? "tu@correo.com" : ""}
      />
    </div>
  );
}
