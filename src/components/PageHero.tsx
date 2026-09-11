import type { ReactNode } from "react";
import { Reveal, SplitHeading, SmartImage, Pill } from "@/components/ui";

export default function PageHero({
  index,
  label,
  title,
  lead,
  image,
  meta,
  children,
}: {
  index: string;
  label: string;
  title: string;
  lead?: string;
  image?: string;
  meta?: string[];
  children?: ReactNode;
}) {
  return (
    <section
      className="grain relative flex min-h-[78vh] flex-col justify-end overflow-hidden bg-ink pt-[calc(var(--nav-h)+4vh)] text-white"
      data-nav-theme="dark"
    >
      {image && (
        <div className="absolute inset-0">
          <SmartImage src={image} alt="" className="h-full w-full" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/55" />
        </div>
      )}
      <div className="pointer-events-none absolute -left-[15%] top-[10%] h-[42vw] w-[42vw] rounded-full bg-electric/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-[30vw] w-[30vw] rounded-full bg-ember/10 blur-[150px]" />

      <div className="shell relative z-10 pb-14">
        <div className="mb-10 flex items-center justify-between gap-4">
          <span className="label flex items-center gap-3 text-white/55">
            <span className="dot" />
            {label}
          </span>
          <span className="mono text-[0.65rem] text-white/35">{index}</span>
        </div>

        <SplitHeading className="h-xl max-w-[16ch]" as="h1">
          {title}
        </SplitHeading>

        {lead && (
          <Reveal className="mt-8 max-w-[52ch]">
            <p className="body-lg text-white/60">{lead}</p>
          </Reveal>
        )}

        {meta && (
          <div className="mt-10 flex flex-wrap gap-2">
            {meta.map((m) => (
              <Pill dark key={m}>
                {m}
              </Pill>
            ))}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
