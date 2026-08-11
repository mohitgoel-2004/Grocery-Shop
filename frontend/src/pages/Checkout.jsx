import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/context";
import toast from "react-hot-toast";
import { fetchProfile, placeOrder } from "../services/api";
import { useAddress } from "../Context/AddressContext";
import { getDeliverySettings } from "../services/deliverySettingsService";
import { createPaymentOrder } from "../services/paymentService";
import { FiArrowLeft, FiShoppingBag, FiTruck, FiClock, FiMapPin, FiCreditCard } from "react-icons/fi";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { defaultAddress } = useAddress();
  const [deliverySettings, setDeliverySettings] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchProfile();
        const user = response.data.user || {};

        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          phone: user.mobile || prev.phone,
        }));
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!defaultAddress) return;

    const formattedAddress = [
      defaultAddress.address,
      defaultAddress.city,
      defaultAddress.state,
      defaultAddress.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      address: formattedAddress,
    }));
  }, [defaultAddress]);

  useEffect(() => {
    const loadDeliverySettings = async () => {
      try {
        const settings = await getDeliverySettings();

        console.log("Checkout Delivery Settings:", settings);

        setDeliverySettings(settings);
      } catch (error) {
        console.error("Failed to load delivery settings:", error);

        toast.error("Unable to load delivery settings");
      }
    };

    loadDeliverySettings();
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + Number(item.price || 0) * item.qty,
      0,
    );
  }, [cart]);

  const delivery = useMemo(() => {
    if (!deliverySettings) {
      return 0;
    }

    if (!deliverySettings.isDeliveryChargeEnabled) {
      return 0;
    }

    if (subtotal >= Number(deliverySettings.freeDeliveryThreshold || 0)) {
      return 0;
    }

    return Number(deliverySettings.deliveryCharge || 0);
  }, [subtotal, deliverySettings]);

  const tax = useMemo(() => {
    return Math.round(subtotal * 0.05);
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + delivery + tax;
  }, [subtotal, delivery, tax]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openRazorpay = async () => {
    try {
      const order = await createPaymentOrder(total);

      console.log("ORDER =", order);
      console.log("TOTAL =", total);

      if (!order) {
        toast.error("Order not received");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Grocery Delivery",
        description: "Order Payment",
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },
        theme: {
          color: "#16a34a",
        },
        handler: function (response) {
          console.log("Payment Success:", response);
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log("ERROR =", err);
      console.log("RESPONSE =", err.response);
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.address) {
      toast.error("Please fill in delivery address.");
      return;
    }
    if (formData.paymentMethod === "upi") {
      return openRazorpay();
    }

    setIsPlacingOrder(true);

    try {
      const response = await placeOrder({
        paymentMethod: formData.paymentMethod,
        deliveryAddress: formData.address,
        fullName: formData.fullName,
        phone: formData.phone,
      });

      await clearCart();

      toast.success(response?.message || "Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">
        
        {/* Header - Matching Cart Page */}
        <div className="shrink-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-white px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Back"
            >
              <FiArrowLeft className="text-lg text-emerald-600" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Secure Checkout
              </p>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Checkout
              </h2>
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50 relative"
              aria-label="View cart"
            >
              <FiShoppingBag className="text-lg text-emerald-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 space-y-5">
          
          {/* Delivery Address Section */}
          <section className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-50">
                <FiMapPin className="text-emerald-600" size={16} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">
                Delivery Address
              </h3>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
              <textarea
                rows="3"
                name="address"
                placeholder="Complete Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 resize-none"
              />
            </div>
          </section>

          {/* Order Summary Section */}
          <section className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-50">
                <FiShoppingBag className="text-emerald-600" size={16} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">
                Order Summary
              </h3>
              <span className="ml-auto text-xs text-gray-400">
                {cart.length} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-emerald-50/50 px-3 py-2.5 border border-emerald-100/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-200/50 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                        {item.qty}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-gray-800 truncate">
                          {item.name}
                        </h4>
                        {item.weight && (
                          <p className="text-gray-400 text-[10px]">{item.weight}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-emerald-700 text-sm whitespace-nowrap ml-2">
                      ₹{(Number(item.price || 0) * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Payment Method Section */}
          <section className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-50">
                <FiCreditCard className="text-emerald-600" size={16} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">
                Payment Method
              </h3>
            </div>

            <div className="space-y-2.5">
              {[
                { value: "cod", label: "Cash on Delivery", icon: "💰" },
                { value: "upi", label: "UPI", icon: "📱" },
                { value: "card", label: "Credit / Debit Card", icon: "💳" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                    formData.paymentMethod === method.value
                      ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={formData.paymentMethod === method.value}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span className="text-sm">{method.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Bill Details Section */}
          <section className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-50">
                <FiTruck className="text-emerald-600" size={16} />
              </div>
              <h3 className="text-sm font-bold text-gray-800">
                Bill Details
              </h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-700">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium text-gray-700">
                  ₹{delivery.toFixed(2)}
                </span>
              </div>
              
              {deliverySettings &&
                deliverySettings.isDeliveryChargeEnabled &&
                subtotal < Number(deliverySettings.freeDeliveryThreshold || 0) && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2">
                    <FiClock className="text-emerald-500" size={14} />
                    <p className="text-xs text-emerald-700">
                      Add {(Number(deliverySettings.freeDeliveryThreshold || 0) - subtotal).toFixed(2)} more to get free delivery
                    </p>
                  </div>
                )}

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">GST</span>
                <span className="font-medium text-gray-700">
                  ₹{tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold text-emerald-700">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || cart.length === 0}
            className={`w-full rounded-2xl py-4 font-bold text-white text-base transition-all duration-300 flex items-center justify-center gap-2 ${
              isPlacingOrder || cart.length === 0
                ? "cursor-not-allowed bg-gray-300"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:scale-[1.01] shadow-lg shadow-emerald-200/50"
            }`}
          >
            {isPlacingOrder ? (
              <>
                <span className="animate-spin">⏳</span>
                Processing...
              </>
            ) : formData.paymentMethod === "cod" ? (
              "Place Order"
            ) : (
              "Pay Online"
            )}
          </button>

          {/* Secure note */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pb-2">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secure checkout · 100% safe</span>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Checkout;