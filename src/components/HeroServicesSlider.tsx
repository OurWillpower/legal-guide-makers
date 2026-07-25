import { useState, useEffect, useCallback, useMemo, useRef, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, type LucideIcon } from "lucide-react";
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

function getItemsPerView(width: number) {
  if (width >= 1024) return 4;
  if (width >= 768) return 2;
  return 1;
}

function chunkSlides<T>(slides: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < slides.length; i += size) {
    chunks.push(slides.slice(i, i + size));
  }
  return chunks;
}

function scrollToService(id: string) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(`service-${id}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // brief focus highlight for accessibility
  el.setAttribute("tabindex", "-1");
  (el as HTMLElement).focus({ preventScroll: true });
}

export function HeroServicesSlider({ slides, className }: HeroServicesSliderProps) {
  const [mounted, setMounted] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setItemsPerView(getItemsPerView(window.innerWidth));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = useMemo(() => chunkSlides(slides, itemsPerView), [slides, itemsPerView]);
  const totalPages = pages.length;

  const next = useCallback(() => {
    setPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prev = useCallback(() => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages - 1 || 0));
  }, [totalPages]);

  useEffect(() => {
    if (!mounted || totalPages === 0 || paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [mounted, next, totalPages, paused]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        setPage(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setPage(totalPages - 1);
      }
    },
    [next, prev, totalPages],
  );

  if (!mounted || totalPages === 0) {
    return (
      <div className={cn("grid gap-4 md:grid-cols-4", className)}>
        {slides.slice(0, 4).map((slide) => (
          <div
            key={slide.title}
            className="rounded-2xl border border-gold/30 bg-navy/50 p-5 backdrop-blur-sm"
          >
            <slide.icon className="h-6 w-6 text-gold" />
            <h3 className="mt-3 font-serif text-base font-semibold text-cream">{slide.title}</h3>
            <p className="mt-1 text-sm text-cream/60 line-clamp-2">{slide.desc}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={regionRef}
      className={cn("relative focus:outline-none", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our legal services"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-2xl" aria-live="polite">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((pageSlides, pageIdx) => (
            <div
              key={pageIdx}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${pageIdx + 1} of ${totalPages}`}
              aria-hidden={pageIdx !== page}
              className="w-full shrink-0 px-1 sm:px-2"
            >
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
                {pageSlides.map((slide) => (
                  <div
                    key={slide.title}
                    className="group flex h-full flex-col rounded-2xl border border-gold/30 bg-navy/50 p-5 backdrop-blur-sm transition-colors hover:bg-navy/80"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-lg border border-gold/40 bg-navy text-gold transition-transform group-hover:scale-110">
                      <slide.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-semibold text-cream">
                      {slide.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/65 line-clamp-3">
                      {slide.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => scrollToService(slide.id)}
                      tabIndex={pageIdx === page ? 0 : -1}
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
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous services slide"
          aria-controls="hero-services-carousel"
          className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-navy/50 text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Services slide navigation">
          {pages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              onClick={() => setPage(idx)}
              aria-label={`Go to services slide ${idx + 1} of ${totalPages}`}
              aria-selected={idx === page}
              aria-current={idx === page ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                idx === page ? "w-6 bg-gold" : "w-2 bg-gold/30 hover:bg-gold/50",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next services slide"
          aria-controls="hero-services-carousel"
          className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-navy/50 text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
