import { Fragment, useEffect, useMemo, useRef, useState } from "react";

export interface BlogPost {
  date: string;
  id: string;
  title: string;
  description: string;
  image: string;
  idCategory: string;
}

export interface BlogCategory {
  id: string;
  title: string;
}

interface BlogSectionProps {
  items: BlogPost[];
  category: BlogCategory[];
  lang?: string;
  perPage?: number;
}

const AUTHOR = "PERLA ROSATI";

// Mismos selectores y misma lógica que el script global del Layout
// (document.addEventListener("DOMContentLoaded", ...)). Ese observer solo
// corre una vez sobre el DOM inicial, así que no detecta las tarjetas que
// React monta/remonta después (al filtrar o paginar). Esta versión hace lo
// mismo pero se vuelve a ejecutar cada vez que el componente renderiza
// nuevos elementos.
function useRevealAnimations(
  containerRef: React.RefObject<HTMLElement | null>,
  deps: unknown[],
) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const animationElements = root.querySelectorAll(
      ".fade-up-a, .fade-down-a, .fade-left-a, .fade-right-a, .fade-up-words, .fade-up-slow, .reveal-ltr, .reveal-rtl, .reveal-tl-br, .fade-up-gallery",
    );

    if (animationElements.length === 0) return;

    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Fuerza un reflow para que el navegador "vea" el estado inicial
            // antes de aplicar .active; si no, salta directo al estado final.
            el.getBoundingClientRect();
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                el.classList.add("active");
              });
            });
            animationObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    animationElements.forEach((element) => {
      // Por si un nodo se reutiliza entre renders (misma key) y ya estaba
      // activado, no hace falta re-animarlo desde cero.
      if (!element.classList.contains("active")) {
        animationObserver.observe(element);
      }
    });

    return () => animationObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Puerto de components/AnimatedTitle.astro. Ese componente parte el texto
// en palabras y anima cada una con un delay escalonado. Su <style> está
// scoped al .astro y no llega a nodos renderizados por React, así que el
// CSS también se declara (global, dentro de este mismo archivo) más abajo.
interface AnimatedTitleProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  delayStep?: number;
  duration?: number;
}

