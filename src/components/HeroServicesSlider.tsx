import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowRight, Pause, Play, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceSlide {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface HeroServicesSliderProps {
  slides: ServiceSlide[];
  className?: string;
}

function scrollToService(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(`service-${id}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.setAttribute("tabindex", "-1");
  (el as HTMLElement).focus({ preventScroll: true });
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

const SPEED_OPTIONS = [
  { label: "Slow", secPerCard: 8 },
  { label: "Normal", secPerCard: 5 },
  { label: "Fast", secPerCard: 3 },
] as const;

export function HeroServicesSlider({ slides, className }: HeroServicesSliderProps) {
  const loop = useMemo(() => [...slides, ...slides], [slides]);
  const prefersReduced = usePrefersReducedMotion();
  const [reducedOverride, setReducedOverride] = useState(false);
  const reducedMotion = prefersReduced && !reducedOverride;
  const [speedIdx, setSpeedIdx] = useState(1); // Normal = 5s/card
  const [paused, setPaused] = useState(false);

  const durationSec = Math.max(slides.length, 1) * SPEED_OPTIONS[speedIdx].secPerCard;

  const renderCard = (slide: ServiceSlide, idx: number, isClone: boolean) => (
    <div
      key={`${slide.id}-${idx}-${isClone ? "c" : "o"}`}
      aria-hidden={isClone ? true : undefined}
      className="group flex h-full w-[78vw] max-w-[320px] shrink-0 flex-col rounded-2xl border border-gold/30 bg-navy/50 p-5 backdrop-blur-sm transition-colors hover:bg-navy/80 sm:w-[300px] lg:w-[300px]"
    >
      <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/40 bg-navy text-gold transition-transform group-hover:scale-110">
        <slide.icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-serif text-lg font-semibold text-cream">{slide.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cream/65 line-clamp-3">{slide.desc}</p>
      <button
        type="button"
        onClick={() => scrollToService(slide.id)}
        tabIndex={isClone ? -1 : 0}
        aria-label={`Learn more about ${slide.title}`}
        className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Learn more
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  return (
    <div
      className={cn("relative focus:outline-none", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our legal services"
    >
      {reducedMotion ? (
        <div className="space-y-4">
          <div
            role="note"
            className="flex flex-col gap-2 rounded-2xl border border-gold/30 bg-navy/40 p-4 text-sm text-cream/80 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-semibold text-cream">Motion reduced</div>
              <p className="mt-0.5 text-xs text-cream/70">
                Animation is off because your system prefers reduced motion. All {slides.length} services are shown as a static grid below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReducedOverride(true)}
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:self-auto"
            >
              <Play className="h-3.5 w-3.5" />
              Enable animation
            </button>
          </div>
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Legal services (static grid, reduced motion)"
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="group flex h-full w-full flex-col rounded-2xl border border-gold/30 bg-navy/50 p-5 backdrop-blur-sm transition-colors hover:bg-navy/80"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/40 bg-navy text-gold">
                  <slide.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-cream">{slide.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65 line-clamp-3">{slide.desc}</p>
                <button
                  type="button"
                  onClick={() => scrollToService(slide.id)}
                  aria-label={`Learn more about ${slide.title}`}
                  className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            className="group/marquee overflow-hidden rounded-2xl [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
            aria-live="off"
          >
            <div
              className={cn(
                "flex w-max gap-3 sm:gap-4 animate-hero-marquee group-hover/marquee:[animation-play-state:paused] focus-within:[animation-play-state:paused]",
                paused && "[animation-play-state:paused]"
              )}
              style={{ "--hero-marquee-duration": `${durationSec}s` } as CSSProperties}
            >
              {loop.map((slide, idx) => renderCard(slide, idx, idx >= slides.length))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-cream/70">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? "Resume scrolling" : "Pause scrolling"}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1.5 font-semibold uppercase tracking-wider text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? "Play" : "Pause"}
            </button>

            <div
              role="radiogroup"
              aria-label="Marquee speed"
              className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-navy/40 p-1"
            >
              {SPEED_OPTIONS.map((opt, i) => {
                const active = i === speedIdx;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`${opt.label} speed (${opt.secPerCard} seconds per card)`}
                    onClick={() => setSpeedIdx(i)}
                    className={cn(
                      "rounded-full px-3 py-1 font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                      active ? "bg-gold text-navy" : "text-cream/70 hover:text-gold"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <span className="text-cream/50" aria-hidden="true">
              {SPEED_OPTIONS[speedIdx].secPerCard}s / card
            </span>
          </div>
        </>
      )}
    </div>
  );
}
