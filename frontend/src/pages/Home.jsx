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
  const navigate = useNavigate();
  const { unreadCount } = useNotification();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((previous) => (previous + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);

      try {
        const response = await fetchProducts();
        setProducts(response.data.products || []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setSuggestions(filtered.slice(0, 6)); // Maximum 6 suggestions
  }, [searchTerm, products]);

  const wrapperRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7f4_42%,#e9efe9_100%)] px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] md:min-h-[calc(100vh-2rem)] md:rounded-[36px] md:border md:border-white/60 lg:max-w-120">
        <header className="shrink-0 bg-white/95 px-4 pt-4 pb-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-green-400 to-emerald-600 shadow-md">
                <FiMapPin className="text-lg text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                  Deliver to
                </p>
                <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                  {defaultAddress
    ? `${defaultAddress.address}, ${defaultAddress.city}`
    : "Select Location"}
                </h2>
              </div>
            </div>

            <button  onClick={() => navigate("/notifications")}
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 shadow-sm transition hover:scale-105 hover:bg-[#eceff1]">
              <FiBell className="text-lg text-green-600" />
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
                {unreadCount}
              </span>
            </button>
          </div>

          <div className="mt-4 relative" ref={wrapperRef}>
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
              <FiSearch className="text-lg" />
            </div>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search fresh vegetables..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className={`h-12 w-full rounded-[22px] border bg-[#f7f8f6] pl-11 pr-20 text-sm text-gray-800 outline-none transition ${
                highlightSearch
                  ? "border-green-500 ring-4 ring-green-100"
                  : "border-[#e6e8e3]"
              }`}
            />
           {showSuggestions && searchTerm && (
  <div className="absolute top-14 left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto" ref={wrapperRef}>
    {suggestions.length > 0 ? (
      suggestions.map((product) => (
        <div
          key={product._id}
          onClick={() => {
            setSearchTerm(product.name);
            setShowSuggestions(false);
            navigate(`/product/${product._id}`);
          }}
          className="flex items-center gap-3 p-3 hover:bg-green-50 cursor-pointer transition"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover"
          />

          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              {product.name}
            </h3>

            <p className="text-green-600 font-bold">
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
            <button className="absolute right-1.5 top-1.5 rounded-xl bg-[#111827] px-4 py-1.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]">
              Search
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
          <section className="rounded-4xl bg-linear-to-br from-green-600 via-emerald-600 to-teal-600 p-5 text-white shadow-[0_22px_50px_rgba(16,185,129,0.28)]">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-[72%]">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
                  Limited Offer
                </div>
                <div className="flex items-center gap-2">
                  {offers[currentOffer].icon}
                  <span className="text-sm font-medium opacity-90">
                    Fresh picks for today
                  </span>
                </div>
                <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                  {offers[currentOffer].title}
                </h2>
                <p className="mt-2 text-base font-medium text-white/90">
                  {offers[currentOffer].subtitle}
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {offers[currentOffer].description}
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:scale-[1.01] hover:bg-black/15">
                  {offers[currentOffer].cta}
                  <FiArrowRight className="text-base" />
                </button>
              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-white/15 text-white/90 shadow-inner">
                {offers[currentOffer].icon}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentOffer(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentOffer ? "w-8 bg-white" : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to offer ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Categories
                </h2>
                <p className="text-sm text-gray-400">
                  Explore our fresh collection
                </p>
              </div>
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 transition hover:text-green-700">
                View All
                <FiArrowRight className="text-sm" />
              </button>
            </div>
            <CategoryList />
          </section>

          <section className="mt-10 pb-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Fresh Picks
                </h2>
                <p className="text-sm text-gray-400">
                  Handpicked vegetables just for you
                </p>
              </div>
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 transition hover:text-green-700">
                See All
                <FiArrowRight className="text-sm" />
              </button>
            </div>

            {isLoadingProducts ? (
              <div className="py-10 text-center text-gray-500">
                Loading products...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            )}
          </section>
        </div>

        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default Home;