function AnimatedTitle({
  text,
  tag: Tag = "h1",
  className = "",
  delayStep = 0.2,
  duration = 2.2,
}: AnimatedTitleProps) {
  const words = text ? text.split(" ") : [];

  return (
    <Tag className={`fade-up-words ${className}`}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span
            className="word"
            style={
              {
                "--index": index,
                "--delay-step": `${delayStep}s`,
                "--duration": `${duration}s`,
              } as React.CSSProperties
            }
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}

export default function BlogSection({
  items,
  category,
  lang = "en",
  perPage = 9,
}: BlogSectionProps) {
  const allCategoryId = category[0]?.id ?? "";

  const [activeCategory, setActiveCategory] = useState(allCategoryId);
  const [page, setPage] = useState(1);

  const isFiltering = activeCategory !== allCategoryId;

  const filteredItems = useMemo(
    () =>
      isFiltering
        ? items.filter((item) => item.idCategory === activeCategory)
        : items,
    [items, activeCategory, isFiltering],
  );

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));
  const currentPage = Math.min(page, totalPages);

  const visibleItems = useMemo(
    () =>
      filteredItems.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filteredItems, currentPage, perPage],
  );

  const featured = items[4] ?? items[0];
  const showFeatured = !isFiltering && currentPage === 1;

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    setPage(1);
  };

  const prevLabel = lang === "es" ? "Anterior" : "Previous";
  const nextLabel = lang === "es" ? "Siguiente" : "Next";

  const sectionRef = useRef<HTMLElement>(null);

  // Se reobserva cada vez que cambia lo que hay en pantalla: nueva
  // categoría, nueva página, o si aparece/desaparece el destacado.
  useRevealAnimations(sectionRef, [activeCategory, currentPage, showFeatured]);

  if (!featured) return null;

  return (
    <>
      <style>{`
        .category-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .category-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Portado de components/AnimatedTitle.astro (scoped allá, global acá) */
        .fade-up-words {
          display: block;
        }

        .fade-up-words .word {
          display: inline-block;

          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          letter-spacing: inherit !important;
          color: inherit !important;

          vertical-align: baseline;

          opacity: 0;
          transform: translateY(50px);
          will-change: transform, opacity, filter;
        }

        .fade-up-words.active .word {
          animation: blogFadeUpWord var(--duration, 1.4s)
            cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: calc(var(--index) * var(--delay-step, 0.18s));
        }

        @keyframes blogFadeUpWord {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="container-full flex flex-col justify-center items-center gap-14"
      >
        <div className="category-scroll w-full xl:w-auto max-w-full flex justify-start xl:justify-center items-stretch flex-nowrap overflow-x-auto xl:overflow-visible scroll-smooth fade-up-a">
          {category.map((item) => {
            const active = item.id === activeCategory;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCategoryClick(item.id)}
                aria-pressed={active}
                className="paragraph-medium text-paragrah uppercase tracking-[2.56px] cursor-pointer border-r-2 border-paragraph last:border-r-0 px-6 shrink-0 whitespace-nowrap group"
              >
                {item.title}
                <div
                  className={`group-hover:bg-paragraph group-hover:text-white w-[50%] h-[1px] aboslute -bottom-1 left-1/2 translate-x-1/2 transition-all duration-300 ease-in-out${
                    active ? " bg-paragraph" : ""
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-16 md:gap-20">
          {showFeatured && (
            <div className="w-full flex flex-col md:flex-row jusitfy-center items-center border-[1.5px] border-paragraph gap-0 xl:gap-6">
              <div className="w-full max-w-[628px] h-auto relative overflow-hidden aspect-628/542 md:aspect-628/652 lg:aspect-628/542 reveal-ltr">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover absolute inset-0"
                  decoding="async"
                  loading="eager"
                  width={1200}
                  height={1600}
                />
              </div>
              <div className="w-full flex flex-col justify-center items-center text-paragraph">
                <div className="w-full flex flex-col justify-center items-start gap-8 max-w-[564px] p-8 md:px-6 md:py-0">
                  <div className="flex flex-col justify-center items-start gap-6">
                    <AnimatedTitle text={featured.title} tag="h2" className="title-4" />
                    <p
                      className="paragraph-medium uppercase fade-up-a"
                      style={{ animationDelay: "0.5s" }}
                    >
                      {featured.date} . {AUTHOR}
                    </p>
                    <div
                      className="w-full h-[1.5px] bg-paragraph fade-up-a"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <p
                      className="paragraph fade-up-a"
                      style={{ animationDelay: "0.5s" }}
                    >
                      {featured.description}
                    </p>
                  </div>
                  <a
                    href={`/${lang}/blog/${featured.id}`}
                    className="paragraph-medium uppercase border-b-[1.5px] border-paragraph tracking-[2.56px] pb-2 fade-up-slow"
                    style={{ "--delay": "0.5s" } as React.CSSProperties}
                  >
                    LEER ARTÍCULO
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {visibleItems.map((item, i) => (
              <div
                key={`${item.id}-${item.idCategory}-${i}`}
                className="flex flex-col justify-center items-start gap-6 text-paragraph h-full"
              >
                <div
                  className="w-full h-auto relative overflow-hidden reveal-tl-br"
                  style={{ aspectRatio: "410.6 / 358.3" }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover absolute inset-0 object-[50%_12%]"
                    decoding="async"
                    loading="lazy"
                    width={1200}
                    height={1600}
                  />
                </div>
                <div className="w-full h-[1.5px] bg-paragraph fade-up-a" />
                <p className="paragraph-medium uppercase fade-up-a">
                  {item.date} . {AUTHOR}
                </p>
                <AnimatedTitle text={item.title} tag="h2" className="title-4" />
                <p
                  className="paragraph grow fade-up-a"
                  style={{ animationDelay: "0.5s" }}
                >
                  {item.description}
                </p>
                <a
                  className="paragraph-medium uppercase border-b-[1.5px] border-paragraph tracking-[2.56px] pb-2 pt-4 fade-up-slow"
                  style={{ "--delay": "0.5s" } as React.CSSProperties}
                  href={`/${lang}/blog/${item.id}`}
                >
                  LEER ARTÍCULO
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {totalPages > 1 && (
        <nav className="container-full flex justify-center items-center gap-6 text-paragraph pt-14 pb-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="paragraph-medium uppercase tracking-[2.56px] border-b-[1.5px] border-paragraph pb-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
          >
            {prevLabel}
          </button>
          <span className="paragraph-medium uppercase tracking-[2.56px]">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="paragraph-medium uppercase tracking-[2.56px] border-b-[1.5px] border-paragraph pb-2 cursor-pointer disabled:opacity-40 disabled:cursor-default"
          >
            {nextLabel}
          </button>
        </nav>
      )}
    </>
  );
}
