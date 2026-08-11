import React, { useEffect, useState } from "react";
import { fetchCategories } from "../services/api";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

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

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="group cursor-pointer rounded-[22px] bg-[#f4f5f7] p-2.5 transition-all duration-200 active:scale-[0.98] hover:shadow-md"
        >
          {/* ==============================
              IMAGE GRID
          ============================== */}
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((index) => {
              /*
               * Agar category ke paas multiple images hain
               * to unhe use karega.
               * Otherwise same category image repeat hogi.
               */
              const image =
                cat.images?.[index] ||
                cat.image;

              return (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-[15px] bg-white"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://placehold.co/100x100/png?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-2xl">
                      {cat.icon || "🛒"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ==============================
              PRODUCT COUNT
          ============================== */}
          {cat.productCount > 0 && (
            <div className="relative z-10 mx-auto -mt-1.5 w-fit rounded-full bg-white px-2.5 py-0.5 text-[10px] font-medium text-gray-500 shadow-sm">
              +{cat.productCount} more
            </div>
          )}

          {/* ==============================
              CATEGORY NAME
          ============================== */}
          <p className="mt-2 line-clamp-2 min-h-[34px] text-center text-[14px] font-semibold leading-[17px] text-gray-800">
            {cat.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;