import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceSlide {
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

export function HeroServicesSlider({ slides, className }: HeroServicesSliderProps) {
  const [mounted, setMounted] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [page, setPage] = useState(0);

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
    if (!mounted || totalPages === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [mounted, next, totalPages]);

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
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((pageSlides, pageIdx) => (
            <div
              key={pageIdx}
              className="w-full shrink-0 px-1 sm:px-2"
            >
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
                {pageSlides.map((slide) => (
                  <div
                    key={slide.title}
                    className="group h-full rounded-2xl border border-gold/30 bg-navy/50 p-5 backdrop-blur-sm transition-colors hover:bg-navy/80"
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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={prev}
          aria-label="Previous service page"
          className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-navy/50 text-gold transition-colors hover:bg-gold/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              aria-label={`Go to service page ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                idx === page ? "w-6 bg-gold" : "w-2 bg-gold/30 hover:bg-gold/50",
              )}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next service page"
          className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 bg-navy/50 text-gold transition-colors hover:bg-gold/10"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
