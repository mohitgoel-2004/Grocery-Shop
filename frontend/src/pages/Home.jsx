import React, { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiBell,
  FiClock,
  FiMapPin,
  FiSearch,
  FiTag,
  FiTruck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";

import { useAddress } from "../Context/AddressContext";
import { fetchProducts } from "../services/productService";
import { useNotification } from "../Context/NotificationContext";

const offers = [
  {
    id: 1,
    title: "Flat 30% Off",
    subtitle: "On all organic vegetables",
    description: "Use code: ORGANIC30",
    bg: "from-green-600 to-emerald-700",
    icon: <FiTag className="text-3xl" />,
    cta: "Grab Deal",
  },
  {
    id: 2,
    title: "Free Delivery",
    subtitle: "On orders above ₹199",
    description: "No minimum order fee",
    bg: "from-emerald-500 to-teal-600",
    icon: <FiTruck className="text-3xl" />,
    cta: "Order Now",
  },
  {
    id: 3,
    title: "Early Bird",
    subtitle: "Get 20% extra off",
    description: "Order before 10 AM",
    bg: "from-green-500 to-green-700",
    icon: <FiClock className="text-3xl" />,
    cta: "Shop Now",
  },
];

const Home = () => {
  const { defaultAddress } = useAddress();

  const [highlightSearch, setHighlightSearch] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const searchRef = useRef(null);
  const wrapperRef = useRef(null);

  const navigate = useNavigate();
  const { unreadCount } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ============================
  // NAVIGATION
  // ============================
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    if (tabId === "search") {
      searchRef.current?.focus();
      setHighlightSearch(true);

      setTimeout(() => {
        setHighlightSearch(false);
      }, 1500);

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

  // ============================
  // OFFER SLIDER
  // ============================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer(
        (previous) => (previous + 1) % offers.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ============================
  // LOAD PRODUCTS
  // ============================
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);

      try {
        const response = await fetchProducts();

        setProducts(
          Array.isArray(response.data?.products)
            ? response.data.products
            : []
        );
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // ============================
  // SEARCH SUGGESTIONS
  // ============================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
  }, [searchTerm, products]);

  // ============================
  // CLICK OUTSIDE SEARCH
  // ============================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================
  // BESTSELLER PRODUCTS
  // ============================
  // First 12 products will be shown
  // in horizontally swipeable 2x3 grids.
  const bestsellerProducts = products.slice(0, 12);

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="shrink-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-white px-4 pb-3 pt-4">

          {/* Location + Notification */}
          <div className="flex items-center justify-between gap-3">

            {/* Location */}
            <button
              onClick={() => navigate("/addresses")}
              className="min-w-0 text-left"
            >
              <p className="text-[11px] font-semibold text-gray-500">
                Delivering to
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <FiMapPin className="shrink-0 text-emerald-600" />

                <h2 className="max-w-[230px] truncate text-[15px] font-bold text-gray-900">
                  {defaultAddress
                    ? `${defaultAddress.address}, ${defaultAddress.city}`
                    : "Select Location"}
                </h2>

                <span className="text-gray-500">
                  ⌄
                </span>
              </div>
            </button>

            {/* Notification */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm"
            >
              <FiBell className="text-lg text-emerald-600" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div
            className="relative mt-4"
            ref={wrapperRef}
          >
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <FiSearch className="text-xl text-gray-500" />
            </div>

            <input
              ref={searchRef}
              type="text"
              placeholder='Search "vegetables, milk, chips..."'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className={`h-14 w-full rounded-2xl border bg-white pl-12 pr-4 text-[15px] font-medium text-gray-800 shadow-sm outline-none transition ${
                highlightSearch
                  ? "border-emerald-500 ring-4 ring-emerald-100"
                  : "border-gray-200"
              }`}
            />

            {/* Search Suggestions */}
            {showSuggestions && searchTerm && (
              <div className="absolute left-0 right-0 top-16 z-50 max-h-80 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">

                {suggestions.length > 0 ? (
                  suggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => {
                        setSearchTerm(product.name);
                        setShowSuggestions(false);

                        navigate(
                          `/product/${product._id}`
                        );
                      }}
                      className="flex cursor-pointer items-center gap-3 border-b border-gray-100 p-3 last:border-0 hover:bg-emerald-50"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-800">
                          {product.name}
                        </h3>

                        <p className="font-bold text-emerald-600">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No products found
                  </div>
                )}

              </div>
            )}
          </div>
        </header>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2">

          {/* =================================================
              OFFER SECTION
          ================================================= */}

          <section className="relative mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-5 shadow-sm">

            <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-300/30 blur-2xl" />

            <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">

              <div className="max-w-[72%] sm:max-w-[68%]">

                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700 backdrop-blur-sm">
                  Limited Offer
                </div>

                <div className="flex items-center gap-2 text-emerald-700">
                  {offers[currentOffer].icon}

                  <span className="text-sm font-medium">
                    Fresh picks for today
                  </span>
                </div>

                <h2 className="mt-3 text-[2rem] font-extrabold leading-tight text-[#0f172a] sm:text-4xl">
                  {offers[currentOffer].title}
                </h2>

                <p className="mt-2 text-base font-medium text-slate-700">
                  {offers[currentOffer].subtitle}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {offers[currentOffer].description}
                </p>

                <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition active:scale-95">
                  {offers[currentOffer].cta}

                  <FiArrowRight className="text-base" />
                </button>
              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-emerald-600 shadow-sm">
                {offers[currentOffer].icon}
              </div>
            </div>

            {/* Slider indicators */}
            <div className="mt-4 flex items-center gap-2">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentOffer(index)
                  }
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentOffer
                      ? "w-8 bg-emerald-600"
                      : "w-2 bg-emerald-200"
                  }`}
                  aria-label={`Go to offer ${
                    index + 1
                  }`}
                />
              ))}
            </div>
          </section>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <section className="mt-7">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-[23px] font-extrabold tracking-tight text-gray-900">
                  Categories
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Shop your daily essentials
                </p>
              </div>

              <button className="text-sm font-bold text-emerald-600">
                See all
              </button>
            </div>

            <CategoryList />

          </section>

          {/* =================================================
              BESTSELLERS
              2 ROW x 3 COLUMN
              HORIZONTAL SWIPE
          ================================================= */}

          <section className="mt-8">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-[23px] font-extrabold tracking-tight text-gray-900">
                  Bestsellers
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Most loved products
                </p>
              </div>

              <button
                onClick={() => navigate("/products")}
                className="text-sm font-bold text-emerald-600"
              >
                See all
              </button>

            </div>

            {isLoadingProducts ? (

              <div className="py-8 text-center text-sm text-gray-500">
                Loading products...
              </div>

            ) : bestsellerProducts.length > 0 ? (

              /*
               * IMPORTANT:
               *
               * Outer container = horizontal swipe
               *
               * Each slide = 2 rows x 3 columns
               *
               * So 6 products are visible at once.
               */

              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide">

                {Array.from({
                  length: Math.ceil(
                    bestsellerProducts.length / 6
                  ),
                }).map((_, pageIndex) => {

                  const pageProducts =
                    bestsellerProducts.slice(
                      pageIndex * 6,
                      pageIndex * 6 + 6
                    );

                  return (
                    <div
                      key={pageIndex}
                      className="grid w-full min-w-full shrink-0 snap-start grid-cols-3 gap-x-3 gap-y-4"
                    >

                      {pageProducts.map((product) => {

                        const image =
                          product.image ||
                          product.img ||
                          "https://via.placeholder.com/100";

                        const weight =
                          product.weight !==
                            undefined &&
                          product.weight !== null &&
                          product.weight !== ""
                            ? `${product.weight} ${
                                product.unit || ""
                              }`
                            : "";

                        return (
                          <div
                            key={product._id}
                            onClick={() =>
                              navigate(
                                `/product/${product._id}`
                              )
                            }
                            className="group cursor-pointer text-center"
                          >

                            {/* Product image */}
                            <div className="mx-auto flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-[#f3faf5] transition duration-300 group-hover:scale-105 group-hover:border-emerald-200 group-hover:shadow-sm">

                              <img
                                src={image}
                                alt={product.name}
                                className="h-full w-full object-contain p-2"
                              />

                            </div>

                            {/* Weight */}
                            {weight && (
                              <p className="mt-1 text-[8px] font-medium text-gray-400">
                                {weight}
                              </p>
                            )}

                            {/* Product name */}
                            <p className="mt-1 line-clamp-2 min-h-[28px] px-1 text-[11px] font-semibold leading-[14px] text-gray-700">
                              {product.name}
                            </p>

                          </div>
                        );
                      })}

                    </div>
                  );
                })}

              </div>

            ) : (

              <div className="py-8 text-center text-sm text-gray-500">
                No products available
              </div>

            )}

          </section>

          {/* =================================================
              PRODUCT CARDS
              NORMAL GRID - NO SWIPE
          ================================================= */}

          <section className="mt-9 pb-28 sm:pb-10">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-[23px] font-extrabold tracking-tight text-gray-900">
                  Fresh Picks
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Handpicked products for you
                </p>
              </div>

              <button
                onClick={() => navigate("/products")}
                className="text-sm font-bold text-emerald-600"
              >
                See all
              </button>

            </div>

            {isLoadingProducts ? (

              <div className="py-10 text-center text-gray-500">
                Loading products...
              </div>

            ) : products.length > 0 ? (

              /*
               * IMPORTANT:
               *
               * No overflow-x-auto here.
               * No swipe.
               *
               * Products will appear as normal
               * 2-column cards.
               */

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">

                {products.map((item) => (
                  <ProductCard
                    key={item._id}
                    product={item}
                  />
                ))}

              </div>

            ) : (

              <div className="py-10 text-center text-gray-500">
                No products available
              </div>

            )}

          </section>

        </div>

        {/* =====================================================
            BOTTOM NAVBAR
        ===================================================== */}

        <Navbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

      </div>
    </div>
  );
};

export default Home;