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
    <div className="flex gap-4 overflow-x-auto pb-2 pr-1 scrollbar-hide snap-x snap-mandatory">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="group flex min-w-18 snap-start cursor-pointer flex-col items-center sm:min-w-19.5"
        >
          {/* Circle */}
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-[#F2F8F3] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md sm:h-17 sm:w-17">
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/100x100/png?text=No";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl">
                {cat.icon || "🛒"}
              </div>
            )}
          </div>

          {/* Name */}
          <p className="mt-2 line-clamp-2 text-center text-[12px] font-medium text-gray-700">
            {cat.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;