import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="group rounded-[24px] border border-[#eef0eb] bg-white p-4 text-center shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-green-100 to-emerald-100 text-2xl shadow-inner">
            <span>{cat.icon || "🛒"}</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-900">{cat.name}</p>
          <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gray-400">
            Explore <FiChevronRight className="text-[10px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
