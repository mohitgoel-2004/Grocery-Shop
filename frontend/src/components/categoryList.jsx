import React, { useEffect, useState, useRef } from "react";
import { fetchCategories } from "../services/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const scrollContainerRef = useRef(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error(error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  // Check scroll position for gradient visibility
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setShowLeftGradient(scrollLeft > 20);
      setShowRightGradient(
        scrollLeft < scrollWidth - clientWidth - 20
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);

      // Initial check
      handleScroll();

      return () =>
        container.removeEventListener("scroll", handleScroll);
    }
  }, [categories]);

  return (
    <div className="relative">
      {/* Left Gradient Fade */}
      {showLeftGradient && (
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent" />
      )}

      {/* Right Gradient Fade */}
      {showRightGradient && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth px-2 py-3 sm:gap-7"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="group flex w-[72px] min-w-[72px] flex-shrink-0 cursor-pointer flex-col items-center sm:w-[82px] sm:min-w-[82px]"
          >
            {/* ==============================
                FULL ROUNDED CATEGORY IMAGE
            ============================== */}
            <div className="h-[62px] w-[62px] overflow-hidden rounded-full bg-gray-100 transition-all duration-200 group-hover:shadow-md sm:h-[70px] sm:w-[70px]">
              {cat.image || cat.images?.[0] ? (
                <img
                  src={cat.image || cat.images?.[0]}
                  alt={cat.name}
                  className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/150x150/png?text=No+Image";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-50 text-2xl">
                  {cat.icon || "🛒"}
                </div>
              )}
            </div>

            {/* ==============================
                CATEGORY NAME
            ============================== */}
            <p className="mt-2 line-clamp-2 w-full text-center text-[11px] font-medium leading-[14px] text-gray-700 sm:text-[12px] sm:leading-[15px]">
              {cat.name} 
            </p>
          </div>
        ))}
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryList;
