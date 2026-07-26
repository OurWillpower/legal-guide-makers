import { useMemo, type CSSProperties } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";
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

export function HeroServicesSlider({ slides, className }: HeroServicesSliderProps) {
  // Duplicate the track so the marquee can loop seamlessly.
  const loop = useMemo(() => [...slides, ...slides], [slides]);
  // 5 seconds per slide — total duration scales with slide count.
  const durationSec = Math.max(slides.length, 1) * 5;

  return (
    <div
      className={cn("relative focus:outline-none", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our legal services"
    >
      <div
        className="group/marquee overflow-hidden rounded-2xl [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        aria-live="off"
      >
        <div
          className="flex w-max gap-3 sm:gap-4 animate-hero-marquee group-hover/marquee:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ "--hero-marquee-duration": `${durationSec}s` } as CSSProperties}
        >
          {loop.map((slide, idx) => (
            <div
              key={`${slide.id}-${idx}`}
              aria-hidden={idx >= slides.length ? true : undefined}
              className="group flex h-full w-[85vw] shrink-0 flex-col rounded-2xl border border-gold/30 bg-navy/50 p-5 backdrop-blur-sm transition-colors hover:bg-navy/80 sm:w-[340px] lg:w-[300px]"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/40 bg-navy text-gold transition-transform group-hover:scale-110">
                <slide.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-cream">{slide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/65 line-clamp-3">
                {slide.desc}
              </p>
              <button
                type="button"
                onClick={() => scrollToService(slide.id)}
                tabIndex={idx >= slides.length ? -1 : 0}
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
    </div>
  );
}
