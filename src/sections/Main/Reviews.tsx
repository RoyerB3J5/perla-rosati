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
  if (items.length === 0) return null;

  const N = items.length;
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
      slide(1);
    }, AUTOPLAY_INTERVAL);
  }, [stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const handleTransitionEnd = () => {
    if (isResetting.current) return;

    if (currentIndex >= 2 * N) {
      isResetting.current = true;
      setIsTransitioning(false);
      setCurrentIndex(N + ((currentIndex - N) % N));
    } else if (currentIndex < N) {
      isResetting.current = true;
      setIsTransitioning(false);
      setCurrentIndex(2 * N - 1 - ((N - 1 - currentIndex) % N));
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

  const stepWidth = containerWidth;
  const translateX = -currentIndex * stepWidth + dragOffset;

  return (
    <section className="container-full flex flex-col justify-center items-center py-20">
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
                className="w-full flex justify-between items-top"
                style={{
                  flex: `0 0 ${containerWidth}px`,
                  minWidth: `${containerWidth}px`,
                }}
              >
                <img
                  src="/icons/comillas.svg"
                  alt="Comillas"
                  width={230}
                  height={178}
                  className="w-[230px] h-[178px]"
                />
                <div className="flex flex-col items-end justify-center gap-16 text-center w-full max-w-[929px]">
                  <div className="w-full h-[1.5px] bg-paragraph" />
                  <h3 className="title-1 text-end">{item.title}</h3>
                  <div className="flex justify-center items-start gap-16">
                    <p className="paragraph uppercase">{item.name}</p>
                    <p className="paragraph max-w-[402px] text-start">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 absolute bottom-0 right-[37%]">
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
