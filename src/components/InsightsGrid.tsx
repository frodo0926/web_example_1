import { useMemo, useState } from "react";
import { ARTICLES } from "@/data/content";
import { SmartImage, Pill } from "@/components/ui";
import { cn } from "@/utils/cn";

export default function InsightsGrid({
  dark = true,
  limit,
  showFilters = true,
}: {
  dark?: boolean;
  limit?: number;
  showFilters?: boolean;
}) {
  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(ARTICLES.map((a) => a.category)))],
    [],
  );
  const [active, setActive] = useState("Todos");

  const filtered = useMemo(() => {
    const list =
      active === "Todos" ? ARTICLES : ARTICLES.filter((a) => a.category === active);
    return limit ? list.slice(0, limit) : list;
  }, [active, limit]);

  return (
    <div>
      {showFilters && (
        <div
          className="mb-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtrar artículos por categoría"
        >
          {categories.map((c) => {
            const on = active === c;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(c)}
                data-cursor="button"
                className={cn(
                  "rounded-full border px-4 py-2 label transition-all duration-500",
                  on
                    ? "border-ember bg-ember text-white"
                    : dark
                      ? "border-white/15 text-white/55 hover:border-white/40 hover:text-white"
                      : "border-ink/15 text-ink/55 hover:border-ink/40 hover:text-ink",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a, i) => (
          <article
            key={a.slug}
            data-reveal=""
            data-delay={i * 0.04}
            className={cn(
              "group relative",
              i % 3 === 0 && !limit && "lg:col-span-1",
            )}
          >
            <a href="#/insights" data-cursor="link" className="block">
              <SmartImage
                src={a.image}
                alt={a.title}
                ratio="4/3"
                className={cn(
                  "media--zoom mb-5 rounded-sm",
                  dark ? "bg-white/5" : "bg-ink/5",
                )}
              />
              <div className="mb-3 flex items-center gap-3">
                <span className="mono text-[0.6rem] text-ember">{a.category}</span>
                <span
                  className={cn("h-px flex-1", dark ? "bg-white/12" : "bg-ink/12")}
                />
                <span className={cn("mono text-[0.6rem]", dark ? "text-white/40" : "text-ink/40")}>
                  {a.date}
                </span>
              </div>
              <h3
                className={cn(
                  "font-heading text-[1.15rem] font-semibold leading-[1.15] tracking-[-0.02em] transition-colors duration-500 md:text-[1.35rem]",
                  dark
                    ? "text-white group-hover:text-white/80"
                    : "text-ink group-hover:text-ink/70",
                )}
              >
                {a.title}
              </h3>
              <p
                className={cn(
                  "mt-3 max-w-[46ch] text-[0.9rem] leading-relaxed",
                  dark ? "text-white/50" : "text-ink/55",
                )}
              >
                {a.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-4">
                <span
                  className={cn(
                    "label transition-colors",
                    dark ? "text-white/60 group-hover:text-ember" : "text-ink/60 group-hover:text-ember",
                  )}
                >
                  Leer — {a.read}
                </span>
                <span className="h-px w-8 origin-left scale-x-0 bg-ember transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </a>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={cn("py-16 text-center text-sm", dark ? "text-white/40" : "text-ink/40")}>
          <Pill dark={dark}>Sin artículos en esta categoría todavía</Pill>
        </p>
      )}
    </div>
  );
}
