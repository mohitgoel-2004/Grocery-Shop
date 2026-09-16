import React, { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiClock,
  FiMapPin,
  FiPackage,
  FiPercent,
  FiSearch,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";
import HomeBanner from "../assets/HomeBanner.jpeg";
import HomeBanner2 from "../assets/HomeBanner2.jpeg";
import HomeBanner3 from "../assets/HomeBanner3.jpeg";

import { useAddress } from "../Context/AddressContext";
import {
  fetchCategories,
  fetchProducts,
} from "../services/productService";
import { useNotification } from "../Context/NotificationContext";

const Home = () => {
  const { defaultAddress } = useAddress();

  const [highlightSearch, setHighlightSearch] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [sectionProducts, setSectionProducts] = useState({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategorySections, setIsLoadingCategorySections] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const searchRef = useRef(null);
  const wrapperRef = useRef(null);

  const navigate = useNavigate();
  const { unreadCount } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const banners = [HomeBanner, HomeBanner2, HomeBanner3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((previous) => (previous + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

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
  const lateDealProducts = products.slice(12, 17);
  const dealProducts =
    lateDealProducts.length > 0
      ? lateDealProducts
      : products.slice(0, 5);
  const bundleProducts = products.slice(0, 4);

  const trustHighlights = [
    {
      id: "delivery",
      title: "10 - 15 min Delivery",
      subtitle: "Fast delivery at your doorstep",
      icon: FiClock,
    },
    {
      id: "price",
      title: "Best Price",
      subtitle: "Quality products, always",
      icon: FiPercent,
    },
    {
      id: "range",
      title: "Wide Product Range",
      subtitle: "Everything in one place",
      icon: FiPackage,
    },
    {
      id: "secure",
      title: "Secure Payments",
      subtitle: "Pay safely and confidently",
      icon: FiShield,
    },
  ];

  const normalizeCategoryValue = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const categorySections = [
    {
      key: "atta-rice-dal",
      title: "Atta, Rice & Dal",
      subtitle: "Everyday kitchen essentials",
      categoryMatches: [
        "atta-flour",
        "rice",
        "dal-pulses",
        "atta-rice-dal",
      ],
    },
    {
      key: "snacks-munchies",
      title: "Snacks & Munchies",
      subtitle: "Perfect for every craving",
      categoryMatches: ["snacks", "snacks-munchies"],
    },
    {
      key: "beverages",
      title: "Drinks & Beverages",
      subtitle: "Cool drinks for every mood",
      categoryMatches: ["beverages", "drinks-beverages"],
    },
    {
      key: "chocolate--confectionery",
      title: "Chocolates & Confectionery",
      subtitle: "Something sweet for everyone",
      categoryMatches: [
        "chocolate-confectionery",
        "chocolate--confectionery",
        "chocolates-confectionery",
      ],
    },
    {
      key: "home-cleaning",
      title: "Kitchen & Cleaning Essentials",
      subtitle: "Keep your home fresh",
      categoryMatches: [
        "home-cleaning",
        "kitchen-essentials",
        "kitchen-cleaning-essentials",
      ],
    },
    {
      key: "dairy-milk",
      title: "Dairy & Breakfast",
      subtitle: "Start your day right",
      categoryMatches: [
        "dairy-milk",
        "breakfast-cereals",
        "dairy-breakfast",
      ],
    },
  ];

  useEffect(() => {
    const loadCategorySections = async () => {
      setIsLoadingCategorySections(true);

      try {
        const [categoriesResult, productsResult] = await Promise.allSettled([
          fetchCategories(),
          fetchProducts(),
        ]);

        const categoryList =
          categoriesResult.status === "fulfilled"
            ? categoriesResult.value?.data?.categories || []
            : [];

        const productList =
          productsResult.status === "fulfilled"
            ? productsResult.value?.data?.products || []
            : [];

        const nextSectionProducts = {};

        categorySections.forEach((section) => {
          const matchedCategoryIds = new Set();

          categoryList.forEach((category) => {
            const categorySlug = normalizeCategoryValue(category.slug);
            const categoryName = normalizeCategoryValue(category.name);

            const matchesSectionCategory = section.categoryMatches.some((match) => {
              const normalizedMatch = normalizeCategoryValue(match);
              return categorySlug === normalizedMatch || categoryName === normalizedMatch;
            });

            if (matchesSectionCategory) {
              matchedCategoryIds.add(String(category._id));
            }
          });

          nextSectionProducts[section.key] = productList
            .filter((product) => {
              const productCategoryId = product.category?._id || product.category;
              return matchedCategoryIds.has(String(productCategoryId));
            })
            .slice(0, 6);
        });

        setSectionProducts(nextSectionProducts);
      } catch (error) {
        console.error("Category section products failed to load:", error);
      } finally {
        setIsLoadingCategorySections(false);
      }
    };

    loadCategorySections();
  }, []);

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="shrink-0 bg-linear-to-b from-emerald-100 via-emerald-50 to-white px-4 pb-3 pt-4">

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

                <h2 className="max-w-57.5 truncate text-[15px] font-bold text-gray-900">
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

          <section className="mt-3 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-emerald-100/70">
            <img
              src={banners[currentBanner]}
              alt="Fresh grocery essentials banner"
              className="block h-auto w-full object-cover"
            />
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
                                `/products?productId=${product._id}`
                              )
                            }
                            className="group cursor-pointer text-center"
                          >

                            {/* Product image */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/products?productId=${product._id}`
                                )
                              }
                              className="mx-auto flex h-19.5 w-19.5 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-[#f3faf5] transition duration-300 group-hover:scale-105 group-hover:border-emerald-200 group-hover:shadow-sm"
                              aria-label={`Open ${product.name} details`}
                            >

                              <img
                                src={image}
                                alt={product.name}
                                className="h-full w-full object-contain p-2"
                              />

                            </button>

                            {/* Weight */}
                            {weight && (
                              <p className="mt-1 text-[8px] font-medium text-gray-400">
                                {weight}
                              </p>
                            )}

                            {/* Product name */}
                            <p className="mt-1 line-clamp-2 min-h-7 px-1 text-[11px] font-semibold leading-3.5 text-gray-700">
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
              CATEGORY PRODUCT SECTIONS
          ================================================= */}

          <section className="mt-9 pb-6 sm:pb-4">

            {categorySections.map((section) => {
              const items = sectionProducts[section.key] || [];

              return (
                <div key={section.key} className="mt-9 first:mt-0">

                  <div className="mb-4 flex items-center justify-between">

                    <div>
                      <h2 className="text-[23px] font-extrabold tracking-tight text-gray-900">
                        {section.title}
                      </h2>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {section.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/products?category=${encodeURIComponent(section.key)}`)
                      }
                      className="shrink-0 whitespace-nowrap text-sm font-bold text-emerald-600"
                    >
                      See all
                    </button>
                  </div>

                  {isLoadingCategorySections ? (
                    <div className="py-8 text-center text-sm text-gray-500">
                      Loading products...
                    </div>
                  ) : items.length > 0 ? (
                    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide pb-1">
                      {items.map((item) => (
                        <div
                          key={item._id}
                          className="w-[160px] min-w-[160px] snap-start sm:w-[180px] sm:min-w-[180px]"
                        >
                          <ProductCard product={item} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-gray-500">
                      No products available
                    </div>
                  )}

                </div>
              );
            })}

          </section>

          {/* =================================================
              TODAY'S DEALS
          ================================================= */}

          <section className="mt-3 rounded-3xl bg-linear-to-r from-emerald-50 via-lime-50 to-emerald-100 px-4 py-4 shadow-sm ring-1 ring-emerald-100/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[23px] font-extrabold tracking-tight text-gray-900">
                  Today&apos;s Deals
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Grab the best offers before they&apos;re gone!
                </p>
              </div>

              <button
                onClick={() => navigate("/products")}
                className="text-sm font-bold text-emerald-600"
              >
                See all
              </button>
            </div>

            {dealProducts.length > 0 ? (
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {dealProducts.map((item, index) => {
                  const discount = 8 + index;
                  const originalPrice = Math.max(
                    Number(item.price || 0),
                    Number(item.price || 0) + Math.ceil(Number(item.price || 0) * (discount / 100))
                  );

                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => navigate(`/products?productId=${item._id}`)}
                      className="w-45 min-w-45 snap-start rounded-2xl bg-white p-2.5 text-left shadow-sm ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:shadow"
                    >
                      <div className="mb-2 inline-flex rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white">
                        {discount}% OFF
                      </div>

                      <div className="flex items-center gap-2">
                        <img
                          src={item.image || item.img || "https://via.placeholder.com/90"}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl bg-emerald-50 object-contain p-1"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-semibold text-gray-800">
                            {item.name}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-gray-900">
                              ₹{item.price}
                            </span>

                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{originalPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-white/80 px-3 py-6 text-center text-sm text-gray-500">
                Deals will appear once products are available
              </div>
            )}
          </section>

          {/* =================================================
              FREQUENTLY BOUGHT TOGETHER
          ================================================= */}

          <section className="mt-6 rounded-3xl bg-linear-to-r from-emerald-50 via-white to-emerald-50 px-4 py-4 shadow-sm ring-1 ring-emerald-100/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-[21px] font-extrabold tracking-tight text-gray-900">
                  Frequently Bought Together
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Save more when you buy together
                </p>
              </div>

              <button
                onClick={() => navigate("/products")}
                className="text-sm font-bold text-emerald-600"
              >
                See all
              </button>
            </div>

            {bundleProducts.length > 0 ? (
              <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-emerald-100">
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                  {bundleProducts.map((product, idx) => (
                    <React.Fragment key={product._id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/products?productId=${product._id}`)}
                        className="min-w-0 text-center"
                      >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 p-1.5">
                          <img
                            src={product.image || product.img || "https://via.placeholder.com/90"}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <p className="mt-1 max-w-16 truncate text-[10px] font-medium text-gray-600">
                          {product.name}
                        </p>
                      </button>

                      {idx < bundleProducts.length - 1 && (
                        <span className="text-sm font-bold text-emerald-500">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
                  <div>
                    <p className="text-xs text-gray-500">Bundle & Save</p>
                    <p className="text-lg font-extrabold text-emerald-700">
                      ₹
                      {bundleProducts
                        .reduce((sum, item) => sum + Number(item.price || 0), 0)
                        .toFixed(0)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >
                    View Bundle
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/80 px-3 py-6 text-center text-sm text-gray-500">
                Bundle suggestions will appear soon
              </div>
            )}
          </section>

          {/* =================================================
              WHY SHOP WITH US
          ================================================= */}

          <section className="mt-6 mb-6">
            <h2 className="text-[23px] font-extrabold tracking-tight text-gray-900">
              Why Shop With Us?
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {trustHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 inline-grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                      <Icon className="text-[15px]" />
                    </div>

                    <h3 className="text-[12px] font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-gray-500">
                      {item.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
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