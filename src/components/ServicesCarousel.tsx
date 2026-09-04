import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type MouseEvent,
  type TouchEvent,
} from "react";

const GAP = 24;
const AUTOPLAY_INTERVAL = 8000;

type ReviewItem = {
  image: string;
  title: string;
  description: string;
  href: string;
};

interface CarouselReviewProps {
  items: ReviewItem[];
}

export default function ServicesCarousel({ items }: CarouselReviewProps) {
  const N = items.length;
  const expandedItems = [...items, ...items, ...items];

  const [currentIndex, setCurrentIndex] = useState(N);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [stepWidth, setStepWidth] = useState(0);

  const dragStart = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isResetting = useRef(false);

  // Slide widths are pure CSS (see the slide classNames: 1 per view below
  // 640px, 2 from 640px, 3 from 1030px), so the server-rendered HTML is
  // already correctly laid out on first paint. Here we only measure one step
  // (slide + gap) in pixels for the translateX math, straight from the
  // rendered DOM, so padding/gaps can never drift out of sync.
  const measureStep = useCallback(() => {
    const track = trackRef.current;
    if (track && track.children.length > 1) {
      const first = (track.children[0] as HTMLElement).getBoundingClientRect();
      const second = (track.children[1] as HTMLElement).getBoundingClientRect();
      const step = second.left - first.left;
      if (step > 0) setStepWidth(step);
    }
  }, []);

  useEffect(() => {
    measureStep();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => measureStep());
    ro.observe(container);
    return () => ro.disconnect();
  }, [measureStep]);

  // Release the wrap-back lock after a silent snap. This effect deliberately
  // never re-enables transitions: they stay off until the next real movement
  // (autoplay tick, button or drag), which turns them on itself. Because no
  // commit between load and first movement ever carries a transition, the
  // initial snap from the server HTML to the middle copy cannot animate on
  // any device — the carousel loads already in place and never jumps.
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        isResetting.current = false;
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [currentIndex, isTransitioning]);

  const stopAutoplay = useCallback(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, AUTOPLAY_INTERVAL);
  }, [stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const handleTransitionEnd = () => {
    if (isResetting.current) return;

    if (currentIndex >= 2 * N || currentIndex < N) {
      isResetting.current = true;
      setIsTransitioning(false);
      const equivalentIndex = N + (((currentIndex % N) + N) % N);
      setCurrentIndex(equivalentIndex);
    }
  };

  const slide = useCallback(
    (direction: 1 | -1) => {
      stopAutoplay();
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + direction);
      startAutoplay();
    },
    [stopAutoplay, startAutoplay],
  );

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    stopAutoplay();
    setIsTransitioning(false);
    dragStart.current = e.clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.current;
    setDragOffset(deltaX);
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    setIsTransitioning(true);

    if (dragOffset < -threshold) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > threshold) {
      setCurrentIndex((prev) => prev - 1);
    }

    setDragOffset(0);
    startAutoplay();
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    stopAutoplay();
    setIsTransitioning(false);
    if (e.touches.length > 0) {
      dragStart.current = e.touches[0].clientX;
    }
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - dragStart.current;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    setIsTransitioning(true);

    if (dragOffset < -threshold) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > threshold) {
      setCurrentIndex((prev) => prev - 1);
    }

    setDragOffset(0);
    startAutoplay();
  };

  if (N === 0) return null;

  // Before measuring (SSR / pre-hydration) render at offset 0: the first copy
  // is laid out correctly by CSS, so first paint is never jumbled. Once
  // measured we snap (transition disabled) to the middle copy, which looks
  // identical, and transitions get re-enabled by the effect above.
  const translateX = stepWidth > 0 ? -currentIndex * stepWidth + dragOffset : 0;

  const totalSlides = N;
  const currentSlide = ((currentIndex % N) + N) % N;
  const progress = (currentSlide + 1) / totalSlides;

  const arrowClass =
    "w-12 h-12 rounded-full border border-paragraph text-paragraph flex items-center justify-center transition-colors duration-300 hover:bg-white hover:text-paragraph cursor-pointer";

  return (
    <section className="w-full flex flex-col justify-center items-center">
      <div className="w-full">
        <div
          ref={containerRef}
          className="w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: "pan-y" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDragStart={(e) => e.preventDefault()}
        >
          <div
            ref={trackRef}
            className="flex items-stretch md:px-1"
            style={{
              gap: `${GAP}px`,
              transform: `translate3d(${translateX}px, 0, 0)`,
              transition: isTransitioning ? "transform 300ms ease-out" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {expandedItems.map((item, index) => (
              <div
                // NOTE: keep these in sync with GAP (24px) and the
                // breakpoints 1 / 2 / 3 per view (<640 / <1030 / >=1030).
                className="shrink-0 grow-0 basis-full sm:basis-[calc((100%-24px)/2)] min-[1030px]:basis-[calc((100%-48px)/3)] flex flex-col justify-start items-start gap-8"
                key={index}
              >
                <div className="flex flex-col justify-center items-start gap-6 text-paragraph h-full">
                  <div className="w-full h-auto aspect-410/513 bg-[#C8C8C8]"></div>
                  <div className="w-full h-[1.5px] bg-paragraph" />
                  <h3 className="paragraph-medium">{item.title}</h3>
                  <p className="paragraph grow">{item.description}</p>
                </div>
                <a
                  className="flex justify-center items-center gap-4 cursor-pointer hover:-translate-y-[2px] transition-all duration-300 ease-in-out z-[10] hover:scale-[1.02] box-border py-2.75 px-6 md:w-[264px] rounded-full w-full border-[1.5px] border-paragraph text-[16px] font-medium text-paragraph leading-[21px] uppercase tracking-[2.56px]"
                  href={item.href}
                >
                  BOOK NOW
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="14"
                    viewBox="0 0 24 14"
                    fill="none"
                  >
                    <path
                      d="M16 -1.74846e-06C16 0.741998 16.733 1.85 17.475 2.78C18.429 3.98 19.569 5.027 20.876 5.826C21.856 6.425 23.044 7 24 7M24 7C23.044 7 21.855 7.575 20.876 8.174C19.569 8.974 18.429 10.021 17.475 11.219C16.733 12.15 16 13.26 16 14M24 7L-1.5299e-06 6.99999"
                      stroke="#2B2626"
                      stroke-width="2"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center md:justify-between items-center gap-4 mt-6 w-full">
          <div className="flex-1 h-[4px] bg-[#2B26264D] rounded-full overflow-hidden hidden md:block">
            <div
              className="h-full bg-paragraph transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="Previous service"
              className={arrowClass}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="14"
                viewBox="0 0 24 14"
                fill="none"
              >
                <path
                  d="M8 14C8 13.258 7.267 12.15 6.525 11.22C5.571 10.02 4.431 8.973 3.124 8.174C2.144 7.575 0.956 7 -3.0598e-07 7M-3.0598e-07 7C0.956 7 2.145 6.425 3.124 5.826C4.431 5.026 5.571 3.979 6.525 2.781C7.267 1.85 8 0.74 8 -3.49691e-07M-3.0598e-07 7L24 7"
                  stroke="#2B2626"
                  stroke-width="2"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="Next service"
              className={arrowClass}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="14"
                viewBox="0 0 24 14"
                fill="none"
              >
                <path
                  d="M16 -1.74846e-06C16 0.741998 16.733 1.85 17.475 2.78C18.429 3.98 19.569 5.027 20.876 5.826C21.856 6.425 23.044 7 24 7M24 7C23.044 7 21.855 7.575 20.876 8.174C19.569 8.974 18.429 10.021 17.475 11.219C16.733 12.15 16 13.26 16 14M24 7L-1.5299e-06 6.99999"
                  stroke="#2B2626"
                  stroke-width="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
