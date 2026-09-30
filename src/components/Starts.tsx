import { useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import FormReview from "./FormReview";

function Starts() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const showForm = rating !== null && rating <= 3;
  const total = 5;
  const reviewLink =
    "https://www.google.com/search?sa=X&sca_esv=c9af837ca623c2e6&biw=1280&bih=585&sxsrf=APpeQnv7H7Nq9bNcp9MvWvvfxF-7nWi7GA:1790267039816&kgmid=/g/11rg2qf4cv&q=Perla+Rosati+Makeup+Studio&shem=dlvs1,epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/uni/m1/1&kgs=91bc2ba39c996003&utm_source=dlvs1,epsd1,ltae,rimspwouoe,sh/x/loc/uni/m1/1";

  // Move any client-only side effects (redirect) into useEffect so SSR won't break.
  useEffect(() => {
    if (rating !== null && rating === total - 1) {
      if (typeof window !== "undefined") {
        window.location.href = reviewLink;
      }
    }
  }, [rating]);

  const handleRatingSelect = (index: number) => {
    setRating(index);
  };

  const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

  return (
    <>
      <div className="flex justify-center items-center gap-2 px-5">
        {STAR_KEYS.map((key, idx) => {
          const activeIndex = hovered !== null ? hovered : rating;
          const isActive = activeIndex !== null && idx <= activeIndex;
          return (
            <button
              key={key}
              type="button"
              aria-label={`Rate ${idx + 1} stars`}
              className="cursor-pointer transition-colors duration-150 bg-transparent border-0 p-0"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleRatingSelect(idx)}
            >
              {isActive ? (
                <FaStar size={24} className="text-paragraph" />
              ) : (
                <FaRegStar size={24} className="text-paragraph" />
              )}
            </button>
          );
        })}
      </div>
      {showForm && <FormReview />}
    </>
  );
}

export default Starts;
