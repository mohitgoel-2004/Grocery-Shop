import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { fetchCategories, fetchProducts } from "../services/api";
import { useCart } from "../Context/context";
import {
  FiArrowLeft,
  FiFilter,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiSearch,
} from "react-icons/fi";

const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;

const formatWeight = (weight, unit) => {
  if (weight === undefined || weight === null || weight === "") {
    return "";
  }

  const weightText = String(weight).trim();

  if (/[a-zA-Z]/.test(weightText)) {
    return weightText;
  }

  return unit ? `${weightText} ${unit}` : weightText;
};

const getCategoryLabel = (product) => {
  const categoryName =
    product.category?.name || product.category?.slug || product.category || "";

  return categoryName || "All";
};

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadCatalog = async () => {
      const [productsResult, categoriesResult] = await Promise.allSettled([
        fetchProducts(),
        fetchCategories(),
      ]);

      if (productsResult.status === "fulfilled") {
        const productList = productsResult.value?.data?.products || [];
        setProducts(productList);
      } else {
        toast.error(
          productsResult.reason?.response?.data?.message ||
            "Failed to load products",
        );
      }

      if (categoriesResult.status === "fulfilled") {
        const categoryList = categoriesResult.value?.data?.categories || [];
        setCategories(["All", ...categoryList]);
      }

      setIsLoading(false);
    };

    loadCatalog();
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "search") {
      searchRef.current?.focus();
      setHighlightSearch(true);
      setTimeout(() => setHighlightSearch(false), 1500);
      return;
    }
    switch (tabId) {
      case "home":
        navigate("/home");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "search":
        navigate("/search");
        break;
      case "products":
        navigate("/products");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        navigate("/home");
    }
  };

  const filteredProducts = products.filter((product) => {
    const categoryName = getCategoryLabel(product);
    const matchesCategory =
      activeCategory === "All" ||
      categoryName === activeCategory ||
      product.category?.slug === activeCategory;
    const matchesSearch = (product.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    await addToCart(selectedProduct, quantity);
  };

  const handleQuickAdd = async (product) => {
    await addToCart(product);
  };

  const detailDescription =
    selectedProduct?.description ||
    "Freshly curated product with reliable delivery and quality assurance.";

  const selectedWeightLabel = selectedProduct
    ? formatWeight(selectedProduct.weight, selectedProduct.unit)
    : "";
     
  const searchRef = useRef(null);
  const [highlightSearch, setHighlightSearch] = useState(false);

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">
        
        {/* Header - Matching Home Page */}
        <div className="shrink-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-white px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={
                selectedProduct ? handleBackToList : () => navigate("/home")
              }
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Back"
            >
              <FiArrowLeft className="text-lg text-emerald-600" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Grocery Store
              </p>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                {selectedProduct ? "Product Details" : "All Products"}
              </h2>
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Open cart"
            >
              <FiShoppingCart className="text-lg text-emerald-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4">
          {!selectedProduct ? (
            <>
              {/* Search Bar */}
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="What's on your shopping list today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-2xl border bg-white py-3.5 pl-12 pr-14 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
                    highlightSearch
                      ? "border-emerald-500 ring-4 ring-emerald-500/20"
                      : "border-gray-200 focus:border-emerald-500"
                  }`}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiSearch className="text-lg" />
                </span>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-200/50 transition hover:bg-emerald-700 hover:scale-105"
                >
                  <FiFilter className="text-sm" />
                </button>
              </div>

              {/* Categories */}
              <div className="flex gap-3 overflow-x-auto pb-1 pt-1 scrollbar-hide">
                {categories.map((cat) => {
                  const categoryLabel =
                    typeof cat === "string" ? cat : cat.name;

                  return (
                    <button
                      key={categoryLabel}
                      onClick={() => setActiveCategory(categoryLabel)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                        activeCategory === categoryLabel
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-200/50"
                          : "bg-emerald-50 text-gray-700 hover:bg-emerald-100"
                      }`}
                    >
                      {categoryLabel}
                    </button>
                  );
                })}
              </div>

              {/* Product Count */}
              <p className="text-xs font-medium tracking-wide text-gray-500">
                {filteredProducts.length} products found
              </p>

              {/* Product Grid */}
              {isLoading ? (
                <div className="py-10 text-center text-gray-500">
                  Loading products...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pb-16 sm:gap-4">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                        className="group cursor-pointer rounded-2xl border border-emerald-100/80 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-100/50"
                      >
                        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                          {product.badge ? (
                            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md shadow-red-200/50">
                              {product.badge}
                            </span>
                          ) : null}
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <span className="text-4xl">🛒</span>
                          )}
                        </div>
                        <h4 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                          {product.name}
                        </h4>
                        {formatWeight(product.weight, product.unit) ? (
                          <p className="mt-1 text-xs text-gray-400">
                            {formatWeight(product.weight, product.unit)}
                          </p>
                        ) : null}
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                              Price
                            </p>
                            <p className="text-sm font-bold text-emerald-600">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleQuickAdd(product);
                            }}
                            className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-200/50 transition hover:bg-emerald-700 hover:scale-105"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <FiPlus className="text-lg" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-10 text-center text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // Product Detail View
            <div className="space-y-5 pb-24">
              {/* Product Image */}
              <div className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
                <div className="relative mx-auto flex h-70 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="h-full w-full object-contain p-6"
                    />
                  ) : (
                    <span className="text-7xl">🛒</span>
                  )}
                  <button
                    type="button"
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-red-500 shadow-lg transition hover:scale-105"
                    aria-label="Favorite"
                  >
                    <FiHeart className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
                    Selected Product
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight text-gray-900">
                    {selectedProduct.name}
                  </h2>
                  {selectedWeightLabel ? (
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedWeightLabel}
                    </p>
                  ) : null}
                </div>

                {/* Price & Quantity */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100/80 bg-emerald-50/30 px-4 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Price
                    </p>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      {selectedProduct.rating ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200/50">
                          ⭐ {selectedProduct.rating.toFixed(1)}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm border border-emerald-100">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      className="grid h-8 w-8 place-items-center rounded-full border border-emerald-200 bg-white text-emerald-600 transition hover:bg-emerald-50 hover:border-emerald-300"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus className="text-sm" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold text-gray-900">
                      {quantity.toString().padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => current + 1)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 hover:scale-105"
                      aria-label="Increase quantity"
                    >
                      <FiPlus className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Available on fast delivery
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                  Description
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {detailDescription}
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  This promo is limited and may change at any time depending on
                  product availability.
                </p>
              </div>

              {/* Add to Cart Button */}
              <div className="sticky bottom-0 -mx-4 bg-gradient-to-t from-white via-white to-white/0 px-4 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-200/50 transition hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.01]"
                >
                  <FiShoppingCart className="text-lg" />
                  Add To Cart
                </button>
              </div>
            </div>
          )}
        </div>

        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default ProductDetails;