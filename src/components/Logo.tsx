import { cn } from "@/utils/cn";

/**
 * Marca IRAKA — dos arcos concéntricos (anillos de crecimiento del roble /
 * sol naciente sobre el valle de Iraka) con un núcleo ember: el origen de
 * toda pieza. El color hereda de `currentColor`, el punto siempre ember.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path
        d="M4.5 23.5a11.5 11.5 0 0 1 23 0"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M9.4 23.5a6.6 6.6 0 0 1 13.2 0"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="16" cy="23.5" r="2.7" fill="#ff5500" />
    </svg>
  );
}

export function Logo({
  className,
  wordClass,
}: {
  className?: string;
  wordClass?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-[22px] w-[22px] shrink-0" />
      <span
        className={cn(
          "h-display text-[1.08rem] leading-none tracking-[0.06em] text-current",
          wordClass,
        )}
      >
        IRAKA
      </span>
    </span>
  );
}
