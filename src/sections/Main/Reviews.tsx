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
  title: string;
  name: string;
  description: string;
};

interface CarouselReviewProps {
  items: ReviewItem[];
}

export default function Review({ items }: CarouselReviewProps) {
  const N = items.length;
  // Triple buffer: [copy 0][copy 1 (visible start)][copy 2]
  // We always live inside copy 1 and silently jump back to it on wrap,
  // so the track never runs out of slides.
  const expandedItems = [...items, ...items, ...items];

  const [currentIndex, setCurrentIndex] = useState(N);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const dragStart = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isResetting = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const width = container.getBoundingClientRect().width;
      setContainerWidth(width);
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

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
    if (N === 0) return;
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay, N]);

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
    let direction = 0;
    if (dragOffset < -threshold) direction = 1;
    else if (dragOffset > threshold) direction = -1;

    setDragOffset(0);

    if (direction !== 0) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + direction);
    } else {
      setIsTransitioning(true);
    }
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
    let direction = 0;
    if (dragOffset < -threshold) direction = 1;
    else if (dragOffset > threshold) direction = -1;

    setDragOffset(0);

    if (direction !== 0) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + direction);
    } else {
      setIsTransitioning(true);
    }
    startAutoplay();
  };

  if (N === 0) return null;

  const stepWidth = containerWidth;
  // Clamp the rendered index so fast repeated clicks can never translate
  // past the cloned track (which would show empty space) before the
  // silent wrap-back runs.
  const clampedIndex = Math.max(0, Math.min(currentIndex, 3 * N - 1));
  // Before measuring (SSR / pre-hydration) render at offset 0. Slides are
  // sized with CSS (w-full), so first paint is already correct and never
  // jumbled; once measured we snap (transition disabled) to the middle copy.
  const translateX =
    stepWidth > 0 ? -clampedIndex * stepWidth + dragOffset : 0;

  return (
    <section className="container-full flex flex-col justify-center items-center py-16 md:py-20">
      <div className="w-full relative">
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
            className="flex"
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              transition: isTransitioning ? "transform 300ms ease-out" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {expandedItems.map((item, index) => (
              <div
                key={index}
                className="w-full shrink-0 grow-0 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-top gap-12 md:gap-0"
              >
                <img
                  src="/icons/comillas.svg"
                  alt="Comillas"
                  width={230}
                  height={178}
                  className="w-[230px] md:w-[170px] xl:w-[230px]   h-[178px] md:h-auto xl:h-[178px] "
                />
                <div className="flex flex-col items-start md:items-end justify-center gap-12 md:gap-16 text-center w-full max-w-[929px]">
                  <div className="w-full h-[1.5px] bg-paragraph" />
                  <h3 className="title-2 xl:title-1 text-start md:text-end">
                    {item.title}
                  </h3>
                  <div className="flex flex-col md:flex-row justify-center items-start gap-12 md:gap-16">
                    <p className="paragraph uppercase order-2 md:order-1">
                      {item.name}
                    </p>
                    <p className="paragraph max-w-[402px] text-start order-1 md:order-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 absolute bottom-[-24px] md:-bottom-8 lg:bottom-0 right-auto md:right-1/2 translate-x-0 md:translate-x-1/2 lg:translate-x-0 lg:right-[47%] xl:right-[37%] left-0 md:left-auto">
          <button
            type="button"
            onClick={() => slide(-1)}
            aria-label="Previous review"
            className="cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_9_2577)">
                <path
                  d="M6.66667 15.8335C6.66667 15.2152 6.05583 14.2918 5.4375 13.5168C4.6425 12.5168 3.6925 11.6443 2.60333 10.9785C1.78667 10.4793 0.796668 10.0002 1.49347e-06 10.0002M1.49347e-06 10.0002C0.796668 10.0002 1.7875 9.521 2.60333 9.02183C3.6925 8.35516 4.6425 7.48266 5.4375 6.48433C6.05583 5.7085 6.66667 4.7835 6.66667 4.16683M1.49347e-06 10.0002L20 10.0002"
                  stroke="#2B2626"
                />
              </g>
              <defs>
                <clipPath id="clip0_9_2577">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(20 20) rotate(180)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            aria-label="Next review"
            className="cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_9_2579)">
                <path
                  d="M13.3333 4.1665C13.3333 4.78484 13.9442 5.70817 14.5625 6.48317C15.3575 7.48317 16.3075 8.35567 17.3967 9.0215C18.2133 9.52067 19.2033 9.99984 20 9.99984M20 9.99984C19.2033 9.99984 18.2125 10.479 17.3967 10.9782C16.3075 11.6448 15.3575 12.5173 14.5625 13.5157C13.9442 14.2915 13.3333 15.2165 13.3333 15.8332M20 9.99984L2.21854e-07 9.99984"
                  stroke="#2B2626"
                />
              </g>
              <defs>
                <clipPath id="clip0_9_2579">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
