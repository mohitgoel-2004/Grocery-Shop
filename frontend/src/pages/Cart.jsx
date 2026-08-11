import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiTruck, FiClock, FiTag } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { useCart } from "../Context/context";
import { getDeliverySettings } from "../services/deliverySettingsService";

const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;

const Cart = () => {
  const [activeTab, setActiveTab] = useState("cart");
  const [promoCode, setPromoCode] = useState("");
  const [deliverySettings, setDeliverySettings] = useState(null);
  const navigate = useNavigate();

  const {
    cart,
    increaseQty,
    decreaseQty,
    removeItem,
    isLoadingCart,
    subtotal,
    minimumOrderValue,
  } = useCart();

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const settings = await getDeliverySettings();
        setDeliverySettings(settings);
      } catch (error) {
        console.error("Failed to fetch delivery settings:", error);
      }
    };
    fetchDeliverySettings();
  }, []);

  const deliveryCharge = useMemo(() => {
    if (!deliverySettings) return 0;
    if (!deliverySettings.isDeliveryChargeEnabled) return 0;
    if (subtotal >= deliverySettings.freeDeliveryThreshold) return 0;
    return deliverySettings.deliveryCharge;
  }, [subtotal, deliverySettings]);

  const total = useMemo(() => {
    return Number(subtotal || 0) + Number(deliveryCharge || 0);
  }, [subtotal, deliveryCharge]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    switch (tabId) {
      case "home":
        navigate("/home");
        break;
      case "cart":
        navigate("/cart");
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

  const items = cart;
  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.qty, 0),
    [items]
  );

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">
        
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-white px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate("/home")}
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Back"
            >
              <FiArrowLeft className="text-lg text-emerald-600" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Your Cart
              </p>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                My Cart
              </h2>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Browse products"
            >
              <FiShoppingBag className="text-lg text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4">
          
          {/* Cart Summary */}
          <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm">
                  <FiShoppingBag className="text-emerald-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {itemCount} item{itemCount === 1 ? "" : "s"} in cart
                  </p>
                  <p className="text-xs text-gray-500">Ready to checkout</p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-600">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-3">
            {isLoadingCart ? (
              <div className="py-10 text-center text-gray-500">Loading cart...</div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/30 py-12 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
                  <FiShoppingBag className="text-2xl text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-gray-500">Add products to see them here.</p>
                <button
                  onClick={() => navigate("/products")}
                  className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200/50 transition hover:bg-emerald-700 hover:scale-[1.01]"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-emerald-100/80 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-100/50"
                >
                  <div className="flex items-start gap-3">
                    {/* Product Image */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/30">
                      <img
                        src={item.image || "https://via.placeholder.com/96"}
                        alt={item.name}
                        className="h-full w-full object-contain p-2.5 transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="truncate text-[15px] font-semibold leading-tight text-gray-900">
                            {item.name}
                          </h4>
                          {item.weight && (
                            <p className="mt-0.5 text-xs text-gray-400">{item.weight}</p>
                          )}
                          <p className="mt-1.5 text-lg font-bold text-emerald-600">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label={`Remove ${item.name}`}
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-200 bg-white text-emerald-600 transition hover:bg-emerald-50 hover:border-emerald-300"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <FiMinus className="text-sm" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-bold text-gray-900">
                          {String(item.qty).padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 hover:scale-105"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          <FiPlus className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Section */}
          {items.length > 0 && (
            <div className="mt-6 space-y-4 pb-6">
              {/* Promo Code */}
              <div className="rounded-2xl border border-emerald-100/80 bg-white p-3 shadow-sm">
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50/50 px-3 py-2">
                  <FiTag className="text-emerald-500" size={18} />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="Apply promo code"
                    className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 hover:scale-[1.01]">
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Order Summary</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-emerald-100/50 pt-2.5">
                    <div className="flex items-center gap-2">
                      <FiTruck className="text-emerald-500" size={16} />
                      <span className="text-gray-500">Delivery</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatPrice(deliveryCharge)}</span>
                  </div>
                  
                  {deliverySettings &&
                    deliverySettings.isDeliveryChargeEnabled &&
                    subtotal < deliverySettings.freeDeliveryThreshold && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2">
                        <FiClock className="text-emerald-500" size={14} />
                        <p className="text-xs text-emerald-700">
                          Add {formatPrice(deliverySettings.freeDeliveryThreshold - subtotal)} more to get free delivery
                        </p>
                      </div>
                    )}

                  <div className="border-t-2 border-emerald-100 pt-3 flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-emerald-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Minimum Order Warning */}
              {deliverySettings && subtotal < minimumOrderValue && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-red-100">
                      <FiShoppingBag className="text-red-500" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-red-600">
                        Minimum order value is {formatPrice(minimumOrderValue)}
                      </p>
                      <p className="mt-0.5 text-xs text-red-500">
                        Add {formatPrice(minimumOrderValue - subtotal)} more to place your order.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                disabled={subtotal < minimumOrderValue}
                className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-base font-bold text-white transition ${
                  subtotal < minimumOrderValue
                    ? "cursor-not-allowed bg-gray-300"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.01] shadow-lg shadow-emerald-200/50"
                }`}
              >
                <FiShoppingBag className="text-lg" />
                Checkout Now
              </button>
            </div>
          )}
        </div>

        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default Cart;