import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
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
  // deliveryCharge,
  // tax,
  // total,
  // deliverySettings,
  minimumOrderValue,
} = useCart();

   useEffect(() => {
    const fetchDeliverySettings = async () => {
        try {
            const settings =
                await getDeliverySettings();

            setDeliverySettings(settings);
        } catch (error) {
            console.error(
                "Failed to fetch delivery settings:",
                error
            );
        }
    };

    fetchDeliverySettings();
}, []);
 

    const deliveryCharge = useMemo(() => {
  if (!deliverySettings) {
    return 0;
  }

  if (!deliverySettings.isDeliveryChargeEnabled) {
    return 0;
  }

  if (
    subtotal >= deliverySettings.freeDeliveryThreshold
  ) {
    return 0;
  }

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
      case "search":
        // navigate("/search");
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7f4_42%,#e9efe9_100%)] px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] md:min-h-[calc(100vh-2rem)] md:rounded-[36px] md:border md:border-white/60 lg:max-w-120">
        <div className="shrink-0 border-b border-[#eef0eb] bg-white/95 px-4 pt-4 pb-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate("/home")}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 shadow-sm transition hover:scale-105 hover:bg-[#eceff1]"
              aria-label="Back"
            >
              <FiArrowLeft className="text-lg" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                Mobile App
              </p>
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                My Cart
              </h2>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 shadow-sm transition hover:scale-105 hover:bg-[#eceff1]"
              aria-label="Browse products"
            >
              <FiShoppingBag className="text-lg" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2">
          <div className="mb-4 rounded-[28px] bg-linear-to-br from-[#e8f1ef] to-[#f7f8f6] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
              {itemCount} item{itemCount === 1 ? "" : "s"} in cart
            </div>
          </div>

          <div className="space-y-3">
            {isLoadingCart ? (
              <div className="py-10 text-center text-gray-500">Loading cart...</div>
            ) : items.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-[#d9ded8] bg-[#fafafa] py-12 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
                  <FiShoppingBag className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-gray-500">Add products to see them here.</p>
                <button
                  onClick={() => navigate("/products")}
                  className="mt-5 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-[28px] border border-[#eef0eb] bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-[#f8faf8] to-[#eef4ee]">
                      <img
                        src={item.image || "https://via.placeholder.com/96"}
                        alt={item.name}
                        className="h-full w-full object-contain p-2.5 transition duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="truncate text-[15px] font-semibold leading-tight text-gray-900">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{item.weight}</p>
                          <p className="mt-2 text-lg font-bold text-gray-900">
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

                      <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="grid h-9 w-9 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 transition hover:bg-[#e9ecef]"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <FiMinus className="text-sm" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-gray-900">
                          {String(item.qty).padStart(2, "0")}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="grid h-9 w-9 place-items-center rounded-full bg-[#111827] text-white transition hover:scale-105"
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

          {items.length > 0 && (
            <div className="mt-4 space-y-4 pb-6">
              <div className="rounded-[26px] border border-[#eef0eb] bg-[#fafafa] p-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3 rounded-[20px] bg-white px-3 py-3 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f3f4f6] text-gray-500">
                    <FiShoppingBag className="text-base" />
                  </div>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="Apply a promo code"
                    className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button className="rounded-xl bg-[#31c205] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]">
                    Apply
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#eef0eb] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Delivery</span>
                    <span className="font-semibold text-gray-900">{formatPrice(deliveryCharge)}</span>
                  </div>
                  {deliverySettings &&
  deliverySettings.isDeliveryChargeEnabled &&
  subtotal < deliverySettings.freeDeliveryThreshold && (
    <p className="mt-1 text-xs text-green-600">
      Add{" "}
      {formatPrice(
        deliverySettings.freeDeliveryThreshold - subtotal
      )}{" "}
      more to get free delivery
    </p>
  )}
                  <div className="border-t border-[#eef0eb] pt-3 flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">Total Cost</span>
                    <span className="text-xl font-bold text-[#31c205]">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              {deliverySettings &&
  subtotal < minimumOrderValue && (
    <div className="rounded-2xl bg-red-50 border border-red-200 p-3">
      <p className="text-sm font-semibold text-red-600">
        Minimum order value is {formatPrice(minimumOrderValue)}
      </p>

      <p className="mt-1 text-xs text-red-500">
        Add {formatPrice(minimumOrderValue - subtotal)} more to place your order.
      </p>
    </div>
)}

             <button
  onClick={() => navigate("/checkout")}
  disabled={
    subtotal < minimumOrderValue
  }
  className={`flex w-full items-center justify-center gap-3 rounded-3xl py-4 text-base font-semibold text-white transition ${
    subtotal < minimumOrderValue
      ? "cursor-not-allowed bg-gray-300"
      : "bg-[#31c205] hover:scale-[1.01]"
  }`}
>
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
