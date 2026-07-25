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
    <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="flex min-w-[72px] flex-col items-center cursor-pointer group"
        >
          {/* Circle */}
          <div className="h-16 w-16 rounded-full bg-[#F2F8F3] shadow-sm overflow-hidden border border-green-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
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
          <p className="mt-2 text-[12px] font-medium text-gray-700 text-center line-clamp-2">
            {cat.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;