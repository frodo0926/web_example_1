import { useRef, useState } from "react";
import { FAQS } from "@/data/content";
import { cn } from "@/utils/cn";

export default function FaqAccordion({
  dark = true,
  limit,
  topicFilter,
}: {
  dark?: boolean;
  limit?: number;
  topicFilter?: string;
}) {
  const [open, setOpen] = useState<string | null>(FAQS[0].id);
  const listRef = useRef<HTMLDivElement>(null);

  const items = FAQS.filter((f) => (topicFilter ? f.topic === topicFilter : true)).slice(
    0,
    limit ?? FAQS.length,
  );

  const line = dark ? "border-white/12" : "border-ink/12";
  const soft = dark ? "text-white/45" : "text-ink/45";

  return (
    <div ref={listRef} className={cn("w-full border-t", line)}>
      {items.map((f, i) => {
        const isOpen = open === f.id;
        return (
          <div key={f.id} className={cn("border-b", line)}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${f.id}-panel`}
                id={`${f.id}-btn`}
                onClick={() => setOpen(isOpen ? null : f.id)}
                data-cursor="button"
                className="group flex w-full items-start gap-5 py-6 text-left md:gap-10 md:py-8"
              >
                <span className={cn("mono pt-1 text-[0.68rem]", soft)}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="flex-1">
                  <span
                    className={cn(
                      "block font-heading text-[clamp(1.05rem,2.1vw,1.85rem)] font-semibold leading-tight tracking-[-0.02em] transition-colors duration-500",
                      dark
                        ? isOpen
                          ? "text-white"
                          : "text-white/80 group-hover:text-white"
                        : isOpen
                          ? "text-ink"
                          : "text-ink/75 group-hover:text-ink",
                    )}
                  >
                    {f.question}
                  </span>

                  <span
                    className="acc-body mt-0"
                    data-open={isOpen}
                    id={`${f.id}-panel`}
                    role="region"
                    aria-labelledby={`${f.id}-btn`}
                  >
                    <span className="acc-inner block">
                      <span
                        className={cn(
                          "block max-w-[62ch] pt-5 text-[0.95rem] leading-relaxed",
                          dark ? "text-white/55" : "text-ink/60",
                        )}
                      >
                        {f.answer}
                      </span>
                      <span className={cn("mono mt-5 block text-[0.6rem]", soft)}>
                        {f.topic}
                      </span>
                    </span>
                  </span>
                </span>

                <span className="relative mt-2 flex h-6 w-6 shrink-0 items-center justify-center">
                  <span
                    className={cn(
                      "absolute h-px w-3.5 transition-colors duration-500",
                      dark ? "bg-white/60" : "bg-ink/50",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute h-3.5 w-px transition-all duration-500",
                      isOpen ? "scale-y-0 bg-ember" : dark ? "bg-white/60" : "bg-ink/50",
                    )}
                  />
                </span>
              </button>
            </h3>
          </div>
        );
      })}
    </div>
  );
}
